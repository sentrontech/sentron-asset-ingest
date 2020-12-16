import processAsset from "../process-asset";
import * as AWS from "aws-sdk";
import { AWSError } from "aws-sdk";
import { PassThrough } from "stream";
import { PutObjectOutput } from "aws-sdk/clients/s3";
import { mocked } from "ts-jest/utils";
import nock from "nock";
import * as path from "path";

const oneMb = 1024 * 1024;
const oneKb = 1024;

jest.mock("aws-sdk", () => {
  const mockS3Instance = {
    upload: jest.fn(),
  };
  const mockS3 = jest.fn(() => mockS3Instance);
  return { S3: mockS3 };
});

const mockUpload = (error?: AWSError) => {
  const mockS3Instance = new AWS.S3();
  return mocked(mockS3Instance.upload).mockImplementationOnce((): any => {
    if (error) return { promise: () => Promise.reject(error) };
    return { promise: () => Promise.resolve({} as PutObjectOutput) };
  });
};

const setupNockOk = () => {
  nock("http://example.com")
    .get("/img/boat.jpg")
    .matchHeader("User-Agent", "sentron-ingest")
    .replyWithFile(200, path.resolve(__dirname, "../../test/data/boat.jpg"), {
      "Content-Length": "737365",
      "Content-Type": "image/jpeg",
    });
};

const setupNockFileNotFound = () => {
  nock("http://example.com")
    .get("/img/boat.jpg")
    .matchHeader("User-Agent", "sentron-ingest")
    .reply(404, "Not found");
};

describe("#processAsset", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it("rejects", async () => {
    setupNockOk();
    const upload = mockUpload();
    await processAsset(
      "http://example.com/img/boat.jpg",
      "my-bucket",
      "/path/to/file",
      oneMb
    );
    expect(upload).toHaveBeenCalledWith({
      Key: "/path/to/file",
      Bucket: "my-bucket",
      Body: expect.any(PassThrough),
      ContentType: "image/jpeg",
    });
  });

  describe("when the file is too large", () => {
    it("rejects", async () => {
      setupNockOk();
      mockUpload();
      expect(() =>
        processAsset(
          "http://example.com/img/boat.jpg",
          "my-bucket",
          "/path/to/file",
          oneKb
        )
      ).rejects.toEqual(new Error("File too large: 737365 > 1024"));
    });
  });

  describe("when the file cannot be found", () => {
    it("rejects", async () => {
      setupNockFileNotFound();
      mockUpload();
      expect(() =>
        processAsset(
          "http://example.com/img/boat.jpg",
          "my-bucket",
          "/path/to/file",
          oneMb
        )
      ).rejects.toEqual(new Error("Request failed with status code 404"));
    });
  });
});
