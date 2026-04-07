#!/bin/bash

# Configuration
FUNCTION_NAME="get-oremus-trigger"
REGION="us-central1"
ENTRY_POINT="GetOremus" # Matches the function name in your Go code
RUNTIME="go126"
# Your Firestore document pattern
# Note: Gen 2 uses {wildcard} syntax for Eventarc filters
DOCUMENT_PATH="lectionary/{docId}" 

echo "🚀 Deploying Gen 2 Firestore Trigger: $FUNCTION_NAME..."

gcloud functions deploy $FUNCTION_NAME \
  --gen2 \
  --runtime=$RUNTIME \
  --region=$REGION \
  --entry-point=$ENTRY_POINT \
  --source=. \
  --memory=256Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --concurrency=1 \
  --trigger-location=$REGION \
  --trigger-event-provider=firestore.googleapis.com \
  --trigger-event-type=google.cloud.firestore.document.v1.written \
  --trigger-event-filters=database="(default)" \
  --trigger-event-filters-path-pattern=document="$DOCUMENT_PATH" \
  --set-env-vars GOOGLE_CLOUD_PROJECT=$(gcloud config get-value project)

echo "✅ Deployment complete."
