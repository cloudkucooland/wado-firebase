package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
    "log"
    "strings"
    "bytes"
    "golang.org/x/net/html"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"

	"google.golang.org/api/iterator"
	"google.golang.org/api/option"

    "go.uber.org/ratelimit"
)

// this is not clean code, I  just banged it out to do a job once. Do not use this as an example of what you ought to do.

var fsclient *firestore.Client
var app *firebase.App

func main() {
	var err error

	config := &firebase.Config{ProjectID: "osl-dailyoffice"}

	app, err = firebase.NewApp(context.Background(), config, option.WithCredentialsFile("keyfile.json"))
	if err != nil {
		panic(err)
	}

	fsclient, err = app.Firestore(context.Background())
	if err != nil {
		panic(err)
	}

	ctx := context.Background()
	fetchLections(ctx)
}

func fetchLections(ctx context.Context) {
	done := 0
	batch := fsclient.BulkWriter(ctx)
    rl := ratelimit.New(1)

	iter := fsclient.Collection("prayers").Where("Class", "==", "lection").Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			panic(err)
		}
		data := doc.Data()

		// if it already has data, skip it.
		if len(data["Body"].(string)) > 50 || data["Body"].(string) == "Lectionary Placeholder" {
			continue
		}
        rl.Take() // one per second

		newBody, err := oremus(ctx, data["Name"].(string))
		if err != nil {
			panic(err)
		}
		fmt.Printf("%s: %s\n", data["Name"].(string), newBody)

		// BulkWriter must flush every 20 writes, do I need to do this or does BW take care of it for me?
		if done%20 == 0 {
			batch.Flush()
		}

        batch.Set(doc.Ref, map[string]interface{}{"Reviewed": false, "Body": newBody, "Author": "", "Last Editor": "Lection Autoupdate"}, firestore.MergeAll)
	}
	batch.End()
}

func oremus(ctx context.Context, ref string) (string, error) {
	c := http.Client{}
    data := url.Values{}
    data.Set("passage", ref)
    data.Set("vnum", "no")
    data.Set("fnote","no")
    data.Set("heading", "no")
    data.Set("show_ref", "no")
    data.Set("show_adj", "no")
    data.Set("omithidden", "yes")

	resp, err := c.PostForm("https://bible.oremus.org/", data)
	if err != nil {
		fmt.Println(err.Error())
		return "", err
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	if nil != err {
		fmt.Printf("%s\n", err.Error())
		return "", err
	}

    parsed, err := parse(string(body[:]))
	// fmt.Println(parsed)
    return string(parsed), nil
}

func parse(in string) (string, error) {
    var out bytes.Buffer

	doc, err := html.Parse(strings.NewReader(in))
	if err != nil {
		log.Fatal(err)
	}
	var f func(*html.Node, bool)
	f = func(n *html.Node, printing bool) {
		if n.Type == html.ElementNode && n.Data == "div" {
			for _, a := range n.Attr {
				if a.Key == "class" && a.Val == "bibletext" {
                    printing = true;
					break
				}
			}
		}
        if n.Type == html.TextNode && printing {
            out.WriteString(strings.TrimSpace(n.Data))
            out.WriteString(" ")
        }
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c, printing)
		}
	}
	f(doc, false)

    return out.String(), nil
}
