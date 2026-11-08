/**
 * Bounded In-Memory LRU Cache Manager
 * Guarantees zero memory leaks with bounded entry count and TTL support
 */

export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class LRUCacheManager {
  private static store = new Map<string, CacheEntry<unknown>>();
  private static readonly MAX_ENTRIES = 100;
  private static readonly DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Retrieve cached value if exists and not expired
   */
  public static get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    // Refresh order in Map to ensure true Least-Recently-Used semantics
    this.store.delete(key);
    this.store.set(key, entry);

    return entry.data;
  }

  /**
   * Set cache entry with LRU eviction when capacity is exceeded
   */
  public static set<T>(key: string, data: T, ttlMs = this.DEFAULT_TTL_MS): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.MAX_ENTRIES) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) {
        this.store.delete(oldestKey);
      }
    }

    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Invalidate entries matching keyPattern or clear all
   */
  public static invalidate(keyPattern?: string): void {
    if (!keyPattern) {
      this.store.clear();
      return;
    }
    for (const key of this.store.keys()) {
      if (key.includes(keyPattern)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Current number of stored cache entries
   */
  public static size(): number {
    return this.store.size;
  }
}

