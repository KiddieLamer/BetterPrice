# FE-UI — Frontend UI Specification

**Version:** 1.0  
**Date:** 2026-07-10  
**Status:** Draft

---

## 1. Pages

### 1.1 Landing Page (`/`)

**Tujuan:** User paste link Shopee → klik "Cek Harga" → redirect ke halaman hasil.

```
┌──────────────────────────────────────────┐
│  [BP] BetterPrice                        │
│                                          │
│         Cek Harga Termurah                │
│   Cukup paste link Shopee,               │
│   lihat harga dari semua toko            │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ Paste link Shopee...            │   │
│  └──────────────────────────────────┘   │
│        [ Cek Harga ]                    │
│                                          │
│  Contoh:                                 │
│  shopee.co.id/product/...                │
│  shopee.co.id/...                        │
│                                          │
│  ─── Cara Kerja ───                     │
│  📋 Paste link  →  🔍 Cari harga  →  🛒 Beli│
│                                          │
│  ⚠️ Kami mendapat komisi dari pembelian. │
└──────────────────────────────────────────┘
```

**State:**

| State | Tampilan |
|---|---|
| Default | Input kosong, button "Cek Harga" aktif |
| Loading | Button spinner, input disabled |
| Error (invalid URL) | Input red border + "Link tidak valid" |
| Error (API error) | Banner merah + "Coba lagi" |

### 1.2 Compare Page (`/compare?url=...`)

**Tujuan:** Tampilin hasil perbandingan harga dari Shopee.

```
┌──────────────────────────────────────────┐
│  ← Kembali                               │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  [Gambar Produk]                 │   │
│  │  Samsung Galaxy S24 Ultra        │   │
│  │  Toko: TechShop Official         │   │
│  └──────────────────────────────────┘   │
│                                          │
│  Harga Termurah: Rp 18.999.000          │
│  ─── Hemat Rp 1.500.000 ───             │
│                                          │
│  ┌─────────────────────────────────────┐│
│  │ 🏪 Toko B   Rp 18.999.000  [Beli] ★││
│  │    ⭐4.8  • 1.5rb terjual           ││
│  ├─────────────────────────────────────┤│
│  │ 🏪 Toko A   Rp 20.499.000  [Beli]  ││
│  │    ⭐4.9  • 500 terjual             ││
│  ├─────────────────────────────────────┤│
│  │ 🏪 Toko C   Rp 20.999.000  [Beli]  ││
│  │    ⭐4.7  • 200 terjual             ││
│  └─────────────────────────────────────┘│
│                                          │
│  [🔍 Cek di Lazada] (new tab)            │
│                                          │
│  [Cek Harga Lagi]                        │
│                                          │
│  ⚠️ Harga dapat berubah.                 │
│  Kami mendapat komisi dari pembelian.    │
└──────────────────────────────────────────┘
```

**State:**

| State | Tampilan |
|---|---|
| Loading | 3 skeleton cards (shimmer) |
| Success | Product info + offers + Lazada button |
| Empty (no offers) | "Produk tidak ditemukan" + coba link lain |
| Error (API failed) | "Maaf, sedang gangguan" + tombol retry |

---

## 2. Components

### 2.1 `SearchBar`

**File:** `src/components/SearchBar.tsx`

Input buat paste link Shopee + tombol Cek Harga.

```
┌──────────────────────────────────┐
│  Paste link Shopee...     [Cari] │
└──────────────────────────────────┘
```

**Props:**
```ts
interface SearchBarProps {
  onSearch: (url: string) => void
  isLoading?: boolean
}
```

**Behavior:**
- Submit → parsing URL → `POST /api/compare`
- Validasi: harus domain shopee.co.id
- Kalo invalid → red border + error message
- Kalo loading → button spinner, input disabled

### 2.2 `ProductCard`

**File:** `src/components/ProductCard.tsx`

Menampilkan info produk utama.

```
┌──────────────────────────────────┐
│  ┌────────────────────────┐     │
│  │     Product Image       │     │
│  └────────────────────────┘     │
│  Samsung Galaxy S24 Ultra       │
│  Toko: TechShop Official        │
└──────────────────────────────────┘
```

**Props:**
```ts
interface ProductCardProps {
  product: Product
}
```

### 2.3 `OfferCard`

**File:** `src/components/OfferCard.tsx`

Satu baris offer dari toko Shopee.

```
┌─────────────────────────────────────┐
│ 🏪 Toko B   Rp 18.999.000  [Beli]  │
│    ⭐4.8  • 1.5rb terjual           │
└─────────────────────────────────────┘
```

**Props:**
```ts
interface OfferCardProps {
  offer: Offer
  isLowest?: boolean
}
```

### 2.4 `PriceSummary`

**File:** `src/components/PriceSummary.tsx`

Ringkasan harga — termurah + selisih.

```
Harga Termurah: Rp 18.999.000
─── Hemat Rp 1.500.000 ───
```

**Props:**
```ts
interface PriceSummaryProps {
  lowestPrice: number
  highestPrice: number
  currency?: string
}
```

### 2.5 `Skeleton`

**File:** `src/components/ui/Skeleton.tsx`

Loading shimmer — di pake pas nunggu API.

```
┌──────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓            │  ← elemen loading
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓       │
└──────────────────────────────┘
```

### 2.6 `Footer`

**File:** `src/components/Footer.tsx`

Footer minimal + affiliate disclosure.

```
BetterPrice © 2026
⚠️ Kami mendapat komisi dari pembelian melalui link afiliasi.
Harga dapat berubah sewaktu-waktu.
```

---

## 3. Colors & Tokens

| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#171717` (black) | Backgrounds, teks utama |
| `--color-accent` | `#22C55E` (green) | Harga termurah, CTA |
| `--color-surface` | `#F8F8F8` | Card background |
| `--color-error` | `#EF4444` (red) | Error messages |
| `--color-muted` | `#9CA3AF` | Secondary text |
| `--color-white` | `#FFFFFF` | Page background |

Font utama: `Inter` (body) + custom buat headline.

---

## 4. Data Flow

```
Landing Page                    Compare Page
┌──────────┐                   ┌─────────────────┐
│ Paste URL │                   │                 │
│ Klik Cari │──→ /compare?url=──→│ Loading skeleton│
└──────────┘     (client)       │                 │
                                │ client fetch     │
                                │ POST /api/compare│
                                │         │        │
                                │  ┌──────▼─────┐  │
                                │  │  Response   │  │
                                │  │  → Product  │  │
                                │  │  → Offers   │  │
                                │  │  → Lazada   │  │
                                │  └────────────┘  │
                                │         │        │
                                │  ┌──────▼─────┐  │
                                │  │  Render     │  │
                                │  │  Result     │  │
                                │  └────────────┘  │
                                └─────────────────┘
```

---

## 5. File Changes

### Buat baru:
```
src/components/SearchBar.tsx
src/components/ProductCard.tsx
src/components/OfferCard.tsx
src/components/PriceSummary.tsx
src/components/Footer.tsx
src/components/ui/Skeleton.tsx
src/app/compare/page.tsx
```

### Hapus:
```
src/components/VideoBackground.tsx
src/components/Badge.tsx
src/components/NavigationBar.tsx
src/components/SearchInput.tsx
```

### Ubah:
```
src/app/page.tsx          → Landing page baruw
src/app/globals.css       → Color tokens
src/app/layout.tsx        → Font, metadata
```

---

## 6. Daftar Response API

Semua response dari `POST /api/compare` (udah diimplement di backend):

```ts
// Success (200)
{
  "product": {
    "id": "123_456",
    "name": "Samsung Galaxy S24 Ultra",
    "image": "https://cf.shopee.co.id/file/...",
    "shopName": "TechShop Official",
    "shopId": 123,
    "itemId": 456,
    "priceMin": 18999000,
    "priceMax": 20999000,
    "currency": "IDR"
  },
  "offers": [
    { "platform": "shopee", "storeName": "Toko B", "price": 18999000, "rating": 4.8, "url": "...", "isLowest": true },
    { "platform": "shopee", "storeName": "Toko A", "price": 20499000, "rating": 4.9, "url": "...", "isLowest": false }
  ],
  "lazadaUrl": "https://www.lazada.co.id/catalog/?q=Samsung+Galaxy+S24"
}

// Error (400) — invalid URL
{ "error": { "code": "INVALID_URL", "message": "Harap gunakan link Shopee" } }

// Error (404) — product not found
{ "error": { "code": "PRODUCT_NOT_FOUND", "message": "Produk tidak ditemukan" } }

// Error (500) — server error
{ "error": { "code": "INTERNAL_ERROR", "message": "Terjadi kesalahan. Silakan coba lagi." } }
```

---

## 7. Prioritas Implementasi

| Urutan | Komponen | Notes |
|---|---|---|
| 1 | SearchBar | Input utama landing page |
| 2 | Landing page (`/`) | Hero + SearchBar + contoh link |
| 3 | Compare page (`/compare`) | Fetch API + loading skeleton |
| 4 | ProductCard + OfferCard | Tampilkan hasil |
| 5 | PriceSummary | Ringkasan harga termurah |
| 6 | Footer | Disclosure |
| 7 | Hapus komponen lama | VideoBackground, Badge, dll |
