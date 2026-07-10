# Data Model
## BetterPrice — Database Schema & Entity Relationships

**Version:** 1.0  
**Date:** 2026-07-07  
**Status:** Draft  

---

## 1. Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────┐
│    products      │       │     offers       │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │◄──────│ id (PK)          │
│ shopee_shop_id   │  1:N  │ product_id (FK)  │
│ shopee_item_id   │       │ platform         │
│ name             │       │ store_name       │
│ image_url        │       │ store_rating     │
│ category         │       │ location         │
│ url              │       │ price            │
│ created_at       │       │ affiliate_url    │
│ updated_at       │       │ commission_rate  │
└──────────────────┘       │ is_active        │
       │                   │ created_at       │
       │ 1:N               │ updated_at       │
       │                   └──────────────────┘
       │                           │
       │                           │ 1:N
       ▼                           ▼
┌──────────────────┐       ┌──────────────────┐
│  price_history   │       │  search_logs     │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ product_id (FK)  │       │ product_id (FK)  │
│ offer_id (FK)    │       │ url_input        │
│ price            │       │ client_id        │
│ currency         │       │ source           │
│ recorded_at      │       │ ip_hash          │
└──────────────────┘       │ offers_found     │
                            │ cheapest_price   │
┌──────────────────┐       │ created_at       │
│  cached_searches │       └──────────────────┘
├──────────────────┤
│ id (PK)          │
│ url_hash (UIDX)  │
│ response_json    │
│ created_at       │
│ expires_at       │
└──────────────────┘
```

---

## 2. Tables

### 2.1 `products`

Master product table — one row per unique Shopee product (identified by shop_id + item_id).

```sql
CREATE TABLE products (
    id            TEXT PRIMARY KEY,           -- nanoid: 'prod_' + 12 chars
    shopee_shop_id BIGINT NOT NULL,          -- Shopee shop_id from URL
    shopee_item_id BIGINT NOT NULL,          -- Shopee item_id from URL
    name          TEXT NOT NULL,
    image_url     TEXT,
    category      TEXT,                       -- optional, from API
    url           TEXT NOT NULL,              -- original Shopee URL
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- One product per shopee item
    CONSTRAINT uq_products_shopee_item
        UNIQUE (shopee_shop_id, shopee_item_id)
);

CREATE INDEX idx_products_name_trgm ON products USING gin (name gin_trgm_ops);
CREATE INDEX idx_products_created_at ON products (created_at DESC);
```

### 2.2 `offers`

Price offers from different platforms/stores for a product.

```sql
CREATE TABLE offers (
    id              TEXT PRIMARY KEY,         -- nanoid: 'off_' + 12 chars
    product_id      TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    platform        TEXT NOT NULL,            -- 'shopee' | 'lazada'
    store_name      TEXT NOT NULL,
    store_rating    REAL,                     -- 0.0 - 5.0
    location        TEXT,                     -- city (if available)
    price           BIGINT NOT NULL,          -- price in IDR (integer, avoid float)
    currency        TEXT NOT NULL DEFAULT 'IDR',
    affiliate_url   TEXT,                     -- generated affiliate link
    commission_rate REAL,                     -- e.g., 0.05 for 5%
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- One offer per product per platform per store
    CONSTRAINT uq_offers_product_platform_store
        UNIQUE (product_id, platform, store_name)
);

CREATE INDEX idx_offers_product_id ON offers (product_id);
CREATE INDEX idx_offers_price_asc ON offers (product_id, price ASC);
CREATE INDEX idx_offers_platform ON offers (platform);
```

### 2.3 `price_history`

Time-series price data — inserted by cron job or on-demand.

```sql
CREATE TABLE price_history (
    id          TEXT PRIMARY KEY,             -- nanoid: 'ph_' + 14 chars
    product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    offer_id    TEXT REFERENCES offers(id) ON DELETE SET NULL,
    price       BIGINT NOT NULL,             -- price in IDR
    currency    TEXT NOT NULL DEFAULT 'IDR',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_price_history_product_id ON price_history (product_id);
CREATE INDEX idx_price_history_recorded_at ON price_history (product_id, recorded_at DESC);

-- Cleanup: TTL 90 days (enforced by cron)
```

### 2.4 `search_logs`

Analytics log — every compare request.

```sql
CREATE TABLE search_logs (
    id              TEXT PRIMARY KEY,         -- nanoid: 'sl_' + 14 chars
    product_id      TEXT REFERENCES products(id) ON DELETE SET NULL,
    url_input       TEXT NOT NULL,            -- original URL pasted
    client_id       TEXT,                     -- anonymous client fingerprint
    ip_hash         TEXT,                     -- hashed IP (privacy)
    source          TEXT DEFAULT 'web',       -- 'web' | 'extension' [V3]
    offers_found    INTEGER NOT NULL DEFAULT 0,
    cheapest_price  BIGINT,
    duration_ms     INTEGER,                  -- API response time
    error_code      TEXT,                     -- non-null if failed
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_search_logs_created_at ON search_logs (created_at DESC);
CREATE INDEX idx_search_logs_product_id ON search_logs (product_id);
CREATE INDEX idx_search_logs_ip_hash ON search_logs (ip_hash);

-- Partition by month for large datasets (V3)
```

### 2.5 `cached_searches`

*(Optional — can be replaced by Vercel KV entirely)*

```sql
CREATE TABLE cached_searches (
    id              TEXT PRIMARY KEY,
    url_hash        TEXT NOT NULL UNIQUE,     -- MD5/SHA256 of URL
    response_json   JSONB NOT NULL,           -- full API response
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at      TIMESTAMPTZ NOT NULL      -- TTL
);

CREATE INDEX idx_cached_searches_url_hash ON cached_searches (url_hash);
CREATE INDEX idx_cached_searches_expires ON cached_searches (expires_at);

-- Cleanup: DELETE FROM cached_searches WHERE expires_at < now() (via cron)
```

---

## 3. SQL Functions & Triggers

### 3.1 Auto-update `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_offers_updated_at
    BEFORE UPDATE ON offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3.2 Get cheapest offer for product

```sql
CREATE OR REPLACE FUNCTION get_cheapest_offer(p_product_id TEXT)
RETURNS TABLE (
    offer_id        TEXT,
    platform        TEXT,
    store_name      TEXT,
    price           BIGINT,
    affiliate_url   TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT o.id, o.platform, o.store_name, o.price, o.affiliate_url
    FROM offers o
    WHERE o.product_id = p_product_id
      AND o.is_active = true
    ORDER BY o.price ASC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```

---

## 4. Vercel KV Schema (Redis)

KV is used for ephemeral data — NOT stored in Postgres.

| Key Pattern | Value Type | TTL | Purpose |
|---|---|---|---|
| `cache:shopee:{item_id}` | JSON string | 300s (5 min) | Shopee API response cache |
| `ratelimit:{ip_hash}` | Number (counter) | 60s | Rate limit (30 req/min) |
| `auth:involve:token` | JSON string | ~3600s (1h) | Involve Asia auth token (optional) |
| `analytics:daily:visitors` | HyperLogLog | 86400s (24h) | Unique daily visitors |

---

## 5. TypeScript Types

```typescript
// src/types/product.ts
export interface Product {
  id: string;
  shopeeShopId: number;
  shopeeItemId: number;
  name: string;
  imageUrl: string | null;
  category: string | null;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

// src/types/offer.ts
export interface Offer {
  id: string;
  productId: string;
  platform: 'shopee' | 'lazada';
  storeName: string;
  storeRating: number | null;
  location: string | null;
  price: number;
  currency: string;
  affiliateUrl: string | null;
  commissionRate: number | null;
  isActive: boolean;
}

// src/types/api.ts
export interface CompareRequest {
  url: string;
}

export interface CompareResponse {
  product: {
    id: string;
    name: string;
    image: string | null;
    url: string;
    shopName: string;
  };
  offers: Array<{
    storeName: string;
    storeRating: number | null;
    location: string | null;
    price: number;
    priceFormatted: string;
    url: string | null;
    isCheapest: boolean;
  }>;
  meta: {
    currency: string;
    updatedAt: string;
    source: string;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    hint?: string;
    retryAfter?: number;
    detail?: string;
  };
}
```

---

## 6. Index Strategy

| Table | Index | Type | Justification |
|---|---|---|---|
| `products` | `(shopee_shop_id, shopee_item_id)` | UNIQUE B-tree | Lookup by URL parse result |
| `products` | `name` | GIN trigram | Product name search (V2) |
| `offers` | `(product_id, price)` | B-tree | Sort offers by price |
| `offers` | `(product_id, platform, store_name)` | UNIQUE B-tree | Upsert deduplication |
| `price_history` | `(product_id, recorded_at)` | B-tree DESC | Time-series queries |
| `search_logs` | `created_at` | B-tree DESC | Analytics queries |

---

## 7. Migration Strategy

- Use raw SQL files in `src/db/migrations/` (numbered: `001_create_products.sql`, etc.)
- No ORM (Prisma/Drizzle) in MVP — raw SQL with `@vercel/postgres`
- Simple migration runner:

```typescript
// src/lib/migrate.ts
import { sql } from '@vercel/postgres';

const migrations = [
  '001_create_products.sql',
  '002_create_offers.sql',
  '003_create_price_history.sql',
  '004_create_search_logs.sql',
];

async function runMigrations() {
  for (const file of migrations) {
    const content = await fs.readFile(`src/db/migrations/${file}`, 'utf-8');
    await sql.query(content);
  }
}
```

- Run on deploy via `vercel.json` post-deploy hook or in `/api/health` on first call
