import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const PORTAL_SESSION_COOKIE = "portal_session";

const secretKey = process.env.SESSION_SECRET;

if (!secretKey) {
  throw new Error(
    "SESSION_SECRET environment variable is not set. Add it in your hosting platform's environment variables (it is not read from .env in production)."
  );
}

const encodedKey = new TextEncoder().encode(secretKey);

interface PortalSessionPayload {
  portalUserId: number;
  [key: string]: unknown;
}

async function encrypt(payload: PortalSessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(encodedKey);
}

async function decrypt(session: string | undefined): Promise<PortalSessionPayload | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as PortalSessionPayload;
  } catch {
    return null;
  }
}

export async function verifyPortalSessionToken(token: string | undefined) {
  return decrypt(token);
}

export async function createPortalSession(portalUserId: number) {
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);
  const session = await encrypt({ portalUserId });

  const cookieStore = await cookies();

  cookieStore.set(PORTAL_SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function verifyPortalSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(PORTAL_SESSION_COOKIE)?.value;

  return decrypt(session);
}

export async function deletePortalSession() {
  const cookieStore = await cookies();
  cookieStore.delete(PORTAL_SESSION_COOKIE);
}
