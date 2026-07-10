const SHOPEE_DOMAINS = [
  "shopee.co.id",
  "shopee.com",
  "shopee.sg",
  "shopee.ph",
  "shopee.my",
  "shopee.th",
  "shopee.vn",
  "shopee.tw",
]

export interface ParsedShopeeUrl {
  shopId: number
  itemId: number
}

export function isShopeeUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return SHOPEE_DOMAINS.some((domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`))
  } catch {
    return false
  }
}

export function parseShopeeUrl(url: string): ParsedShopeeUrl | null {
  try {
    const parsed = new URL(url)
    const pathParts = parsed.pathname.replace(/\/$/, "").split("/")

    const patterns = [
      /\.(?:i\.|item\/)(\d+)\.(\d+)/,
      /\/product\/(\d+)\/(\d+)/,
      /\/products\/(\d+)\/(\d+)/,
      /\/shop\/(\d+)\/(\d+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return {
          shopId: parseInt(match[1], 10),
          itemId: parseInt(match[2], 10),
        }
      }
    }

    for (let i = 0; i < pathParts.length - 1; i++) {
      const a = parseInt(pathParts[i], 10)
      const b = parseInt(pathParts[i + 1], 10)
      if (!isNaN(a) && !isNaN(b) && a > 0 && b > 0) {
        return { shopId: a, itemId: b }
      }
    }

    return null
  } catch {
    return null
  }
}

export function buildMatchId(shopId: number, itemId: number): string {
  return `i.${shopId}.${itemId}`
}
