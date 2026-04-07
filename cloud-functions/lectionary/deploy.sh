#!/bin/bash

FUNCTION_NAME="get-oremus-trigger"
FUNCTION_REGION="us-central1" # Where the code runs
TRIGGER_REGION="nam5"         # Where the Firestore database lives
ENTRY_POINT="GetOremus"
RUNTIME="go126"
SERVICE_ACCOUNT="firebase-adminsdk-sarte@osl-dailyoffice.iam.gserviceaccount.com"

echo "🚀 Deploying Gen 2 Firestore Trigger: $FUNCTION_NAME..."

gcloud functions deploy $FUNCTION_NAME \
  --gen2 \
  --runtime=$RUNTIME \
  --region=$FUNCTION_REGION \
  --service-account=$SERVICE_ACCOUNT \
  --entry-point=$ENTRY_POINT \
  --source=. \
  --memory=256Mi \
  --trigger-event-filters="type=google.cloud.firestore.document.v1.written" \
  --trigger-event-filters="database=(default)" \
  --trigger-event-filters-path-pattern="document=lectionary/{docId}" \
  --trigger-location=$TRIGGER_REGION \
  --set-env-vars GOOGLE_CLOUD_PROJECT=$(gcloud config get-value project)
