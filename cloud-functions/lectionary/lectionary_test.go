package lectionary

import (
	"testing"

	"github.com/cloudevents/sdk-go/v2/event"
	"github.com/googleapis/google-cloudevents-go/cloud/firestoredata"
	"google.golang.org/protobuf/proto"
)

// TestParseEvent verifies that we can correctly unmarshal a Firestore event.
// This doesn't hit the network or Firestore.
func TestParseEvent(t *testing.T) {
	e := event.New()
	e.SetType("google.cloud.firestore.document.v1.written")
	e.SetSource("firestore.googleapis.com")

	data := &firestoredata.DocumentEventData{
		Value: &firestoredata.Document{
			Name: "projects/test/databases/(default)/documents/lectionary/test-doc",
			Fields: map[string]*firestoredata.Value{
				"morning": {ValueType: &firestoredata.Value_StringValue{StringValue: "Psalm 1"}},
			},
		},
	}

	marshaled, _ := proto.Marshal(data)
	e.SetData("application/protobuf", marshaled)

	var eventData firestoredata.DocumentEventData
	if err := proto.Unmarshal(e.Data(), &eventData); err != nil {
		t.Fatalf("proto.Unmarshal: %v", err)
	}

	name := eventData.GetValue().GetName()
	expectedName := "projects/test/databases/(default)/documents/lectionary/test-doc"
	if name != expectedName {
		t.Errorf("expected %s, got %s", expectedName, name)
	}

	morning := eventData.GetValue().GetFields()["morning"].GetStringValue()
	if morning != "Psalm 1" {
		t.Errorf("expected Psalm 1, got %s", morning)
	}
}
