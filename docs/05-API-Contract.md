# API Contract
## BetterPrice — Internal & External API Specification

**Version:** 1.0  
**Date:** 2026-07-07  
**Status:** Draft  

---

## 1. Internal API Endpoints

### 1.1 POST /api/compare

Compare product prices from a Shopee URL.

**Request**

```
POST /api/compare
Content-Type: application/json

{
  "url": "https://shopee.co.id/Samsung-Galaxy-S24-i.123456789.2345678901"
}
```

**Validation (Zod)**

```typescript
const CompareRequestSchema = z.object({
  url: z
    .string()
    .url("Must be a valid URL")
    .includes("shopee.co.id", { message: "Must be a Shopee link" })
});
```

**Response 200 — Success**

```json
{
  "product": {
    "id": "prod_abc123",
    "name": "Samsung Galaxy S24 Ultra 5G 256GB",
    "image": "https://cf.shopee.co.id/file/abc123",
    "url": "https://shopee.co.id/...",
    "shop_name": "TechShop Official",
    "shop_id": 123456789,
    "item_id": 2345678901,
    "category": "Electronics"
  },
  "offers": [
    {
      "store_name": "TechShop Official",
      "store_rating": 4.9,
      "location": "Jakarta",
      "price": 20499000,
      "price_formatted": "Rp 20.499.000",
      "url": "https://invol.co/cl12345",
      "is_cheapest": false
    },
    {
      "store_name": "GadgetMart ID",
      "store_rating": 4.8,
      "location": "Tangerang",
      "price": 18999000,
      "price_formatted": "Rp 18.999.000",
      "url": "https://invol.co/cl12346",
      "is_cheapest": true
    }
  ],
  "lazada_search_url": "https://invol.co/clLazada123",
  "meta": {
    "currency": "IDR",
    "updated_at": "2026-07-07T10:30:00Z",
    "source": "shopee"
  }
}
```

**Response 400 — Validation Error**

```json
{
  "error": {
    "code": "INVALID_URL",
    "message": "Link tidak valid. Pastikan link Shopee.",
    "hint": "Contoh: https://shopee.co.id/..."
  }
}
```

**Response 404 — Product Not Found**

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Produk tidak ditemukan. Mungkin sudah tidak tersedia."
  }
}
```

**Response 429 — Rate Limited**

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Terlalu banyak permintaan. Coba lagi dalam 1 menit.",
    "retry_after": 60
  }
}
```

**Response 502 — External API Error**

```json
{
  "error": {
    "code": "API_ERROR",
    "message": "Maaf, sedang gangguan. Coba lagi nanti.",
    "detail": "Shopee API timeout"
  }
}
```

---

### 1.2 GET /api/products/:id

Get product detail and price history. *(V2 — placeholder in MVP)*

**Response 200**

```json
{
  "product": {
    "id": "prod_abc123",
    "name": "Samsung Galaxy S24 Ultra 5G 256GB",
    "image": "...",
    "shop_name": "TechShop Official"
  },
  "price_history": [
    { "price": 20499000, "date": "2026-07-07T06:00:00Z" },
    { "price": 20999000, "date": "2026-07-07T00:00:00Z" },
    { "price": 21499000, "date": "2026-07-06T18:00:00Z" }
  ],
  "offers": [
    {
      "platform": "shopee",
      "store_name": "TechShop Official",
      "price": 20499000
    }
  ]
}
```

---

### 1.3 GET /api/health

Health check endpoint for monitoring.

**Response 200**

```json
{
  "status": "ok",
  "timestamp": "2026-07-07T10:30:00Z",
  "version": "1.0.0",
  "checks": {
    "database": "healthy",
    "kv": "healthy",
    "shopee_api": "reachable",
    "involve_asia": "reachable"
  }
}
```

---

### 1.4 POST /api/cron/update-prices

Internal cron job (protected by CRON_SECRET).

**Auth**

```
Header: Authorization: Bearer {CRON_SECRET}
```

**Response 200**

```json
{
  "status": "ok",
  "updated": 25,
  "errors": 0,
  "duration_ms": 12345
}
```

---

## 2. External API: Shopee Affiliate

### 2.1 Product Offer V2

**Endpoint**

```
POST https://open-api.affiliate.shopee.co.id/graphql
```

**Headers**

```
Authorization: HMAC-SHA256 signature
Content-Type: application/json
```

**Signature**

```typescript
function generateSignature(appId: string, appSecret: string): {
  timestamp: number;
  signature: string;
} {
  const timestamp = Math.floor(Date.now() / 1000);
  const baseString = `${appId}${timestamp}`;
  const signature = crypto
    .createHmac('sha256', appSecret)
    .update(baseString)
    .digest('hex');
  return { timestamp, signature };
}

// Headers:
// x-shopee-affiliate-id-timestamp: {timestamp}
// x-shopee-affiliate-id: {appId}
// Authorization: SHA256 Credential={appId}, Signature={signature}
```

**Request Body**

```graphql
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
```

**Variables**

```json
{
  "matchId": "i.{shop_id}.{item_id}",
  "limit": 20
}
```

**Response Shape**

```json
{
  "data": {
    "productOfferV2": [
      {
        "node": {
          "product": {
            "productName": "Samsung Galaxy S24 Ultra 5G",
            "productImage": "https://cf.shopee.co.id/file/...",
            "priceMin": 18999000,
            "priceMax": 20499000,
            "priceMinBeforeDiscount": 24999000,
            "priceMaxBeforeDiscount": 25999000,
            "priceMinAfterDiscount": 18999000,
            "priceMaxAfterDiscount": 20499000,
            "shopName": "TechShop Official",
            "shopId": 123456789,
            "itemId": 2345678901,
            "historicalSold": 1500,
            "ratingStar": 4.8,
            "cmtCount": 320
          }
        }
      }
    ]
  }
}
```

---

## 3. External API: Involve Asia

**⚠️ Important**: Involve Asia API is an affiliate link generator, NOT a product search engine. It does NOT expose product pricing data. In V1, it is used only to:
1. Wrap Shopee product links in affiliate deeplinks for commission tracking
2. Generate Lazada search redirect URLs (user searches manually, no price comparison)

### 3.1 Authentication

**Get Token**

```
POST https://api.involve.asia/v1/auth/token
Content-Type: application/json

{
  "apiKey": "{api_key}",
  "secretKey": "{secret_key}"
}
```

**Response**

```json
{
  "data": {
    "token": "eyJhbGciOi...",
    "expiresAt": "2026-07-07T11:30:00Z"
  }
}
```

**Token reuse**: Cache token in KV until expiry; auto-refresh 5 min before expiry.

### 3.2 Deeplink Generate

**Endpoint**

```
POST https://api.involve.asia/v1/deeplink/generate
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**

```json
{
  "target": "https://shopee.co.id/product/123456789/2345678901",
  "mediaId": "{campaign_id}",
  "title": "Samsung Galaxy S24"
}
```

**Response**

```json
{
  "data": {
    "clickId": "cl_abc123",
    "deeplink": "https://invol.co/clabc123",
    "targetUrl": "https://shopee.co.id/product/...",
    "commission": {
      "rate": 0.05,
      "type": "percentage"
    }
  }
}
```

### 3.3 Campaign Search *(for finding campaign IDs to use in deeplink)*

**Endpoint**

```
GET /v1/campaigns?platform=lazada&status=active
```

**Response**

```json
{
  "data": [
    {
      "id": "camp_123",
      "name": "Lazada Indonesia",
      "platform": "lazada",
      "commissionRate": 0.05,
      "status": "active"
    }
  ]
}
```

---

## 4. Error Codes (Internal API)

| Code | HTTP Status | Description |
|---|---|---|
| `INVALID_URL` | 400 | URL format invalid / not Shopee |
| `PARSE_FAILED` | 400 | Could not extract shop_id/item_id |
| `PRODUCT_NOT_FOUND` | 404 | No product data from any source |
| `RATE_LIMITED` | 429 | IP exceeded rate limit |
| `API_ERROR` | 502 | One or more external APIs failed |
| `TIMEOUT` | 504 | External API timed out |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## 5. Client-Side Considerations

- API calls from client-side only (Next.js API routes = server-side)
- No external API keys exposed to client
- CORS: only production domain allowed
- Response caching: SWR / React Query for client cache
- Error boundary: global error handler with Sentry
