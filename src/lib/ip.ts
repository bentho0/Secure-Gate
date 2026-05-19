import { headers } from "next/headers";

/**
 * Resolves the client IP address from the request.
 *
 * In production (Vercel, behind a reverse proxy), these headers are set by
 * the infrastructure and cannot be spoofed by the client. The proxy
 * overwrites any client-supplied values with the true remote address.
 *
 * Priority:
 *   1. x-real-ip  — set by most reverse proxies (Nginx, Cloudflare, etc.)
 *   2. x-forwarded-for — standard proxy header, first IP is the client
 *   3. Loopback fallback for local development
 */
export async function getClientIp(): Promise<string> {
  const headersList = headers();
  const realIp = headersList.get("x-real-ip");
  const forwardedFor = headersList.get("x-forwarded-for");

  const rawIp = realIp || forwardedFor || "127.0.0.1";
  return rawIp.split(",")[0].trim();
}

/**
 * Resolves the client IP from a NextAuth-compatible headers object.
 * Used inside next-auth authorize() where `req.headers` is available but
 * the server action `headers()` API is not.
 */
export function getClientIpFromHeaders(reqHeaders: Record<string, string | string[] | undefined>): string {
  const rawForwarded = reqHeaders["x-forwarded-for"];
  const rawReal = reqHeaders["x-real-ip"];

  const rawIp =
    (Array.isArray(rawReal) ? rawReal[0] : rawReal) ||
    (Array.isArray(rawForwarded) ? rawForwarded[0] : rawForwarded) ||
    "127.0.0.1";

  return rawIp.split(",")[0].trim();
}
