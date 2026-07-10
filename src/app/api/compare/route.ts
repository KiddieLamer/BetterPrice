import { z } from "zod"
import { isShopeeUrl, parseShopeeUrl, buildMatchId } from "@/lib/url-parser"
import { getProductOffers } from "@/lib/shopee"
import { buildLazadaSearchUrl } from "@/lib/affiliate-link"
import { cacheGet, cacheSet } from "@/lib/cache"
import { logSearch } from "@/lib/db"
import { logError } from "@/lib/logger"
import type { CompareRequest, CompareResponse } from "@/types/api"
import type { Product } from "@/types/product"
import type { Offer } from "@/types/offer"

export const maxDuration = 30

const compareSchema = z.object({
  url: z.string().min(1, "URL is required"),
})

export async function POST(request: Request) {
  const startTime = Date.now()

  try {
    const body: CompareRequest = await request.json()
    const parsed = compareSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        {
          error: {
            code: "INVALID_URL" as const,
            message: "URL is required",
          },
        },
        { status: 400 }
      )
    }

    const { url } = parsed.data

    if (!isShopeeUrl(url)) {
      return Response.json(
        {
          error: {
            code: "INVALID_URL" as const,
            message: "Harap gunakan link Shopee",
          },
        },
        { status: 400 }
      )
    }

    const parsedUrl = parseShopeeUrl(url)
    if (!parsedUrl) {
      return Response.json(
        {
          error: {
            code: "PARSE_FAILED" as const,
            message: "Tidak bisa membaca link Shopee. Pastikan formatnya benar.",
          },
        },
        { status: 400 }
      )
    }

    const cacheKey = `shopee:${parsedUrl.itemId}`
    const cached = await cacheGet<CompareResponse>(cacheKey)
    if (cached) {
      return Response.json(cached)
    }

    const matchId = buildMatchId(parsedUrl.shopId, parsedUrl.itemId)
    const shopeeResult = await getProductOffers(matchId)

    if (!shopeeResult) {
      return Response.json(
        {
          error: {
            code: "PRODUCT_NOT_FOUND" as const,
            message: "Produk tidak ditemukan",
          },
        },
        { status: 404 }
      )
    }

    const product: Product = {
      id: `${parsedUrl.shopId}_${parsedUrl.itemId}`,
      name: shopeeResult.name,
      image: shopeeResult.image,
      shopName: shopeeResult.shopName,
      shopId: shopeeResult.shopId,
      itemId: shopeeResult.itemId,
      url: `https://shopee.co.id/product/${shopeeResult.shopId}/${shopeeResult.itemId}`,
      priceMin: Math.min(...shopeeResult.offers.map((o) => o.price)),
      priceMax: Math.max(...shopeeResult.offers.map((o) => o.price)),
      currency: "IDR",
    }

    const offers: Offer[] = shopeeResult.offers.map((o) => ({
      platform: "shopee" as const,
      storeName: o.storeName,
      price: o.price,
      originalPrice: o.originalPrice,
      currency: "IDR",
      url: o.url,
      rating: o.rating,
      historicalSold: o.historicalSold,
      location: o.location,
      isLowest: o.price === product.priceMin,
    }))

    const lazadaUrl = buildLazadaSearchUrl(product.name)

    const response: CompareResponse = {
      product,
      offers: offers.sort((a, b) => a.price - b.price),
      lazadaUrl,
    }

    await cacheSet(cacheKey, response, 300)

    await logSearch({
      productId: product.id,
      url,
      status: "success",
      errorCode: null,
      durationMs: Date.now() - startTime,
    })

    return Response.json(response)
  } catch (error) {
    await logError("compare", error)
    await logSearch({
      productId: null,
      url: "",
      status: "error",
      errorCode: "INTERNAL_ERROR",
      durationMs: Date.now() - startTime,
    })

    return Response.json(
      {
        error: {
          code: "INTERNAL_ERROR" as const,
          message: "Terjadi kesalahan. Silakan coba lagi.",
        },
      },
      { status: 500 }
    )
  }
}
