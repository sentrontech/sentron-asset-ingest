import validateMessage from "../validate-message";

const okMessage = {
  url: "https://example.com/img/profile.jpg",
  sessionId: "72812d56-cdd4-4b12-a179-49431dea7352",
  projectId: "eebbdd5d-0662-48da-9587-145e15b64910",
};

describe("#validateMessage", () => {
  describe("when the message is valid", () => {
    it("returns an object with isValid=true", () => {
      expect(validateMessage(okMessage)).toMatchObject({
        isValid: true,
      });
    });
  });

  describe("when `url` is not an absolute URL", () => {
    const badMessage = {
      ...okMessage,
      url: "./relative-path",
    };
    it("returns an object with isValid=false and message", () => {
      expect(validateMessage(badMessage)).toEqual({
        isValid: false,
        message: "Invalid URL: ./relative-path",
      });
    });
  });

  describe("when `projectId` is not a UUID v4", () => {
    const badMessage = {
      ...okMessage,
      projectId: "PROJECT_ID",
    };
    it("returns an object with isValid=false and message", () => {
      expect(validateMessage(badMessage)).toEqual({
        isValid: false,
        message: "Invalid project ID: PROJECT_ID",
      });
    });
  });

  describe("when `sessionId` is not a UUID v4", () => {
    const badMessage = {
      ...okMessage,
      sessionId: "SESSION_ID",
    };
    it("returns an object with isValid=false and message", () => {
      expect(validateMessage(badMessage)).toEqual({
        isValid: false,
        message: "Invalid session ID: SESSION_ID",
      });
    });
  });
});
