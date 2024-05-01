gcloud functions deploy GetOremus --docker-registry=artifact-registry --entry-point GetOremus --runtime go121 --trigger-event "providers/cloud.firestore/eventTypes/document.write" --trigger-resource "projects/osl-dailyoffice/databases/(default)/documents/lections/{year}/l/{id}" --max-instances 5 --memory=128
