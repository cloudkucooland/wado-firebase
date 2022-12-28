package prayer

import (
	"context"
	"log"
	"os"
	"strings"
	"time"

	secretmanager "cloud.google.com/go/secretmanager/apiv1"
	"cloud.google.com/go/secretmanager/apiv1/secretmanagerpb"

	"github.com/meilisearch/meilisearch-go"
)

type FirestorePrayerEvent struct {
	OldValue   FirestorePrayerValue `json:"oldValue"`
	Value      FirestorePrayerValue `json:"value"`
	UpdateMask struct {
		FieldPaths []string `json:"fieldPaths"`
	} `json:"updateMask"`
}

type FirestorePrayerValue struct {
	CreateTime time.Time  `json:"createTime"`
	Fields     PrayerData `json:"fields"`
	Name       string     `json:"name"`
	UpdateTime time.Time  `json:"updateTime"`
}

type PrayerData struct {
	Body struct {
		StringValue string `json:"stringValue"`
	} `json:"Body"`
	Name struct {
		StringValue string `json:"stringValue"`
	} `json:"Name"`
	Reviewed struct {
		StringValue string `json:"stringValue"`
	} `json:"Reviewed"`
	Class struct {
		StringValue string `json:"stringValue"`
	} `json:"Class"`
	License struct {
		StringValue string `json:"stringValue"`
	} `json:"License"`
	Author struct {
		StringValue string `json:"stringValue"`
	} `json:"Author"`
	HymnTune struct {
		StringValue string `json:"stringValue"`
	} `json:"Hymn Tune"`
}

var meilihost = os.Getenv("MEILI_HOST")
var meili *meilisearch.Client

func init() {
	ctx := context.Background()

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

	meili = meilisearch.NewClient(meilisearch.ClientConfig{
		Host:   meilihost,
		APIKey: string(result.Payload.Data),
	})
}

func UpdateMeiliSearch(ctx context.Context, e FirestorePrayerEvent) error {
	chunks := strings.Split(e.Value.Name, "/")
	id := chunks[len(chunks)-1]

	index := meili.Index("prayers")
	documents := make([]map[string]interface{}, 0)
	documents = append(documents, map[string]interface{}{
		"fsid":      id,
		"Author":    e.Value.Fields.Author.StringValue,
		"Body":      e.Value.Fields.Body.StringValue,
		"Name":      e.Value.Fields.Name.StringValue,
		"Class":     e.Value.Fields.Class.StringValue,
		"Reviewed":  e.Value.Fields.Reviewed.StringValue == "true",
		"License":   e.Value.Fields.License.StringValue == "true",
		"Hymn Tune": e.Value.Fields.HymnTune.StringValue,
	})

	_, err := index.UpdateDocuments(documents, "fsid")
	return err
}
