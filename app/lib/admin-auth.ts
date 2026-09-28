import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "apt_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function secret() {
  return process.env.ADMIN_DASHBOARD_SECRET || "";
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createAdminSession() {
  if (!secret()) throw new Error("ADMIN_DASHBOARD_SECRET is not configured");
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = String(expires);
  return `${payload}.${signature(payload)}`;
}

export function verifyAdminSession(value?: string | null) {
  if (!value || !secret()) return false;
  const [payload, received] = value.split(".");
  if (!payload || !received) return false;
  const expires = Number(payload);
  if (!Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000)) return false;

  const expected = signature(payload);
  try {
    return timingSafeEqual(Buffer.from(received), Buffer.from(expected));
  } catch {
    return false;
  }
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};
