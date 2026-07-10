export interface SearchLog {
  id: string
  productId: string | null
  url: string
  status: "success" | "error"
  errorCode: string | null
  durationMs: number
  createdAt: Date
}

export async function logSearch(entry: Omit<SearchLog, "id" | "createdAt">): Promise<void> {
  if (process.env.DATABASE_URL) {
    try {
      const { sql } = await import("@vercel/postgres")
      await sql`
        INSERT INTO search_logs (product_id, url, status, error_code, duration_ms)
        VALUES (${entry.productId}, ${entry.url}, ${entry.status}, ${entry.errorCode}, ${entry.durationMs})
      `
      return
    } catch (err) {
      console.warn("DB log failed:", err)
      return
    }
  }
  console.log("[DB stub] search_log:", entry)
}
