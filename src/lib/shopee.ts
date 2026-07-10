import { createHash, createHmac } from "node:crypto"

const SHOPEE_API_ENDPOINT = "https://open-api.affiliate.shopee.co.id/graphql"

interface ShopeeConfig {
  appId: string
  appSecret: string
}

interface ShopeeProductNode {
  productName: string
  productImage: string
  priceMin: number
  priceMax: number
  priceMinBeforeDiscount: number | null
  priceMaxBeforeDiscount: number | null
  priceMinAfterDiscount: number | null
  priceMaxAfterDiscount: number | null
  shopName: string
  shopId: number
  itemId: number
  historicalSold: number | null
  ratingStar: number | null
  cmtCount: number | null
}

interface ShopeeProductOfferResponse {
  data: {
    productOfferV2: Array<{
      node: {
        product: ShopeeProductNode
      }
    }>
  }
  errors?: Array<{
    message: string
    extensions: {
      code: number
      message: string
    }
  }>
}

function getConfig(): ShopeeConfig {
  const appId = process.env.SHOPEE_AFFILIATE_APP_ID
  const appSecret = process.env.SHOPEE_AFFILIATE_APP_SECRET

  if (!appId || !appSecret) {
    throw new Error("SHOPEE_AFFILIATE_APP_ID and SHOPEE_AFFILIATE_APP_SECRET must be set")
  }

  return { appId, appSecret }
}

function generateSignature(appId: string, appSecret: string): { timestamp: number; signature: string } {
  const timestamp = Math.floor(Date.now() / 1000)
  const baseString = `${appId}${timestamp}`
  const signature = createHmac("sha256", appSecret).update(baseString).digest("hex")
  return { timestamp, signature }
}

export interface ShopeeOffer {
  storeName: string
  price: number
  originalPrice: number | null
  url: string
  rating: number | null
  historicalSold: number | null
  location: string | null
}

export interface ShopeeProduct {
  name: string
  image: string
  shopName: string
  shopId: number
  itemId: number
  offers: ShopeeOffer[]
}

export async function getProductOffers(matchId: string): Promise<ShopeeProduct | null> {
  const config = getConfig()
  const { timestamp, signature } = generateSignature(config.appId, config.appSecret)

  const query = `
    query productOfferV2($matchId: String!, $limit: Int) {
      productOfferV2(keyword: $matchId, sortBy: "priceASC", limit: $limit) {
        node {
          product {
            productName
            productImage
            priceMin
            priceMax
            priceMinBeforeDiscount
            priceMaxBeforeDiscount
            priceMinAfterDiscount
            priceMaxAfterDiscount
            shopName
            shopId
            itemId
            historicalSold
            ratingStar
            cmtCount
          }
        }
      }
    }
  `

  const response = await fetch(SHOPEE_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-shopee-affiliate-id": config.appId,
      "x-shopee-affiliate-id-timestamp": String(timestamp),
      Authorization: `SHA256 Credential=${config.appId}, Signature=${signature}`,
    },
    body: JSON.stringify({
      query,
      variables: {
        matchId,
        limit: 20,
      },
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Shopee API error (${response.status}): ${text}`)
  }

  const json: ShopeeProductOfferResponse = await response.json()

  if (json.errors?.length) {
    throw new Error(`Shopee API error: ${json.errors[0].message}`)
  }

  const nodes = json.data?.productOfferV2
  if (!nodes?.length) {
    return null
  }

  const first = nodes[0].node.product
  const lowestPrice = Math.min(...nodes.map((n) => n.node.product.priceMin))

  const offers: ShopeeOffer[] = nodes.map((n) => {
    const p = n.node.product
    const sellerUrl = `https://shopee.co.id/product/${p.shopId}/${p.itemId}`
    return {
      storeName: p.shopName,
      price: p.priceMinAfterDiscount ?? p.priceMin,
      originalPrice: p.priceMinBeforeDiscount ?? null,
      url: sellerUrl,
      rating: p.ratingStar ?? null,
      historicalSold: p.historicalSold ?? null,
      location: null,
    }
  })

  return {
    name: first.productName,
    image: first.productImage,
    shopName: first.shopName,
    shopId: first.shopId,
    itemId: first.itemId,
    offers: offers.map((o) => ({
      ...o,
      isLowest: o.price === lowestPrice,
    })),
  }
}
