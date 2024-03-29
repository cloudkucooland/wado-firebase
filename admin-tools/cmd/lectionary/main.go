package main

import (
	"context"
	"errors"
	"log"
	"strings"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"

	"google.golang.org/api/iterator"
	"google.golang.org/api/option"

	"github.com/cloudkucooland/go-oremus"
	"go.uber.org/ratelimit"
)

var fsclient *firestore.Client

func main() {
	ctx := context.Background()
	config := &firebase.Config{ProjectID: "osl-dailyoffice"}
	app, err := firebase.NewApp(ctx, config, option.WithCredentialsFile("keyfile.json"))
	if err != nil {
		panic(err)
	}

	fsclient, err = app.Firestore(ctx)
	if err != nil {
		panic(err)
	}

	// years := []string{"A", "B", "C"}
	// for _, v := range years {
	// clearLectionsCache(ctx, y)
	// fetchLections(ctx, y, false)
	//}
	validateReferences(ctx)
}

func clearLectionsCache(ctx context.Context, year string) {
	batch := fsclient.BulkWriter(ctx)
	rl := ratelimit.New(5)

	iter := fsclient.Collection("lections/" + year + "/l").Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			panic(err)
		}
		rl.Take() // don't overload oremus via the trigger
		_, err = batch.Update(doc.Ref, []firestore.Update{
			{Path: "_morning", Value: firestore.Delete},
			{Path: "_evening", Value: firestore.Delete},
			{Path: "_morningpsalm", Value: firestore.Delete},
			{Path: "_eveningpsalm", Value: firestore.Delete},
			{Path: "_morningpsalmref", Value: firestore.Delete},
			{Path: "_eveningpsalmref", Value: firestore.Delete},
		})
		if err != nil {
			panic(err)
		}
	}
	batch.End()
}

func fetchLections(ctx context.Context, year string, force bool) {
	batch := fsclient.BulkWriter(ctx)
	rl := ratelimit.New(1)

	iter := fsclient.Collection("lections/" + year + "/l").Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			panic(err)
		}
		data := doc.Data()

		// if it already has morning data cached, skip whole block.
		_, ok := data["_morning"]
		if ok && !force {
			continue
		}

		rl.Take()
		e, err := oremus.Get(ctx, data["evening"].(string))
		if err != nil {
			log.Println(err.Error())
			continue
		}

		var ep string
		ep, ok = data["_eveningpsalmref"].(string)
		// check to make sure the ref is valid
		if !ok || force {
			rl.Take()
			ep, err = psalmRef(ctx, data["eveningpsalm"].(string))
			if err != nil {
				log.Println(err.Error())
				continue
			}
		}

		rl.Take()
		m, err := oremus.Get(ctx, data["morning"].(string))
		if err != nil {
			log.Println(err.Error())
			continue
		}

		var mp string
		mp, ok = data["_morningpsalmref"].(string)
		// check to make sure the ref is valid
		if !ok || force {
			rl.Take()
			mp, err = psalmRef(ctx, data["morningpsalm"].(string))
			if err != nil {
				log.Println(err.Error())
				continue
			}
		}

		batch.Set(doc.Ref, map[string]interface{}{"_evening": e, "_morning": m, "_morningpsalmref": mp, "_eveningpsalmref": ep}, firestore.MergeAll)
	}
	batch.End()
}

func psalmRef(ctx context.Context, ref string) (string, error) {
	cleanref := strings.TrimSpace(ref)
	if cleanref == "" {
		return "", errors.New("bad ref")
	}

	prayers := fsclient.Collection("prayers")

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
	if body == "" {
		return "", errors.New("oremus returned empty result")
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
	log.Printf("created %s: %s\n", cleanref, newDoc.ID)
	return newDoc.ID, err
}

func validateReferences(ctx context.Context) error {
	docs, err := fsclient.Collection("lections/A/l").Documents(ctx).GetAll()
	if err != nil {
		log.Println(err.Error())
		return err
	}

	for _, doc := range docs {
		d := doc.Data()
		writeback := false
		towrite := make(map[string]interface{})

		morning, ok := d["morning"]
		if ok && morning != "" {
			res, err := oremus.CleanReference(morning.(string))
			if err != nil {
				log.Printf("[%s]: %s", morning.(string), err.Error())
				continue
			}
			if res != morning.(string) {
				log.Printf("[%s] => [%s] did not round-trip cleanly", morning.(string), res)
				towrite["morning"] = res
				writeback = true
			}
		}

		morningpsalm, ok := d["morningpsalm"]
		if ok && morningpsalm != "" {
			res, err := oremus.CleanReference(morningpsalm.(string))
			if err != nil {
				log.Printf("[%s]: %s", morningpsalm.(string), err.Error())
				continue
			}
			if res != morningpsalm.(string) {
				log.Printf("[%s] => [%s] did not round-trip cleanly", morningpsalm.(string), res)
				towrite["morningpsalm"] = res
				writeback = true
			}
		}

		evening, ok := d["evening"]
		if ok && evening != "" {
			res, err := oremus.CleanReference(evening.(string))
			if err != nil {
				log.Printf("[%s]: %s", evening.(string), err.Error())
				continue
			}
			if res != evening.(string) {
				log.Printf("[%s] => [%s] did not round-trip cleanly", evening.(string), res)
				towrite["evening"] = res
				writeback = true
			}
		}

		eveningpsalm, ok := d["eveningpsalm"]
		if ok && eveningpsalm != "" {
			res, err := oremus.CleanReference(eveningpsalm.(string))
			if err != nil {
				log.Printf("[%s]: %s", eveningpsalm.(string), err.Error())
				continue
			}
			if res != evening.(string) {
				log.Printf("[%s] => [%s] did not round-trip cleanly", eveningpsalm.(string), res)
				towrite["eveningpsalm"] = res
				writeback = true
			}
		}
		if writeback {
			doc.Ref.Set(ctx, towrite, firestore.MergeAll)
		}
	}

	return nil
}
