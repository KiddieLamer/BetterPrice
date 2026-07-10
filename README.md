# BetterPrice

Price comparison platform for Indonesian e-commerce. Paste a Shopee link → see the cheapest price across sellers.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Vercel Postgres / Neon
- **Cache:** Vercel KV / Upstash Redis
- **Deploy:** Vercel (Hobby)

## Getting Started

### 1. Clone & Install

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

| Variable | Required | Source |
|---|---|---|
| `SHOPEE_AFFILIATE_APP_ID` | Yes | [Shopee Affiliate Dashboard](https://affiliate.shopee.co.id) |
| `SHOPEE_AFFILIATE_APP_SECRET` | Yes | [Shopee Affiliate Dashboard](https://affiliate.shopee.co.id) |
| `DATABASE_URL` | No (optional) | Vercel Postgres / Neon |
| `KV_URL` | No (optional) | Vercel KV / Upstash Redis |

### 3. Run Dev Server

```bash
npm run dev
```

### 4. Test API

```bash
curl http://localhost:3000/api/health
```

```bash
curl -X POST http://localhost:3000/api/compare \
  -H "Content-Type: application/json" \
  -d '{"url":"https://shopee.co.id/product/123/456"}'
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx
│   ├── api/
│   │   ├── compare/route.ts     # POST /api/compare
│   │   └── health/route.ts      # GET /api/health
├── components/                  # React components
├── lib/
│   ├── shopee.ts                # Shopee Affiliate API client
│   ├── url-parser.ts            # Shopee URL → shop_id, item_id
│   ├── cache.ts                 # Vercel KV + memory fallback
│   ├── db.ts                    # DB client stub
│   ├── affiliate-link.ts        # Affiliate URL builder
│   └── logger.ts                # Error logging
└── types/
    ├── product.ts
    ├── offer.ts
    └── api.ts
```

## API

### `POST /api/compare`

**Request:**
```json
{ "url": "https://shopee.co.id/product/123456789/2345678901" }
```

**Response:**
```json
{
  "product": { "id", "name", "image", "shopName", "priceMin", "priceMax", "currency": "IDR" },
  "offers": [{ "platform": "shopee", "storeName", "price", "url", "rating", "isLowest" }],
  "lazadaUrl": "https://www.lazada.co.id/catalog/?q=..."
}
```

## Deploy on Vercel

1. Push to GitHub
2. Import repo on [Vercel](https://vercel.com/new)
3. Add environment variables in **Project Settings → Environment Variables**
4. Deploy 🚀

No additional config needed — `vercel.json` is already set up.
