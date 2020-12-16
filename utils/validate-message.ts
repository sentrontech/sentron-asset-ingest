import validator from "validator";

export type Message = {
  projectId: string;
  sessionId: string;
  url: string;
};

const urlConfig = {
  protocols: ["http", "https"],
  require_tld: true,
  require_protocol: true,
  require_host: true,
  require_valid_protocol: true,
};

const validateMessage = (message: Message) => {
  if (!validator.isURL(message.url, urlConfig)) {
    return { isValid: false, message: `Invalid URL: ${message.url}` };
  }
  if (!validator.isUUID(message.projectId)) {
    return {
      isValid: false,
      message: `Invalid project ID: ${message.projectId}`,
    };
  }
  if (!validator.isUUID(message.sessionId)) {
    return {
      isValid: false,
      message: `Invalid session ID: ${message.sessionId}`,
    };
  }
  return { isValid: true, message: "" };
};

export default validateMessage;
