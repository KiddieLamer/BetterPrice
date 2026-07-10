# TSD — Technical Specification Document
## BetterPrice — Price Comparison Platform for Indonesia

**Version:** 1.0  
**Date:** 2026-07-07  
**Status:** Draft  

---

## 1. Tech Stack

| Layer | Technology | Justification |
|---|---|---|
| Framework | Next.js 15 (App Router) | Serverless-native, API routes, SSG/SSR, cron |
| Language | TypeScript 5 | Type safety, better DX |
| Styling | Tailwind CSS v4 | Zero-runtime, rapid UI dev |
| Database | Vercel Postgres (Neon) | Serverless, free tier 500MB |
| Cache / KV | Vercel KV (Upstash Redis) | Rate limiting, API cache, $0 |
| Cron Jobs | Vercel Cron Jobs | Periodic price updates, free |
| Analytics | Vercel Analytics | Built-in, privacy-friendly, free |
| Deploy | Vercel (Hobby) | Git push → deploy, $0 |
| Domain | betterprice.id | Indonesian TLD |
| Monitoring | Sentry (free tier) | Error tracking, 5k events/mo |

### NPM Dependencies (MVP)

| Package | Purpose |
|---|---|
| `next` | Framework |
| `react` / `react-dom` | UI |
| `tailwindcss` | Styling |
| `@vercel/postgres` | DB client |
| `@vercel/kv` | Redis cache |
| `@sentry/nextjs` | Error tracking |
| `zod` | Input validation |
| `nanoid` | ID generation |
| `date-fns` | Date formatting |

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   BROWSER (Client)                      │
│  ┌──────────────┐    ┌──────────────────────────────┐  │
│  │  Landing     │    │  Result Page                 │  │
│  │  (Next.js)   │    │  (Next.js SSR/CSR)           │  │
│  └──────┬───────┘    └──────────┬───────────────────┘  │
│         │                       │                       │
└─────────┼───────────────────────┼───────────────────────┘
          │ POST /api/compare     │
          │ { url: "..." }        │ GET /api/products/{id}
          ▼                       ▼
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTES (Vercel)                │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ /api/compare  │  │ /api/        │  │ /api/health  │  │
│  │ URL → Offers  │  │ products/:id │  │ Monitoring   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘  │
│         │                 │                              │
│         ▼                 ▼                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │              SERVICE LAYER                       │   │
│  │  ┌──────────────┐  ┌──────────────────────┐     │   │
│  │  │ URL Parser   │  │ Product Matcher      │     │   │
│  │  │ (Zod schema) │  │ (fuzzy match name)   │     │   │
│  │  └──────────────┘  └──────────────────────┘     │   │
│  └──────────────────────────────────────────────────┘   │
│         │                 │                              │
│         ▼                 ▼                              │
│  ┌──────────────────────────────────────────────┐   │
│  │         EXTERNAL API CLIENTS                 │   │
│  │  ┌──────────────────┐  ┌──────────────────┐ │   │
│  │  │ Shopee Affiliate │  │ Involve Asia     │ │   │
│  │  │ (GraphQL)        │  │ (REST, optional) │ │   │
│  │  └────────┬─────────┘  └────────┬─────────┘ │   │
│  └───────────┼─────────────────────┼────────────┘   │
│              │                     │                 │
│              ▼                     ▼                 │
│  ┌──────────────────────────────────────────────┐   │
│  │  CACHE LAYER (Vercel KV)                     │   │
│  │  ┌──────────────┐  ┌────────────────────┐   │   │
│  │  │ API Response │  │ Rate Limit Counter │   │   │
│  │  │ Cache (5min) │  │ (IP-based, 30/min) │   │   │
│  │  └──────────────┘  └────────────────────┘   │   │
│  └──────────────────────────────────────────────┘   │
│              │                                       │
│              ▼                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │  DATA LAYER (Vercel Postgres)                │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │   │
│  │  │ products │ │ offers   │ │ price_   │    │   │
│  │  │          │ │          │ │ history  │    │   │
│  │  └──────────┘ └──────────┘ └──────────┘    │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘

CRON JOBS:
┌────────────────────────────┐
│ Every 6 hours:             │
│ /api/cron/update-prices    │
│ → Refresh popular products │
│ → Insert price_history     │
└────────────────────────────┘
```

---

## 3. Data Flow (Compare Request)

```
1. User pastes URL → clicks "Cek Harga"

2. Client POST /api/compare { url, clientId }

3. API Route (Serverless):
   a. Zod validate { url: z.string().url() }
   b. Extract shop_id, item_id from URL (regex)
   c. Check KV cache → return if fresh
   d. Call Shopee Affiliate API (productOfferV2)
      - Build HMAC-SHA256 signature
      - GraphQL query: match_id → products
      - Response: all Shopee sellers selling this item
      - Extract: product_name, image, price_min/max, shop_name
   e. Sort Shopee offers by price asc
   f. KV cache: set response, TTL 5 min
   g. Log to Postgres: search_log
   h. Return { product, offers[] }

4. Client renders result page:
   - ProductCard (image, name)
   - OfferList (Shopee sellers sorted by price)
   - CTA → Shopee affiliate link
```

---

## 4. API Rate Limiting

| Scope | Limit | Enforcement |
|---|---|---|
| Per IP (anonymous) | 30 req/min | KV counter |
| Per product ID (cache) | 1 req/5min | KV cached response |
| Shopee Affiliate API | 100 req/min (typical) | Respect quotas |

---

## 5. Security

| Area | Implementation |
|---|---|
| **API Keys** | Environment variables (Vercel env), never client-side |
| **Shopee Auth** | HMAC-SHA256 signature per request |
| **Involve Auth** | Bearer token, auto-refresh |
| **CORS** | Restrict to production domain |
| **Rate Limiting** | IP-based KV counter |
| **Input Validation** | Zod schema on all API inputs |
| **SQL Injection** | Parameterized queries via @vercel/postgres |
| **XSS** | Next.js auto-escaping, avoid dangerouslySetInnerHTML |
| **HTTPS** | Enforced by Vercel (automatic) |
| **Headers** | CSP, X-Frame-Options, X-Content-Type-Options |

---

## 6. Environment Variables

```
# Vercel
DATABASE_URL=postgres://...
KV_URL=redis://...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...

# Shopee Affiliate (required)
SHOPEE_AFFILIATE_APP_ID=...
SHOPEE_AFFILIATE_APP_SECRET=...

# Involve Asia (optional — for Shopee affiliate deeplink wrapping)
INVOLVE_ASIA_API_KEY=...
INVOLVE_ASIA_API_SECRET=...

# Other
NEXT_PUBLIC_SITE_URL=https://betterprice.vercel.app
SENTRY_DSN=...
```

---

## 7. Caching Strategy

| Data | Cache Key | TTL | Notes |
|---|---|---|---|
| Shopee API response | `shopee:{item_id}` | 5 min | Reduce API calls |
| Price history (read) | `history:{product_id}` | 1 hour | Freshness acceptable |
| Rate limit counter | `ratelimit:{ip}` | 1 min rolling | 30 req/min |

---

## 8. Error Handling Strategy

```
Response Format (success):
{
  "product": { "id", "name", "image", "shop_name" },
  "offers": [{ "platform", "price", "currency",
               "url" (affiliate), "store_name",
               "rating", "location" }]
}

Response Format (error):
{
  "error": {
    "code": "INVALID_URL" | "PRODUCT_NOT_FOUND" |
            "API_ERROR" | "RATE_LIMITED",
    "message": "..."
  }
}

HTTP Status Codes:
  200 — Success
  400 — Validation error
  404 — Product not found
  429 — Rate limited
  500 — Internal server error
```

---

## 9. Cron Job Specification

```typescript
// /api/cron/update-prices
// Schedule: every 6 hours (0 */6 * * *)
// Max duration: 60s (Vercel Hobby)

async function updatePrices() {
  // 1. Fetch top 100 most-searched products
  // 2. For each product:
  //    a. Call Shopee API for current price
  //    b. Insert into price_history (product_id, price, timestamp)
  // 3. Clean up old price_history (>90 days)
  // 4. Log: products_updated, errors
}
```

---

## 10. Project Structure

```
betterprice/
├── docs/                    # Documentation
│   ├── 01-BRD.md
│   ├── 02-PRD.md
│   ├── 03-FSD.md
│   ├── 04-TSD.md
│   ├── 05-API-Contract.md
│   └── 06-Data-Model.md
│
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Landing page (paste link)
│   │   ├── compare/
│   │   │   └── page.tsx              # Result page (?url=)
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Product detail [V2]
│   │   ├── api/
│   │   │   ├── compare/
│   │   │   │   └── route.ts         # POST /api/compare
│   │   │   ├── products/
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts     # GET /api/products/:id
│   │   │   ├── cron/
│   │   │   │   └── update-prices/
│   │   │   │       └── route.ts     # Cron job
│   │   │   └── health/
│   │   │       └── route.ts         # GET /api/health
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── SearchInput.tsx
│   │   ├── ProductCard.tsx
│   │   ├── OfferCard.tsx
│   │   ├── PriceSummary.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       └── Skeleton.tsx
│   │
│   ├── lib/
│   │   ├── shopee.ts                 # Shopee Affiliate API client
│   │   ├── involve-asia.ts           # Involve Asia API client
│   │   ├── url-parser.ts             # Shopee URL → shop_id, item_id
│   │   ├── affiliate-link.ts         # Build affiliate URLs
│   │   ├── cache.ts                  # KV cache helpers
│   │   ├── db.ts                     # DB client + queries
│   │   └── logger.ts                 # Error logging
│   │
│   └── types/
│       ├── product.ts
│       ├── offer.ts
│       └── api.ts
│
├── public/
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── vercel.json
```

---

## 11. Vercel Configuration

```json
// vercel.json
{
  "functions": {
    "api/compare/route.ts": {
      "maxDuration": 30
    },
    "api/cron/update-prices/route.ts": {
      "maxDuration": 60
    }
  },
  "crons": [
    {
      "path": "/api/cron/update-prices",
      "schedule": "0 */6 * * *"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

---

## 12. Shopee Affiliate API Integration Detail

| Field | Value |
|---|---|
| Endpoint | `https://open-api.affiliate.shopee.co.id/graphql` |
| Auth Method | HMAC-SHA256 (App ID + App Secret) |
| Key Query | `productOfferV2` |

### HMAC Signature Generation

```
timestamp = Date.now() / 1000
baseString = appId + timestamp
signature = HMAC-SHA256(baseString, appSecret) → hex
```

### GraphQL Query (productOfferV2)

```graphql
query productOfferV2($matchId: String!) {
  productOfferV2(
    keyword: $matchId
    sortBy: "priceASC"
    limit: 20
  ) {
    node {
      product {
        productName
        productImage
        priceMin
        priceMax
        shopName
        shopId
        itemId
      }
    }
  }
}
```

---

## 13. Involve Asia API Integration Detail

| Field | Value |
|---|---|
| Endpoint | `https://api.involve.asia/v1/{...}` |
| Auth | Bearer token (API Key + Secret → token, 1h expiry) |
| Key Endpoint | `POST /v1/deeplink/generate` |

### Role in V1

Involve Asia is **optional** and used only for:
1. Wrapping Shopee product links in affiliate deeplink (may yield higher commission than Shopee direct affiliate)
2. Generating Lazada search redirect links (no price data, just search URL)

**Important**: Involve Asia API does NOT expose product pricing. Lazada integration in V1 is search redirect only, not price comparison.

### Deeplink Request

```json
POST /v1/deeplink/generate
Authorization: Bearer {token}
{
  "target": "https://shopee.co.id/...",
  "mediaId": "{campaign_id}"
}
```

### Deeplink Response

```json
{
  "data": {
    "clickId": "...",
    "deeplink": "https://invol.co/cl{id}",
    "targetUrl": "https://shopee.co.id/..."
  }
}
```

**Token Refresh**: API Key + Secret → `POST /auth/token` (implement auto-refresh in client)

---

## 14. Testing Strategy

| Type | Tool | Scope |
|---|---|---|
| Unit | Vitest | URL parser, price sorter, API response transformers |
| Integration | Vitest + MSW | API routes with mocked external calls |
| E2E | Playwright | Full user flow (paste → result → click) |
| Cron | Manual | Test cron endpoint with auth header |

### Testing Priorities (MVP)

1. URL parser — vast coverage (Shopee URL variants)
2. API response transformers — handle missing fields
3. Error states — every error path
4. Rate limiting — KV counter correctness
