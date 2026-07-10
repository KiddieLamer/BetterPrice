export async function logError(context: string, error: unknown): Promise<void> {
  const message = error instanceof Error ? error.message : String(error)
  const stack = error instanceof Error ? error.stack : undefined
  console.error(`[${context}] ${message}`, stack ?? "")

  if (process.env.SENTRY_DSN) {
    try {
      const Sentry = await import("@sentry/nextjs")
      Sentry.captureException(error, { tags: { context } })
    } catch {
      console.error("Sentry not available, DSN:", process.env.SENTRY_DSN)
    }
  }
}
