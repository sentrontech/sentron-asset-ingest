import { handler } from "../ingest-asset";
import fileExists from "../../utils/file-exists";
import processAsset, { SendData } from "../../utils/process-asset";
import { mocked } from "ts-jest/utils";
import validEvent from "./__fixtures__/valid-event";
import invalidEvent from "./__fixtures__/invalid-event";
import config from "../../config";

jest.mock("../../utils/file-exists");
jest.mock("../../utils/process-asset");

describe("#handler", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("when the message is invalid", () => {
    it("doesn't check if the file exists in s3", () => {
      expect(processAsset).not.toHaveBeenCalled();
    });
    it("doesn't checks if the file exists in s3", () => {
      expect(fileExists).not.toHaveBeenCalled();
    });
    it("doesn't call processAsset", () => {
      expect(processAsset).not.toHaveBeenCalled();
    });
    it("resolves, because retrying wont fix the problem", () => {
      expect(handler(invalidEvent)).resolves;
    });
  });

  describe("when the message is valid and the file doesn't exist in s3", () => {
    beforeEach(() => {
      mocked(fileExists).mockResolvedValueOnce(false);
      mocked(processAsset).mockResolvedValueOnce({} as SendData);
    });
    it("checks if the file already exists in s3", async () => {
      await handler(validEvent);
      expect(fileExists).toHaveBeenCalled();
    });
    it("uploads the file to s3 with the expected params", async () => {
      await handler(validEvent);
      expect(processAsset).toHaveBeenCalledWith(
        "https://example.com/images/photo.png",
        config.bucket,
        "e37ef498-d8f7-43d2-bd33-52dacf0c9024/002cdfdf-c41d-404c-bc97-16e8c6d390cd/3581d39eca2f2f02c66cf41756fc3225c5d0f33c284d647e9b4703064253d310",
        config.maxFileSize
      );
    });
    it("resolves, as the upload was successful", () => {
      expect(handler(validEvent)).resolves;
    });
  });

  describe("when the file already exists in s3", () => {
    beforeEach(() => {
      mocked(fileExists).mockResolvedValueOnce(true);
    });
    it("checks if the file exists in s3", async () => {
      await handler(validEvent);
      expect(fileExists).toHaveBeenCalled();
    });
    it("doesn't call processAsset", async () => {
      await handler(validEvent);
      expect(processAsset).not.toHaveBeenCalled();
    });
    it("resolves, because retrying wont fix the problem", () => {
      expect(handler(validEvent)).resolves;
    });
  });

  describe("when the asset process fails", () => {
    beforeEach(() => {
      mocked(fileExists).mockResolvedValueOnce(false);
      mocked(processAsset).mockRejectedValueOnce(new Error("Oops..."));
    });
    it("rejects", async () => {
      await expect(() => handler(validEvent)).rejects.toEqual(
        new Error("Oops...")
      );
      expect(processAsset).toHaveBeenCalled();
    });
  });
});
