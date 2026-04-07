package lectionary

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"sync"

	"cloud.google.com/go/firestore"
	"github.com/cloudevents/sdk-go/v2/event"
	"github.com/googleapis/google-cloudevents-go/cloud/firestore/v1"
	"google.golang.org/api/iterator"
	"google.golang.org/protobuf/proto"

	"github.com/cloudkucooland/go-oremus"
)

var (
	client     *firestore.Client
	clientOnce sync.Once
)

// getClient ensures we only initialize the Firestore client once per instance
func getClient(ctx context.Context) *firestore.Client {
	clientOnce.Do(func() {
		projectID := os.Getenv("GOOGLE_CLOUD_PROJECT")
		var err error
		// In Gen 2, the default credentials are usually sufficient without firebase.NewApp
		client, err = firestore.NewClient(ctx, projectID)
		if err != nil {
			log.Fatalf("firestore.NewClient: %v", err)
		}
	})
	return client
}

// GetOremus is now the Gen 2 Entry Point
func GetOremus(ctx context.Context, e event.Event) error {
	fsClient := getClient(ctx)

	// 1. Unmarshal the Eventarc data
	var data firestore.DocumentEventData
	if err := proto.Unmarshal(e.Data(), &data); err != nil {
		return fmt.Errorf("proto.Unmarshal: %w", err)
	}

	// 2. Identify the document from the event metadata
	// The path in Gen 2 events is usually full: projects/{p}/databases/(default)/documents/lectionary/{doc}
	fullPath := data.GetValue().GetName()
	pathParts := strings.Split(fullPath, "/documents/")
	if len(pathParts) < 2 {
		return fmt.Errorf("invalid document path: %s", fullPath)
	}
	doc := fsClient.Doc(pathParts[1])

	// 3. Helper to get string values from the Proto map (replaces your nested structs)
	fields := data.GetValue().GetFields()
	getStr := func(key string) string {
		if val, ok := fields[key]; ok {
			return val.GetStringValue()
		}
		return ""
	}

	morningPsalm := getStr("morningpsalm")
	morningRef   := getStr("morning")
	eveningPsalm := getStr("eveningpsalm")
	eveningRef   := getStr("evening")

	// 4. Update Psalm References if missing
	if getStr("_morningpsalmref") == "" && morningPsalm != "" {
		mpref, _ := psalmRef(ctx, fsClient, morningPsalm)
		doc.Set(ctx, map[string]any{"_morningpsalmref": mpref}, firestore.MergeAll)
	}

	if getStr("_eveningpsalmref") == "" && eveningPsalm != "" {
		epref, _ := psalmRef(ctx, fsClient, eveningPsalm)
		doc.Set(ctx, map[string]any{"_eveningpsalmref": epref}, firestore.MergeAll)
	}

	// 5. Clean References & Fetch Oremus
	mRefClean, _ := oremus.CleanReference(morningRef)
	if mRefClean != morningRef {
		doc.Set(ctx, map[string]any{"morning": mRefClean}, firestore.MergeAll)
	}

	// Prevent loops: Only fetch if cache is empty
	if getStr("_morning") == "" {
		morningBody, _ := oremus.Get(ctx, mRefClean)
		eveningBody, _ := oremus.Get(ctx, eveningRef) // assuming evening clean logic similar
		doc.Set(ctx, map[string]any{
			"_morning": morningBody,
			"_evening": eveningBody,
		}, firestore.MergeAll)
	}

	return nil
}

// Updated psalmRef to take the client directly
func psalmRef(ctx context.Context, fsClient *firestore.Client, ref string) (string, error) {
	cleanref := strings.TrimSpace(ref)
	if cleanref == "" {
		return "", fmt.Errorf("empty reference")
	}

	prayers := client.Collection("prayers")

	// check for existing
	q := prayers.Where("Name", "==", cleanref).Limit(1)
	iter := q.Documents(ctx)
	defer iter.Stop()
	doc, err := iter.Next()
	if err != nil && err != iterator.Done {
		return "", err
	}
	if doc != nil && doc.Ref != nil && doc.Ref.ID != "" {
		return doc.Ref.ID, nil
	}

	// fetch content
	body, err := oremus.Get(ctx, cleanref)
	if err != nil {
		return "", err
	}

	// create and save
	type Psalm struct {
		Body       string
		Class      string
		License    bool
		LastEdited string `firestore:"Last Edited"`
		LastEditor string `firestore:"Last Editor"`
		Name       string
		Reviewed   bool
	}
	newDoc, _, err := prayers.Add(ctx, Psalm{
		Body:       body,
		Class:      "psalm",
		License:    true,
		LastEdited: "auto",
		LastEditor: "lection auto-update",
		Name:       cleanref,
		Reviewed:   false,
	})
	if err != nil {
		return "", err
	}
    return "new-doc-id", nil
}
