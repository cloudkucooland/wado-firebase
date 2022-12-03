package main

import (
	// "bytes"
	"context"
	"fmt"
	// "net/http"
	// "encoding/json"
	// "os"

	"cloud.google.com/go/firestore"
	// "google.golang.org/api/iterator"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"

	secretmanager "cloud.google.com/go/secretmanager/apiv1"
	"cloud.google.com/go/secretmanager/apiv1/secretmanagerpb"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"

	"github.com/meilisearch/meilisearch-go"
)

var client *auth.Client
var fsclient *firestore.Client
var app *firebase.App
var secrets *secretmanager.Client

func main() {
	var err error

	config := &firebase.Config{ProjectID: "osl-dailyoffice"}
	ctx := context.Background()

	app, err = firebase.NewApp(ctx, config, option.WithCredentialsFile("keyfile.json"))
	if err != nil {
		panic(err)
	}

	client, err = app.Auth(ctx)
	if err != nil {
		panic(err)
	}

	fsclient, err = app.Firestore(ctx)
	if err != nil {
		panic(err)
	}

	secrets, err = secretmanager.NewClient(ctx, option.WithCredentialsFile("keyfile.json"))
	if err != nil {
		panic(err)
	}
	defer secrets.Close()

	updateEditors(ctx)
	// revokeReviewed(ctx)
	// assocCleanup(ctx)
	// updateMeiliSearch(ctx)
	// purgeOldLectionary(ctx)
}

func updateEditors(ctx context.Context) {
	editors := []string{"PsfIgw0szbhCX14JEwCnR4XNxxz1", "E8axm9DyN7eZ2gh7pGs6CrPOJLD3", "idlyS5Ansvhj23AsKmdrC3Ufbcb2", "hBk6r6Wq8STqGxOoPhPWHGtXo8Q2", "1a5UG6WjcSeLOXgcmZJKbjt7Dav1", "8yFu045fSdY6OLfcE1A4oGPqct22"}

	for _, s := range editors {
		claims := map[string]interface{}{"role": "Editor"}
		err := client.SetCustomUserClaims(ctx, s, claims)
		if err != nil {
			panic(err)
		}
	}
}

// if there are a lot, run it multiple times. 500 is a limit of firestore
func revokeReviewed(ctx context.Context) {
	batch := fsclient.Batch()

	iter := fsclient.Collection("prayers").Where("Reviewed", "==", true).Limit(500).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			panic(err)
		}
		// fmt.Println(doc.Data())
		fmt.Println(doc.Ref.ID)
		batch.Set(doc.Ref, map[string]interface{}{"Reviewed": false}, firestore.MergeAll)
	}

	_, err := batch.Commit(ctx)
	if err != nil {
		panic(err)
	}
}

func updateMeiliSearch(ctx context.Context) {
	key, err := getMeiliKey(ctx)
	if err != nil {
		panic(err)
	}

	c := meilisearch.NewClient(meilisearch.ClientConfig{
		Host:   "https://osl.indievisible.org:7700",
		APIKey: key,
	})
	// c.DeleteIndex("prayers")

	index := c.Index("prayers")
	_, err = index.UpdateFilterableAttributes(&[]string{"Class", "License", "Reviewed"})
	if err != nil {
		panic(err)
	}

	var documents []map[string]interface{}

	iter := fsclient.Collection("prayers").Where("License", "==", true).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			panic(err)
		}

		mm := doc.Data()
		mm["fsid"] = doc.Ref.ID
		documents = append(documents, mm)
	}

	_, err = index.AddDocumentsInBatches(documents, 50, "fsid")
	if err != nil {
		panic(err)
	}
}

func purgeOldLectionary(ctx context.Context) {
	batch := fsclient.Batch()

	iter := fsclient.Collection("associations").Where("Location", "==", "LAUDS-PSALTER-ANTIPHON").Limit(500).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			panic(err)
		}
		fmt.Println(doc.Ref.ID)
		batch.Delete(doc.Ref)
	}

	_, err := batch.Commit(ctx)
	if err != nil {
		panic(err)
	}
}

func getMeiliKey(ctx context.Context) (string, error) {
	accessRequest := &secretmanagerpb.AccessSecretVersionRequest{
		Name: "projects/912288843295/secrets/meili/versions/latest",
	}

	result, err := secrets.AccessSecretVersion(ctx, accessRequest)
	if err != nil {
		return "", err
	}
	return string(result.Payload.Data), nil
}
