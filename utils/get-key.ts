import { createHash } from "crypto";

const getKey = (projectId: string, sessionId: string, url: string) => {
  const hash = createHash("sha256").update(url).digest("hex");
  return [projectId, sessionId, hash].join("/");
};

export default getKey;
