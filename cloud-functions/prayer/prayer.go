package prayer

import (
	"context"
	"log"
	"os"
	"time"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
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
	CreateTime time.Time   `json:"createTime"`
	Fields     PrayerData `json:"fields"`
	Name       string      `json:"name"`
	UpdateTime time.Time   `json:"updateTime"`
}

type PrayerData struct {
	Body struct { StringValue string `json:"stringValue"` } `json:"Body"`
	Name struct { StringValue string `json:"stringValue"` } `json:"Name"`
	Reviewed struct { StringValue string `json:"stringValue"` } `json:"Reviewed"`
	Class struct { StringValue string `json:"stringValue"` } `json:"Class"`
	License struct { StringValue string `json:"stringValue"` } `json:"License"`
	Author struct { StringValue string `json:"stringValue"` } `json:"Author"`
}

var projectID = os.Getenv("GOOGLE_CLOUD_PROJECT")
var meilihost = os.Getenv("MEILI_HOST")
var client *firestore.Client
var meili *meilisearch.Client

func init() {
	conf := &firebase.Config{ProjectID: projectID}
	ctx := context.Background()

	app, err := firebase.NewApp(ctx, conf)
	if err != nil {
		log.Fatalf("firebase.NewApp: %v", err)
	}

	client, err = app.Firestore(ctx)
	if err != nil {
		log.Fatalf("app.Firestore: %v", err)
	}

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
        Host: meilihost,
        APIKey: string(result.Payload.Data),
    })
}

func UpdateMeiliSearch(ctx context.Context, e FirestorePrayerEvent) error {
    needsupdate := false
	if e.Value.Fields.Body.StringValue != e.OldValue.Fields.Body.StringValue {
        needsupdate = true
    }
	if e.Value.Fields.Name.StringValue != e.OldValue.Fields.Name.StringValue {
        needsupdate = true
    }
	if e.Value.Fields.Author.StringValue != e.OldValue.Fields.Author.StringValue {
        needsupdate = true
    }
	if e.Value.Fields.Class.StringValue != e.OldValue.Fields.Class.StringValue {
        needsupdate = true
    }

    if !needsupdate {
        return nil
    }

	index := meili.Index("prayers")
    documents := make([]map[string]interface{}, 0)
    documents = append(documents, map[string]interface{}{
        "fsid": e.Value.Name,
        "Author": e.Value.Fields.Author.StringValue,
        "Body": e.Value.Fields.Body.StringValue,
        "Name": e.Value.Fields.Name.StringValue,
        "Class": e.Value.Fields.Class.StringValue,
        "Reviewed": e.Value.Fields.Reviewed.StringValue == "true",
        "License": e.Value.Fields.License.StringValue == "true",
    })

    _, err := index.UpdateDocuments(documents, "fsid")
    return err
}
