// STEP 6 — a simple rate limiter: "max N actions per person per time window".
//
// ⚠️ It keeps counts in the server's memory. That's fine on your laptop and good
// basic protection on Vercel, but Vercel can run several copies of your server and
// memory resets on redeploys — so it's a speed bump, not a wall. For stronger limits
// later, swap this for a shared store like Upstash Redis (same idea, shared memory).

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/** Returns true if allowed, false if the limit for this key is used up. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  // Housekeeping: forget expired entries so memory doesn't grow forever.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (now > b.resetAt) buckets.delete(k);
  }

  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count++;
  return true;
}

/** The visitor's IP address (Vercel and most hosts put it in this header). */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export const MINUTE = 60 * 1000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
