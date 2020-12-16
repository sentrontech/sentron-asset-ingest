import checkContentLength from "../check-content-length";

const MAX_FILE_SIZE = 1024 * 1024;

describe("#checkContentLength", () => {
  it("throws if content length is zero", () => {
    expect(() => checkContentLength(0, MAX_FILE_SIZE)).toThrow(
      "Cannot determine file size"
    );
  });

  it("throws if content length is greater than the max file size", () => {
    expect(() => checkContentLength(2 * MAX_FILE_SIZE, MAX_FILE_SIZE)).toThrow(
      "File too large: 2097152 > 1048576"
    );
  });

  it("does not throw if content length is less than the max file size", () => {
    expect(
      checkContentLength(MAX_FILE_SIZE - 1, MAX_FILE_SIZE)
    ).toBeUndefined();
  });
});
