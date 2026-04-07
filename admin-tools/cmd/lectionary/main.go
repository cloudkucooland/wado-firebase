package main

import (
	"context"
	"errors"
	"log"
	"strings"
    "os"
    "os/signal"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"

	"google.golang.org/api/iterator"
	"google.golang.org/api/option"

	"github.com/cloudkucooland/go-oremus"
	"go.uber.org/ratelimit"
)

var fsclient *firestore.Client

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	config := &firebase.Config{ProjectID: "osl-dailyoffice"}
	app, err := firebase.NewApp(ctx, config, option.WithCredentialsFile("keyfile.json"))
	if err != nil {
		panic(err)
	}

	fsclient, err = app.Firestore(ctx)
	if err != nil {
		panic(err)
	}

	years := []string{"A", "B", "C"}
	for _, v := range years {
	    clearLectionsCache(ctx, v)
	    fetchLections(ctx, v, false)
    }
	validateReferences(ctx)
}

func clearLectionsCache(ctx context.Context, year string) {
	batch := fsclient.BulkWriter(ctx)
	rl := ratelimit.New(5)

	iter := fsclient.Collection("lections/" + year + "/l").Documents(ctx)
	for {
		if ctx.Err() != nil {
			return
		}
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
		if ctx.Err() != nil {
			return
		}
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

		_, err = batch.Set(doc.Ref, map[string]interface{}{"_evening": e, "_morning": m, "_morningpsalmref": mp, "_eveningpsalmref": ep}, firestore.MergeAll)
		if err != nil {
			log.Println(err.Error())
			continue
		}
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

	fields := []string{"morning", "morningpsalm", "evening", "eveningpsalm"}
	for _, doc := range docs {
		if ctx.Err() != nil {
			return ctx.Err()
		}
		d := doc.Data()
		towrite := make(map[string]interface{})

		for _, field := range fields {
			val, ok := d[field].(string)
			if ok && val != "" {
				res, err := oremus.CleanReference(val)
				if err == nil && res != val {
					log.Printf("[%s] => [%s] updating", val, res)
					towrite[field] = res
				}
			}
		}

		if len(towrite) > 0 {
			doc.Ref.Set(ctx, towrite, firestore.MergeAll)
		}
	}

	return nil
}
