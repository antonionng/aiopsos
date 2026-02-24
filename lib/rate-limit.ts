/**
 * In-memory sliding window rate limiter.
 * For multi-instance deployments, replace with @upstash/ratelimit + Redis.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  const cutoff = now - windowMs;
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}

interface RateLimitConfig {
  /** Max requests per window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
  retryAfterMs?: number;
}

export function rateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - config.windowMs;

  cleanup(config.windowMs);

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= config.limit) {
    const oldest = entry.timestamps[0];
    return {
      success: false,
      remaining: 0,
      limit: config.limit,
      retryAfterMs: oldest + config.windowMs - now,
    };
  }

  entry.timestamps.push(now);

  return {
    success: true,
    remaining: config.limit - entry.timestamps.length,
    limit: config.limit,
  };
}

export const RATE_LIMITS = {
  api: { limit: 100, windowMs: 60_000 },
  chat: { limit: 30, windowMs: 60_000 },
  auth: { limit: 10, windowMs: 60_000 },
  upload: { limit: 20, windowMs: 60_000 },
  publicSubmit: { limit: 5, windowMs: 60_000 },
} as const;

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
  };
  if (result.retryAfterMs) {
    headers["Retry-After"] = String(Math.ceil(result.retryAfterMs / 1000));
  }
  return headers;
}
