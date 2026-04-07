package prayer

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"sync"

	secretmanager "cloud.google.com/go/secretmanager/apiv1"
	"cloud.google.com/go/secretmanager/apiv1/secretmanagerpb"
	"github.com/cloudevents/sdk-go/v2/event"
	"github.com/googleapis/google-cloudevents-go/cloud/firestoredata"
	"github.com/meilisearch/meilisearch-go"
	"google.golang.org/protobuf/proto"
)

var (
	meili     meilisearch.ServiceManager
	meiliOnce sync.Once
)

// getMeiliClient handles the secret lookup and client init safely
func getMeiliClient(ctx context.Context) meilisearch.ServiceManager {
	meiliOnce.Do(func() {
		meilihost := os.Getenv("MEILI_HOST")
		if meilihost == "" {
			meilihost = "https://saint-luke.net:7700"
		}

		secrets, err := secretmanager.NewClient(ctx)
		if err != nil {
			log.Fatalf("secretmanager.NewClient: %v", err)
		}
		defer secrets.Close()

		accessRequest := &secretmanagerpb.AccessSecretVersionRequest{
			Name: "projects/912288843295/secrets/meili/versions/latest",
		}

		result, err := secrets.AccessSecretVersion(ctx, accessRequest)
		if err != nil {
			log.Fatalf("secrets.AccessSecretVersion: %v", err)
		}

		meili = meilisearch.New(meilihost, meilisearch.WithAPIKey(string(result.Payload.Data)))
    })
	return meili
}

func UpdateMeiliSearch(ctx context.Context, e event.Event) error {
	meiliClient := getMeiliClient(ctx)

	var eventData firestoredata.DocumentEventData
	if err := proto.Unmarshal(e.Data(), &eventData); err != nil {
		return fmt.Errorf("proto.Unmarshal: %w", err)
	}

	// Determine ID from the resource name
	// Format: projects/{project}/databases/{database}/documents/prayers/{id}
	fullPath := eventData.GetValue().GetName()
	if fullPath == "" {
		// If Value is empty, the document was likely deleted
		fullPath = eventData.GetOldValue().GetName()
	}
	chunks := strings.Split(fullPath, "/")
	id := chunks[len(chunks)-1]

	index := meiliClient.Index("prayers")

	// Check if document was deleted (Value is nil in the proto if deleted)
	if eventData.GetValue() == nil || eventData.GetValue().GetFields() == nil {
		log.Printf("Removing %s from meili index", id)
		_, err := index.DeleteDocument(id,nil)
		return err
	}

	fields := eventData.GetValue().GetFields()
	getStr := func(key string) string {
		if val, ok := fields[key]; ok {
			return val.GetStringValue()
		}
		return ""
	}

	// Prep documents for Meili
	// Note: MeiliSearch documents usually work best with lower_case or camelCase keys
	documents := []map[string]interface{}{
		{
			"fsid":      id,
			"Author":    getStr("Author"),
			"Body":      getStr("Body"),
			"Name":      getStr("Name"),
			"Class":     getStr("Class"),
			"Reviewed":  getStr("Reviewed") == "true",
			"License":   getStr("License") == "true",
			"Hymn Tune": getStr("Hymn Tune"),
		},
	}

	_, err := index.UpdateDocuments(documents, nil)
	if err != nil {
		return fmt.Errorf("meilisearch.UpdateDocuments: %w", err)
	}

	log.Printf("Successfully updated %s in MeiliSearch", id)
	return nil
}
