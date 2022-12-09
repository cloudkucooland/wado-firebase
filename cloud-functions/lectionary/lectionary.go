package lectionary

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/iterator"

	"github.com/cloudkucooland/go-oremus"
)

type FirestoreLectionEvent struct {
	OldValue   FirestoreLectionValue `json:"oldValue"`
	Value      FirestoreLectionValue `json:"value"`
	UpdateMask struct {
		FieldPaths []string `json:"fieldPaths"`
	} `json:"updateMask"`
}

type FirestoreLectionValue struct {
	CreateTime time.Time   `json:"createTime"`
	Fields     LectionData `json:"fields"`
	Name       string      `json:"name"`
	UpdateTime time.Time   `json:"updateTime"`
}

type LectionData struct {
	Morning struct { StringValue string `json:"stringValue"` } `json:"morning"`
	MorningTitle struct { StringValue string `json:"stringValue"` } `json:"morningtitle"`
	MorningCache struct { StringValue string `json:"stringValue"` } `json:"_morning"`
	MorningPsalm struct { StringValue string `json:"stringValue"` } `json:"morningpsalm"`
	MorningPsalmRef struct { StringValue string `json:"stringValue"` } `json:"_morningpsalmref"`
	Evening struct { StringValue string `json:"stringValue"` } `json:"evening"`
	EveningTitle struct { StringValue string `json:"stringValue"` } `json:"eveningtitle"`
	EveningCache struct { StringValue string `json:"stringValue"` } `json:"_evening"`
	EveningPsalm struct { StringValue string `json:"stringValue"` } `json:"eveningpsalm"`
	EveningPsalmRef struct { StringValue string `json:"stringValue"` } `json:"_eveningpsalmref"`
	Season struct { StringValue string `json:"stringValue"` } `json:"season"`
	Proper struct { StringValue string `json:"integerValue"` } `json:"proper"`
	Weekday struct { StringValue string `json:"integerValue"` } `json:"weekday"`
}

var projectID = os.Getenv("GOOGLE_CLOUD_PROJECT")
var client *firestore.Client

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
}

// this costs 3-5 writes per, but should be infrequent enough
// batch or transaction ?
func GetOremus(ctx context.Context, e FirestoreLectionEvent) error {
	fullPath := strings.Split(e.Value.Name, "/documents/")[1]
	pathParts := strings.Split(fullPath, "/")
	collection := pathParts[0]
	docPath := strings.Join(pathParts[1:], "/")
	doc := client.Collection(collection).Doc(docPath)

	// update the psalm references if they are empty
	if e.Value.Fields.MorningPsalmRef.StringValue == "" {
		mpref, err := psalmRef(ctx, e.Value.Fields.MorningPsalm.StringValue)
		_, err = doc.Set(ctx, map[string]interface{}{"_morningpsalmref": mpref}, firestore.MergeAll)
		if err != nil {
			log.Fatalf("Set MPRef: %v", err)
		}
	}

	if e.Value.Fields.EveningPsalmRef.StringValue == "" {
		epref, err := psalmRef(ctx, e.Value.Fields.EveningPsalm.StringValue)
		_, err = doc.Set(ctx, map[string]interface{}{"_eveningpsalmref": epref}, firestore.MergeAll)
		if err != nil {
			log.Fatalf("Set EPRef: %v", err)
		}
	}

    mRefClean, err := oremus.CleanReference(e.Value.Fields.Morning.StringValue)
    if err != nil {
        log.Printf("[%s] => [%s]: %v", e.Value.Fields.Morning.StringValue, mRefClean, err)
        mRefClean = e.Value.Fields.Morning.StringValue
    }
    if  mRefClean != e.Value.Fields.Morning.StringValue {
	   _, err = doc.Set(ctx, map[string]interface{}{"morning": mRefClean}, firestore.MergeAll)
      if err != nil {
          log.Fatalf("Clean Morning: %v", err)
      }
    }

    eRefClean, err := oremus.CleanReference(e.Value.Fields.Evening.StringValue)
    if err != nil {
        log.Printf("[%s] => [%s]: %v", e.Value.Fields.Evening.StringValue, eRefClean, err)
        eRefClean = e.Value.Fields.Evening.StringValue
    }
    if  eRefClean != e.Value.Fields.Morning.StringValue {
	   _, err = doc.Set(ctx, map[string]interface{}{"evening": eRefClean}, firestore.MergeAll)
      if err != nil {
          log.Fatalf("Clean Evening: %v", err)
      }
    }

	// prevent loops -- the UI clears all cache entries if necessary
	if e.Value.Fields.MorningCache.StringValue != "" {
		return nil
	}
	morning, err := oremus.Get(ctx, mRefClean)
	if err != nil {
		log.Fatalf("FetchOremus morning: %v", err)
	}
	evening, err := oremus.Get(ctx, eRefClean)
	if err != nil {
		log.Fatalf("FetchOremus evening: %v", err)
	}
	_, err = doc.Set(ctx, map[string]interface{}{"_evening": evening, "_morning": morning}, firestore.MergeAll)
	if err != nil {
		log.Fatalf("M/E Cache Set: %v", err)
	}

	return nil
}

func psalmRef(ctx context.Context, ref string) (string, error) {
	cleanref := strings.Trim(ref, " ")
	if cleanref == "" {
		return "", fmt.Errorf("bad reference")
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
	return newDoc.ID, err
}

