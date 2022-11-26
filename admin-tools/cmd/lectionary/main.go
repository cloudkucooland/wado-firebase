package main

import (
	"bytes"
	"context"
	"fmt"
	"golang.org/x/net/html"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strings"
	"unicode"

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

	/* d, err := ioutil.ReadFile("test.html")
	if err != nil {
		panic(err)
	}
	p, err := parse(string(d[:]))
	if err != nil {
		panic(err)
	}
	fmt.Println(p) */
}

func fetchLections(ctx context.Context) {
	done := 0
	batch := fsclient.BulkWriter(ctx)
	rl := ratelimit.New(1)

	// TODO, more than year A
	// TODO, not limit to ALL, some kind of filter for those already done
	iter := fsclient.Collection("lections/A/l").Documents(ctx)
	for {
		done = done + 1
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			panic(err)
		}
		data := doc.Data()

		// if it already has data, skip it.
		existing, ok := data["_evening"]
		if ok && len(existing.(string)) > 2 {
			continue
		}
		fmt.Printf("fetching for: %+v\n", data)

		rl.Take() // one per second
		e, err := oremus(ctx, data["evening"].(string))
		if err != nil {
			panic(err)
		}

		var ep string
		_, ok = data["_eveningpsalmref"]
		if !ok {
			rl.Take() // one per second
			ep, err = oremus(ctx, data["eveningpsalm"].(string))
			if err != nil {
				panic(err)
			}
		}

		rl.Take() // one per second
		m, err := oremus(ctx, data["morning"].(string))
		if err != nil {
			panic(err)
		}

		var mp string
		_, ok = data["_morningpsalmref"]
		if !ok {
			rl.Take() // one per second
			mp, err = oremus(ctx, data["morningpsalm"].(string))
			if err != nil {
				panic(err)
			}
		}

		// BulkWriter must flush every 20 writes, do I need to do this or does BW take care of it for me?
		if done%20 == 0 {
			fmt.Println("sending batch of 20")
			batch.Flush()
		}

		batch.Set(doc.Ref, map[string]interface{}{"_evening": e, "_morning": m, "_eveningpsalm": ep, "_morningpsalm": mp}, firestore.MergeAll)
	}
	batch.End()
}

func oremus(ctx context.Context, ref string) (string, error) {
	c := http.Client{}
	data := url.Values{}
	cleanref := strings.Trim(ref, "	")
	data.Set("passage", cleanref)
	data.Set("vnum", "no")
	data.Set("fnote", "no")
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
	if err != nil {
		fmt.Printf("%s\n", err.Error())
		return "", err
	}

	parsed, err := parse(string(body[:]))
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
					printing = true
					break
				}
			}
		}
		if n.Type == html.TextNode && printing {
			b := bytes.Buffer{}
			prevIsSpace := false

			for _, i := range n.Data {
				if unicode.IsSpace(i) {
					if !prevIsSpace {
						b.WriteRune(' ')
					}
					prevIsSpace = true
				} else {
					b.WriteRune(i)
					prevIsSpace = false
				}
			}
			trimmed := strings.TrimSpace(b.String())
			if trimmed != "" {
				out.WriteString("<p>")
				out.WriteString(trimmed)
				out.WriteString("</p>\n")
			}
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c, printing)
		}
	}
	f(doc, false)

	return out.String(), nil
}
