const DEFAULT_TTL = 300

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const memoryStore = new Map<string, CacheEntry<unknown>>()

function isExpired(entry: CacheEntry<unknown>): boolean {
  return Date.now() > entry.expiresAt
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (process.env.KV_URL) {
    try {
      const { kv } = await import("@vercel/kv")
      return await kv.get<T>(key)
    } catch {
      return memoryGet<T>(key)
    }
  }
  return memoryGet<T>(key)
}

export async function cacheSet<T>(key: string, data: T, ttlSeconds = DEFAULT_TTL): Promise<void> {
  if (process.env.KV_URL) {
    try {
      const { kv } = await import("@vercel/kv")
      await kv.set(key, data, { ex: ttlSeconds })
      return
    } catch {
      memorySet(key, data, ttlSeconds)
      return
    }
  }
  memorySet(key, data, ttlSeconds)
}

function memoryGet<T>(key: string): T | null {
  const entry = memoryStore.get(key)
  if (!entry) return null
  if (isExpired(entry)) {
    memoryStore.delete(key)
    return null
  }
  return entry.data as T
}

function memorySet<T>(key: string, data: T, ttlSeconds: number): void {
  memoryStore.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  })
}
