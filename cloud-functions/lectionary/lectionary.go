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
	"github.com/googleapis/google-cloudevents-go/cloud/firestoredata"
	"google.golang.org/api/iterator"
	"google.golang.org/protobuf/proto"

	"github.com/cloudkucooland/go-oremus"
)

var (
	client     *firestore.Client
	clientOnce sync.Once
)

func getClient(ctx context.Context) *firestore.Client {
	clientOnce.Do(func() {
		projectID := os.Getenv("GOOGLE_CLOUD_PROJECT")
		var err error
		client, err = firestore.NewClient(ctx, projectID)
		if err != nil {
			log.Fatalf("firestore.NewClient: %v", err)
		}
	})
	return client
}

func GetOremus(ctx context.Context, e event.Event) error {
	fsClient := getClient(ctx)

	var eventData firestoredata.DocumentEventData 
	if err := proto.Unmarshal(e.Data(), &eventData); err != nil {
		return fmt.Errorf("proto.Unmarshal: %w", err)
	}

	fullPath := eventData.GetValue().GetName()
	pathParts := strings.Split(fullPath, "/documents/")
	if len(pathParts) < 2 {
		return fmt.Errorf("invalid document path: %s", fullPath)
	}
	doc := fsClient.Doc(pathParts[1])

	fields := eventData.GetValue().GetFields()
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

	if getStr("_morningpsalmref") == "" && morningPsalm != "" {
		mpref, _ := psalmRef(ctx, fsClient, morningPsalm)
		doc.Set(ctx, map[string]any{"_morningpsalmref": mpref}, firestore.MergeAll)
	}

	if getStr("_eveningpsalmref") == "" && eveningPsalm != "" {
		epref, _ := psalmRef(ctx, fsClient, eveningPsalm)
		doc.Set(ctx, map[string]any{"_eveningpsalmref": epref}, firestore.MergeAll)
	}

	mRefClean, _ := oremus.CleanReference(morningRef)
	if mRefClean != "" && mRefClean != morningRef {
		doc.Set(ctx, map[string]any{"morning": mRefClean}, firestore.MergeAll)
	}

	if getStr("_morning") == "" && mRefClean != "" {
		morningBody, _ := oremus.Get(ctx, mRefClean)
		eveningBody, _ := oremus.Get(ctx, eveningRef)
		doc.Set(ctx, map[string]any{
			"_morning": morningBody,
			"_evening": eveningBody,
		}, firestore.MergeAll)
	}

	return nil
}

func psalmRef(ctx context.Context, fsClient *firestore.Client, ref string) (string, error) {
	cleanref := strings.TrimSpace(ref)
	if cleanref == "" {
		return "", fmt.Errorf("empty reference")
	}

	prayers := fsClient.Collection("prayers")

	q := prayers.Where("Name", "==", cleanref).Limit(1)
	iter := q.Documents(ctx)
	defer iter.Stop()
	existingDoc, err := iter.Next()
	if err != nil && err != iterator.Done {
		return "", err
	}
	if existingDoc != nil {
		return existingDoc.Ref.ID, nil
	}

	body, err := oremus.Get(ctx, cleanref)
	if err != nil {
		return "", err
	}

	type Psalm struct {
		Body       string
		Class      string
		License    bool
		LastEdited string `firestore:"Last Edited"`
		LastEditor string `firestore:"Last Editor"`
		Name       string
		Reviewed   bool
	}
	
	// FIXED: Use the returned newDoc.ID instead of a hardcoded string
	newDocRef, _, err := prayers.Add(ctx, Psalm{
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

	return newDocRef.ID, nil
}
