import getKey from "../get-key";

describe("#getKey", () => {
  it("returns a key string", () => {
    const key = getKey(
      "PROJECT_ID",
      "SESSION_ID",
      "https://example.com/img/profile.jpg"
    );
    expect(key).toBe(
      "PROJECT_ID/SESSION_ID/82c222a00a68b38c17058bd112dd988ee9e224c5f0fcfc6705ecb2d3cfc55573"
    );
  });
});
