package main

import (
	"bytes"
	"context"
	"fmt"
	"golang.org/x/net/html"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"

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

	/* p, err := oremus(ctx, "Luke 18")
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
		done++
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
		// fmt.Printf("fetching for: %+v\n", data)

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

	parsed := parse(string(body[:]))
	return string(parsed), nil
}

func parse(in string) string {
	z := html.NewTokenizer(strings.NewReader(in))
	var out = bytes.Buffer{}
	var inLection = false
	var passageDepth = 0

	for {
		tt := z.Next()
		switch tt {
		case html.ErrorToken:
			return out.String() // hit EOF
		case html.TextToken:
			if inLection {
				out.Write(z.Text())
			}
		case html.StartTagToken:
			tn, hasAttr := z.TagName()
			if inLection {
				switch string(tn) {
				case "p":
					out.WriteString("<p>")
				case "nn":
					out.WriteString("<i>")
				case "span":
					out.WriteString(" <span class='adonai'>")
				default:
					// fmt.Printf("%+v\n", string(tn))
				}
				passageDepth++
			}
			if hasAttr {
				for hasAttr {
					ta, val, attr := z.TagAttr()
					hasAttr = attr
					if string(ta) == "class" && string(val) == "bibletext" {
						inLection = true
					}
				}
			}
		case html.EndTagToken:
			if inLection {
				tn, _ := z.TagName()
				switch string(tn) {
				case "p":
					out.WriteString("</p>\n")
				case "nn":
					out.WriteString("</i>")
				case "span":
					out.WriteString("</span> ")
				default:
					// fmt.Printf("%+v\n", string(tn))
				}
				if passageDepth == 0 {
					inLection = false
				}
				passageDepth--
			}
		case html.SelfClosingTagToken:
			if inLection {
				out.WriteString(" ")
			}
		}
	}

	// not reached
	return out.String()
}
