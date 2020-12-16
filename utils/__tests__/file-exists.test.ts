import fileExists from "../file-exists";
import * as AWS from "aws-sdk";
import { AWSError } from "aws-sdk";
import { HeadObjectOutput } from "aws-sdk/clients/s3";
import { mocked } from "ts-jest/utils";

jest.mock("aws-sdk", () => {
  const mockS3Instance = {
    headObject: jest.fn(),
  };
  const mockS3 = jest.fn(() => mockS3Instance);
  return { S3: mockS3 };
});

const mockHeadObject = (error?: AWSError) => {
  const mockS3Instance = new AWS.S3();
  return mocked(mockS3Instance.headObject).mockImplementationOnce((): any => {
    if (error) return { promise: () => Promise.reject(error) };
    return { promise: () => Promise.resolve({} as HeadObjectOutput) };
  });
};

describe("#fileExists", () => {
  it("calls headObject with the expected params", async () => {
    const headObject = mockHeadObject();
    await fileExists("my-bucket", "/path/to/file");
    expect(headObject).toHaveBeenCalledWith({
      Key: "/path/to/file",
      Bucket: "my-bucket",
    });
  });

  it("resolves true if the file exists in S3", async () => {
    mockHeadObject();
    const res = await fileExists("my-bucket", "/path/to/file");
    expect(res).toBe(true);
  });

  it("resolves false if the file does not exist in S3", async () => {
    mockHeadObject({ code: "NotFound" } as AWSError);
    const res = await fileExists("my-bucket", "/path/to/file");
    expect(res).toBe(false);
  });

  it("rejects if any other error occured", async () => {
    const err = { code: "SomeOtherError" } as AWSError;
    mockHeadObject(err);
    expect(() => fileExists("my-bucket", "/path/to/file")).rejects.toEqual(err);
  });
});
