import { createHash } from "crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";

export function getExpectedAdminSessionToken() {
  return createHash("sha256")
    .update(process.env.ADMIN_PASSWORD ?? "")
    .digest("hex");
}

export function isValidAdminPassword(password: string) {
  return (
    password.length > 0 && password === process.env.ADMIN_PASSWORD
  );
}
