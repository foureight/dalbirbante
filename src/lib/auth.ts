import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "db_admin_session";

function getSecret() {
  const secret = process.env.ADMIN_SECRET || "dal-birbante-dev-secret-change-me";
  return new TextEncoder().encode(secret);
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "dalbirbante";
}

export async function createSessionToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export { COOKIE as ADMIN_COOKIE };
