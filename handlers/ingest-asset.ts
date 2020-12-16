import { SQSEvent } from "aws-lambda";
import validateMessage, { Message } from "../utils/validate-message";
import getKey from "../utils/get-key";
import fileExists from "../utils/file-exists";
import processAsset from "../utils/process-asset";
import config from "../config";

export const handler = async (event: SQSEvent): Promise<void> => {
  try {
    // parse message
    const message: Message = JSON.parse(event.Records[0].body);

    // validate the message
    const { isValid, message: validationMsg } = validateMessage(message);
    if (!isValid) {
      console.error(`Cannot parse message: ${validationMsg}`);
      return;
    }

    // get the file's s3 key
    const key = getKey(message.projectId, message.sessionId, message.url);

    // check if file already exists in s3 (we don't want to over-fetch)
    if (await fileExists(config.bucket, key)) {
      console.debug(`Skipping asset, already exists in S3: ${key}`);
      return;
    }

    // download file and upload to s3
    console.debug(`Saving ${message.url} to ${key}`);
    await processAsset(message.url, config.bucket, key, config.maxFileSize);
    console.debug(`Asset saved to S3: ${key}`);
  } catch (err) {
    throw err; // retry
  }
};
