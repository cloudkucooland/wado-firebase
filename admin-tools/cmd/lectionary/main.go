package main

import (
	"bytes"
	"context"
	"errors"
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

var fsclient *firestore.Client

func main() {
	var err error
	var app *firebase.App

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
	fetchLections(ctx, "A", true)
	fetchLections(ctx, "B", false)
	fetchLections(ctx, "C", false)
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
		e, err := oremus(ctx, data["evening"].(string))
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
		m, err := oremus(ctx, data["morning"].(string))
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
	cleanref := strings.Trim(ref, " ")
	if cleanref == "" {
		return "", errors.New("bad ref")
	}

	prayers := fsclient.Collection("prayers")

	// check for existing
	// log.Printf("looking for %s\n", cleanref)
	q := prayers.Where("Name", "==", cleanref).Limit(1)
	iter := q.Documents(ctx)
	defer iter.Stop()
	doc, err := iter.Next()
	if err != nil && err != iterator.Done {
		return "", err
	}
	if doc != nil && doc.Ref != nil && doc.Ref.ID != "" {
		// log.Printf("found psalm ref for %s: %s\n", cleanref, doc.Ref.ID)
		return doc.Ref.ID, nil
	}

	// log.Printf("creating %s\n", cleanref)
	// fetch content
	body, err := oremus(ctx, cleanref)
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
	log.Printf("created %s: %s\n", cleanref, newDoc.ID)
	return newDoc.ID, err
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
	return parsed, nil
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
			// hit EOF -- cleanup double-spaces on the way out
			b := bytes.Buffer{}
			prevIsSpace := false

			for {
				i, _, err := out.ReadRune()
				if err != nil {
					return b.String()
				}
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
			return b.String()
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
