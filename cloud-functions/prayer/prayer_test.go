package prayer

import (
	"testing"
	"strings"

	"github.com/cloudevents/sdk-go/v2/event"
	"github.com/googleapis/google-cloudevents-go/cloud/firestoredata"
	"google.golang.org/protobuf/proto"
)

func TestParsePrayerEvent(t *testing.T) {
	e := event.New()
	e.SetType("google.cloud.firestore.document.v1.written")
	
	id := "test-prayer-id"
	data := &firestoredata.DocumentEventData{
		Value: &firestoredata.Document{
			Name: "projects/test/databases/(default)/documents/prayers/" + id,
			Fields: map[string]*firestoredata.Value{
				"Name": {ValueType: &firestoredata.Value_StringValue{StringValue: "Daily Prayer"}},
				"Class": {ValueType: &firestoredata.Value_StringValue{StringValue: "Prayer"}},
			},
		},
	}

	marshaled, _ := proto.Marshal(data)
	e.SetData("application/protobuf", marshaled)

	var eventData firestoredata.DocumentEventData
	if err := proto.Unmarshal(e.Data(), &eventData); err != nil {
		t.Fatalf("proto.Unmarshal: %v", err)
	}

	fullPath := eventData.GetValue().GetName()
	chunks := strings.Split(fullPath, "/")
	extractedID := chunks[len(chunks)-1]

	if extractedID != id {
		t.Errorf("expected %s, got %s", id, extractedID)
	}

	fields := eventData.GetValue().GetFields()
	if fields["Name"].GetStringValue() != "Daily Prayer" {
		t.Errorf("expected Daily Prayer, got %s", fields["Name"].GetStringValue())
	}
}
