#!/bin/bash

ENV=dev
BUCKET="sentron-asset-ingest-$ENV"
URL="https://sentron.app/img/sentron-logo.png?t=$(date +%s)"
PID="9ef40aae-6338-431b-b987-ab9218e0f63e"
SID="7e545837-c3cf-4134-831c-306064b5f2ff"
MESSAGE="{\"projectId\":\"$PID\",\"sessionId\":\"$SID\",\"url\":\"$URL\"}"
URL_HASH=$(echo -n $URL | shasum -a 256 | head -c 64)
KEY="$PID/$SID/$URL_HASH"
ACCOUNT_ID=`aws sts get-caller-identity --profile sentron | jq -r .Account`

echo "Sending SNS notification"
echo $MESSAGE | jq

echo "SNS response"
aws sns publish \
  --region eu-west-1 \
  --profile sentron \
  --topic-arn arn:aws:sns:eu-west-1:$ACCOUNT_ID:image-discovered-$ENV \
  --message $MESSAGE | jq

echo "Waiting for key in s3: $KEY"
aws s3api wait object-exists \
  --region eu-west-1 \
  --profile sentron \
  --bucket $BUCKET \
  --key $KEY
