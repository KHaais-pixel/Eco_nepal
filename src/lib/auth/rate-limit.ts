import "server-only";

// Small in-memory fixed-window limiter. Fine for a single-server VPS; state
// resets on restart, which only ever makes it more lenient.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  bucket.count += 1;
  return { ok: bucket.count <= limit, retryAfterMs: bucket.resetAt - now };
}

export function clearRateLimit(key: string) {
  buckets.delete(key);
}
