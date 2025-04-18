import crypto from "crypto";

export function generateApiKey() {
  return crypto.randomBytes(32).toString("hex");
}
