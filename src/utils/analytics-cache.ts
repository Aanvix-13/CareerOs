interface CacheEntry {
  value: any;
  expiresAt: number;
}

class AnalyticsCache {
  private cache = new Map<string, CacheEntry>();

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key: string, value: any, ttlMs = 300000): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs
    });
  }

  invalidateAll(): void {
    this.cache.clear();
  }
}

export default new AnalyticsCache();
