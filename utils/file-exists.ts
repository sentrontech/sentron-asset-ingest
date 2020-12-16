import { S3 } from "aws-sdk";

const s3 = new S3();

const checkFileExists = async (
  bucket: string,
  key: string
): Promise<boolean> => {
  const params = {
    Bucket: bucket,
    Key: key,
  };
  return s3
    .headObject(params)
    .promise()
    .then((_) => true)
    .catch((err) => {
      if (err.code === "NotFound") return false;
      throw err;
    });
};

export default checkFileExists;
