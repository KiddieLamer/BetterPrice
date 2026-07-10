export function buildShopeeAffiliateUrl(shopId: number, itemId: number): string {
  return `https://shopee.co.id/product/${shopId}/${itemId}`
}

export function buildLazadaSearchUrl(productName: string): string {
  const query = encodeURIComponent(productName)
  return `https://www.lazada.co.id/catalog/?q=${query}`
}
