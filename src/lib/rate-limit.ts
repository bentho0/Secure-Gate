import { db } from "@/lib/db";

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

export async function rateLimit(ip: string, endpoint: string): Promise<RateLimitResult> {
  const limit = 5;
  const duration = 10 * 60 * 1000; // 10 minutes in milliseconds

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Try Upstash Redis if configured
  if (redisUrl && redisToken) {
    try {
      const key = `ratelimit:${endpoint}:${ip}`;
      // Use Upstash Redis REST Pipeline API to increment and get TTL in a single roundtrip
      const response = await fetch(`${redisUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["TTL", key],
        ]),
        // Prevent next-cache from caching this rate-limiting API call
        cache: "no-store",
      });

      if (response.ok) {
        const results = await response.json();
        // results is typically: [ { result: count }, { result: ttl } ] or similar
        const count = results[0]?.result;
        const ttl = results[1]?.result;

        // Set expire on first increment
        if (count === 1) {
          await fetch(`${redisUrl}/EXPIRE/${key}/600`, {
            headers: { Authorization: `Bearer ${redisToken}` },
            cache: "no-store",
          });
        }

        const remaining = Math.max(0, limit - count);
        const resetTime = new Date(Date.now() + (ttl > 0 ? ttl : 600) * 1000);

        return {
          success: count <= limit,
          limit,
          remaining,
          reset: resetTime,
        };
      }
    } catch (redisError) {
      console.warn("[RATE_LIMIT] Upstash Redis failed, falling back to database rate limiting:", redisError);
    }
  }

  // 2. Database Fallback (PostgreSQL via Prisma)
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + duration);

    // Atomic create-or-check to prevent TOCTOU race
    // Try to create first — if it succeeds, this is the first request
    try {
      await db.rateLimit.create({
        data: {
          ip,
          endpoint,
          attempts: 1,
          expiresAt,
        },
      });

      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: expiresAt,
      };
    } catch {
      // Record already exists — proceed with find + update
    }

    // Fetch existing record
    const record = await db.rateLimit.findUnique({
      where: {
        ip_endpoint: {
          ip,
          endpoint,
        },
      },
    });

    if (!record) {
      // Should not happen after the create attempt above, but safe-fail
      return { success: true, limit, remaining: 1, reset: new Date() };
    }

    // Check expiration
    const hasExpired = now > new Date(record.expiresAt);

    if (hasExpired) {
      await db.rateLimit.update({
        where: { id: record.id },
        data: {
          attempts: 1,
          expiresAt,
        },
      });

      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: expiresAt,
      };
    }

    // Check if limit is exceeded
    if (record.attempts >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        reset: record.expiresAt,
      };
    }

    // Atomically increment attempts
    const updatedRecord = await db.rateLimit.update({
      where: { id: record.id },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });

    return {
      success: true,
      limit,
      remaining: Math.max(0, limit - updatedRecord.attempts),
      reset: record.expiresAt,
    };
  } catch (dbError) {
    console.error("[RATE_LIMIT_ERROR] Database rate limiter failed:", dbError);
    // Fail-closed: block the request when rate limiting is unavailable.
    // Per Kerckhoff's Principle, failing open lets attackers bypass rate limiting
    // by DoS-ing the database, then brute-forcing credentials freely.
    return {
      success: false,
      limit,
      remaining: 0,
      reset: new Date(Date.now() + duration),
    };
  }
}
