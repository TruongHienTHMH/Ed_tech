/**
 * In-Memory Sliding Window Rate Limiter
 * Implements Business Rule BR-09: Maximum 3 lead submissions per minute per IP
 */

interface RateLimitRecord {
  timestamps: number[];
}

export class InMemoryRateLimiter {
  private static store = new Map<string, RateLimitRecord>();
  private static cleanupIntervalMs = 5 * 60 * 1000; // 5 minutes
  private static lastCleanup = Date.now();

  /**
   * Check whether an IP has exceeded the limit
   * @param ip Client IP address
   * @param maxRequests Maximum requests allowed in window (default 3)
   * @param windowMs Window in milliseconds (default 60,000ms = 1 min)
   */
  public static check(
    ip: string,
    maxRequests = 3,
    windowMs = 60 * 1000
  ): { allowed: boolean; remaining: number; resetMs: number } {
    const now = Date.now();
    this.periodicCleanup(now, windowMs);

    const record = this.store.get(ip) || { timestamps: [] };

    // Filter out timestamps outside the sliding window
    const recentTimestamps = record.timestamps.filter(
      (ts) => now - ts < windowMs
    );

    if (recentTimestamps.length >= maxRequests) {
      const oldest = recentTimestamps[0];
      const resetMs = Math.max(0, windowMs - (now - oldest));
      return {
        allowed: false,
        remaining: 0,
        resetMs,
      };
    }

    recentTimestamps.push(now);
    this.store.set(ip, { timestamps: recentTimestamps });

    return {
      allowed: true,
      remaining: maxRequests - recentTimestamps.length,
      resetMs: windowMs,
    };
  }

  private static periodicCleanup(now: number, windowMs: number) {
    if (now - this.lastCleanup < this.cleanupIntervalMs) return;
    this.lastCleanup = now;

    for (const [ip, record] of this.store.entries()) {
      const active = record.timestamps.filter((ts) => now - ts < windowMs);
      if (active.length === 0) {
        this.store.delete(ip);
      } else {
        this.store.set(ip, { timestamps: active });
      }
    }
  }
}

