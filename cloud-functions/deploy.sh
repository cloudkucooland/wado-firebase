gcloud functions deploy GetOremus --entry-point GetOremus --runtime go118 --trigger-event "providers/cloud.firestore/eventTypes/document.write" --trigger-resource "projects/osl-dailyoffice/databases/(default)/documents/lections/{year}/l/{id}"