package main

import (
	// "bytes"
	"context"
	"fmt"
	// "net/http"
	// "encoding/json"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	// "google.golang.org/api/iterator"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"

	secretmanager "cloud.google.com/go/secretmanager/apiv1"
	"cloud.google.com/go/secretmanager/apiv1/secretmanagerpb"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"

	"github.com/meilisearch/meilisearch-go"
	"github.com/urfave/cli/v2"
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

	app := &cli.App{
		Name:    "wado-admin",
		Version: "v0.0.0",
		Authors: []*cli.Author{
			{
				Name:  "Scot C. Bontrager",
				Email: "scot@saint-luke.net",
			},
		},
		Copyright: "© 2022 Scot C. Bontrager",
		HelpName:  "wado-admin",

		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:    "key",
				Aliases: []string{"k"},
				Value:   "keyfile.json",
				Usage:   "Google Keyfile",
			},
		},
		Commands: []*cli.Command{
			{
				Name:    "editor",
				Aliases: []string{"e"},
				Usage:   "set access to editor",
				Action: func(cCtx *cli.Context) error {
					fmt.Println("set to editor: ", cCtx.Args().First())
					setEditor(ctx, cCtx.Args().First())
					return nil
				},
			},
			{
				Name:    "media",
				Aliases: []string{"m"},
				Usage:   "set access to media manager",
				Action: func(cCtx *cli.Context) error {
					fmt.Println("set to media manager: ", cCtx.Args().First())
					setMediaManager(ctx, cCtx.Args().First())
					return nil
				},
			},
			{
				Name:    "user",
				Aliases: []string{"u"},
				Usage:   "set access to user",
				Action: func(cCtx *cli.Context) error {
					setUser(ctx, cCtx.Args().First())
					return nil
				},
			},
			{
				Name:    "list",
				Aliases: []string{"l"},
				Usage:   "list users with roles",
				Action: func(cCtx *cli.Context) error {
                    listUsers(ctx, false);
					return nil
				},
			},
			{
				Name:    "listall",
				Aliases: []string{"L"},
				Usage:   "list all users",
				Action: func(cCtx *cli.Context) error {
                    listUsers(ctx, true);
					return nil
				},
			},
			{
				Name:    "meili",
				Aliases: []string{"M"},
				Usage:   "update meili search",
				Action: func(cCtx *cli.Context) error {
					fmt.Println("updating meili")
					updateMeiliSearch(ctx, false)
					return nil
				},
			},
			{
				Name:  "meilifull",
				Usage: "reindex meili search",
				Action: func(cCtx *cli.Context) error {
					fmt.Println("full reindexing meili")
					updateMeiliSearch(ctx, true)
					return nil
				},
			},
			{
				Name:  "unreview",
				Usage: "remove reviewd bit from all prayers",
				Action: func(cCtx *cli.Context) error {
					fmt.Println("unreviewing all")
					revokeReviewed(ctx)
					return nil
				},
			},
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}

func setEditor(ctx context.Context, s string) {
	claims := map[string]interface{}{"role": "Editor"}
	err := client.SetCustomUserClaims(ctx, s, claims)
	if err != nil {
		panic(err)
	}
}

func setMediaManager(ctx context.Context, s string) {
	claims := map[string]interface{}{"role": "Media"}
	err := client.SetCustomUserClaims(ctx, s, claims)
	if err != nil {
		panic(err)
	}
}

func setUser(ctx context.Context, s string) {
	claims := map[string]interface{}{}
	err := client.SetCustomUserClaims(ctx, s, claims)
	if err != nil {
		panic(err)
	}
}

func listUsers(ctx context.Context, all bool) {
    ui := client.Users(ctx, "")

    for {
        user, err := ui.Next()
        if err != nil && err == iterator.Done {
            break;
        }
        if err != nil {
            panic(err)
        }
        if all || len(user.CustomClaims) > 0 {
            role, ok := user.CustomClaims["role"]
            if !ok {
                role = "User"
            }
            fmt.Printf("%s\t%s\t%s\n", user.UserRecord.UserInfo.UID, role, user.UserRecord.UserInfo.DisplayName)
        }
    }
}

// if there are a lot, run it multiple times. 500 is a limit of firestore
func revokeReviewed(ctx context.Context) {
	// 2025-08 batch is deprecated, For bulk read and write operations, use `BulkWriter`
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

func updateMeiliSearch(ctx context.Context, hardreset bool) {
	key, err := getMeiliKey(ctx)
	if err != nil {
		panic(err)
	}

	c := meilisearch.New(
		"https://saint-luke.net:7700",
		meilisearch.WithAPIKey(key),
	)
	if hardreset {
		c.DeleteIndex("prayers")
	}

	index := c.Index("prayers")
	attr := []interface{}{"Class", "License", "Reviewed"}
	_, err = index.UpdateFilterableAttributes(&attr)
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

	fsid := "fsid"
	_, err = index.AddDocumentsInBatches(documents, 50, &fsid)
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
