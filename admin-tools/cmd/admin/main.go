package main

import (
	"context"
	"fmt"

	"cloud.google.com/go/firestore"
	// "google.golang.org/api/iterator"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"

	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

var client *auth.Client
var fsclient *firestore.Client
var app *firebase.App

func main() {
	var err error

	config := &firebase.Config{ProjectID: "osl-dailyoffice"}

	app, err = firebase.NewApp(context.Background(), config, option.WithCredentialsFile("keyfile.json"))
	if err != nil {
		panic(err)
	}

	client, err = app.Auth(context.Background())
	if err != nil {
		panic(err)
	}

	fsclient, err = app.Firestore(context.Background())
	if err != nil {
		panic(err)
	}

	// updateEditors()
	// revokeReviewed()
	assocCleanup()
}

func updateEditors() {
	editors := []string{"PsfIgw0szbhCX14JEwCnR4XNxxz1", "E8axm9DyN7eZ2gh7pGs6CrPOJLD3", "idlyS5Ansvhj23AsKmdrC3Ufbcb2", "hBk6r6Wq8STqGxOoPhPWHGtXo8Q2", "1a5UG6WjcSeLOXgcmZJKbjt7Dav1"}

	for _, s := range editors {
		claims := map[string]interface{}{"role": "Editor"}
		err := client.SetCustomUserClaims(context.Background(), s, claims)
		if err != nil {
			panic(err)
		}
	}
}

// if there are a lot, run it multiple times. 500 is a limit of firestore
func revokeReviewed() {
	batch := fsclient.Batch()

	iter := fsclient.Collection("prayers").Where("Reviewed", "==", true).Limit(500).Documents(context.Background())
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

	_, err := batch.Commit(context.Background())
	if err != nil {
		panic(err)
	}
}

func assocCleanup() {
	batch := fsclient.Batch()

	iter := fsclient.Collection("associations").Where("Season", "==", "easter").Where("Location", "==", "LAUDS-LECTIONARY").Limit(500).Documents(context.Background())
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			panic(err)
		}
		fmt.Println(doc.Ref.ID)
		batch.Set(doc.Ref, map[string]interface{}{"Season": "greatfifty"}, firestore.MergeAll)
	}

	_, err := batch.Commit(context.Background())
	if err != nil {
		panic(err)
	}
}

