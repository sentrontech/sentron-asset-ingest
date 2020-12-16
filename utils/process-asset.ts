import axios, { AxiosPromise } from "axios";
import { S3 } from "aws-sdk";
import { PassThrough } from "stream";
import checkContentLength from "../utils/check-content-length";

export type SendData = S3.ManagedUpload.SendData;

const USER_AGENT = "sentron-ingest";

const s3 = new S3();

const makeRequest = (url: string): AxiosPromise<any> => {
  return axios({
    url,
    method: "get",
    headers: {
      "User-Agent": USER_AGENT,
    },
    responseType: "stream",
  });
};

const processAsset = async (
  url: string,
  bucket: string,
  key: string,
  maxFileSize: number
): Promise<SendData> => {
  return makeRequest(url).then((res) => {
    checkContentLength(+res.headers["content-length"], maxFileSize);
    const contentType = res.headers["content-type"];
    const pass = new PassThrough();
    res.data.pipe(pass);
    return s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: pass,
        ContentType: contentType,
      })
      .promise();
  });
};

export default processAsset;
