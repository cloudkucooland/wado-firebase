# When a lection is updated GetOremus (1) pre-caches the data from Oremus (2) links paslms to the lection
gcloud functions deploy GetOremus --entry-point GetOremus --runtime go118 --trigger-event "providers/cloud.firestore/eventTypes/document.write" --trigger-resource "projects/osl-dailyoffice/databases/(default)/documents/lections/{year}/l/{id}" --max-instances 5  --memory=128
