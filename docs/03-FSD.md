# FSD — Functional Specification Document
## BetterPrice — Price Comparison Platform for Indonesia

**Version:** 1.0  
**Date:** 2026-07-07  
**Status:** Draft  

---

## 1. User Flow (Core Journey)

```
                    ┌──────────────────────────────────────┐
                    │          LANDING PAGE                │
                    │  ┌──────────────────────────────┐   │
                    │  │  Paste link Shopee...        │   │
                    │  └──────────────────────────────┘   │
                    │  [         Cek Harga          ]     │
                    └───────────┬──────────────────────────┘
                                │
                    ┌───────────▼──────────────────────────┐
                    │       URL VALIDATION                 │
                    │  Valid? ─── Yes ───→ Loading State   │
                    │    │                                  │
                    │    └── No ───→ Error: "Link tidak     │
                    │                valid"                │
                    └──────────────────────────────────────┘
                                │
                     ┌───────────▼──────────────────────────┐
                     │       SEARCHING...                   │
                     │  Scanning Shopee sellers... (spinner)│
                     │  [Cancel]                            │
                     └──────────────────────────────────────┘
                                 │
                      ┌───────────▼──────────────────────────┐
                      │       RESULT PAGE                    │
                      │  ┌──────────────────────────────┐   │
                      │  │ [Image] Product Name         │   │
                      │  │ Toko: Seller Name            │   │
                      │  └──────────────────────────────┘   │
                      │                                     │
                      │  ┌─────── SHOPEE OFFERS ─────────┐  │
                      │  │ Toko A   │ Rp 150.000  [Beli]│  │
                      │  │ Toko B   │ Rp 145.000  [Beli]│  │← Termurah
                      │  │ Toko C   │ Rp 165.000  [Beli]│  │
                      │  └──────────────────────────────┘  │
                      │  [ Cek Harga Lagi ]                │
                      └──────────────────────────────────────┘
                                  │
                      ┌───────────▼──────────────────────────┐
                      │     AFFILIATE REDIRECT               │
                      │  Click Shopee → affiliate link       │
                      │  → User completes purchase           │
                      │  → Platform earns commission         │
                      └──────────────────────────────────────┘
```

---

## 2. Screen Specifications

### 2.1 Landing Page

```
┌─────────────────────────────────────────┐
│  ┌──┐ betterprice.id                    │
│  │BP│                                   │
│  └──┘                                   │
│                                         │
│         Temukan Harga Termurah           │
│         Cukup paste link Shopee         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Paste link Shopee...           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Cek Harga              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Contoh: https://shopee.co.id/...       │
│                                         │
│     ─── Cara Kerja ───                  │
│  📋 Paste link │ 🔍 Cari harga │ 🛒 Beli│
└─────────────────────────────────────────┘
```

**States:**

| State | Behavior |
|---|---|
| **Default** | Empty input, CTA button enabled |
| **Typing** | No validation until submit |
| **Loading** | CTA → spinner, input disabled, cancel button |
| **Error (invalid URL)** | Red border + error message below input |
| **Error (API failure)** | Warning banner + "Coba lagi" button |

### 2.2 Result Page

```
┌─────────────────────────────────────────┐
│  ← Kembali                       🔗 Bagikan│
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  [Product Image 200x200]       │   │
│  │                                 │   │
│  │  Samsung Galaxy S24 Ultra       │   │
│  │  Toko: TechShop Jakarta         │   │
│  │  Terakhir update: 2 menit lalu  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Harga Termurah: Rp 18.999.000         │
│  ─── Hemat Rp 1.500.000 ───            │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 🛒  Toko A   Rp 20.499.000  [Beli] ││
│  │     4.9★ • Jakarta                  ││
│  ├─────────────────────────────────────┤│
│  │ 🛒  Toko B   Rp 18.999.000  [Beli]★││
│  │     4.8★  • Tangerang (Termurah)    ││
│  ├─────────────────────────────────────┤│
│  │ 🛒  Toko C   Rp 20.999.000  [Beli] ││
│  │     4.7★  • Bandung                 ││
  │  └─────────────────────────────────────┘│
  │                                         │
  │  [Cek Harga Lagi]                       │
│                                         │
│  ⚠️ Harga dapat berubah.                │
│  Kami mendapat komisi dari pembelian.   │
└─────────────────────────────────────────┘
```

**States:**

| State | Behavior |
|---|---|
| **Loading** | Skeleton cards (3x shimmer) |
| **Success** | Product info + Shopee offers sorted by price |
| **Empty (no offers found)** | "Produk tidak ditemukan" + alternative actions |
| **Error (API failed)** | "Maaf, sedang gangguan" + retry button |

### 2.3 Error Page

```
┌─────────────────────────────────────────┐
│                                         │
│           😕 Ups!                       │
│                                         │
│   Link yang kamu masukkan tidak valid   │
│                                         │
│   Pastikan format link:                 │
│   https://shopee.co.id/...              │
│                                         │
│  [Coba Lagi]                            │
│                                         │
│  Atau coba link contoh:                 │
│  https://shopee.co.id/...               │
└─────────────────────────────────────────┘
```

---

## 3. Component Tree (Frontend)

```
App
├── Layout
│   ├── Header (Logo, Nav)
│   └── Footer (Disclaimer, Privacy, Contact)
│
├── Pages
│   ├── Home (/)
│   │   ├── HeroSection
│   │   │   ├── Headline
│   │   │   └── Subheadline
│   │   ├── SearchInput
│   │   │   ├── TextInput (paste URL)
│   │   │   ├── SubmitButton (Cek Harga)
│   │   │   └── ErrorMessage
│   │   └── HowItWorks
│   │
│   ├── Compare (/compare?url=...)
│   │   ├── LoadingScreen (Skeleton)
│   │   ├── ProductCard
│   │   │   ├── ProductImage
│   │   │   ├── ProductName
│   │   │   ├── StoreInfo
│   │   │   └── LastUpdated
│   │   ├── PriceSummary
│   │   │   ├── BestPrice
│   │   │   └── SavingsBadge
  │   │   ├── OfferList
│   │   │   └── OfferCard[]
│   │   │       ├── StoreName
│   │   │       ├── Price
│   │   │       ├── Rating
│   │   │       └── CTAButton (Shopee affiliate link)
│   │   ├── AffiliateDisclaimer
│   │   └── RetryButton (on error)
│   │
│   └── ProductDetail (/product/:id) [V2]
│
└── Shared
    ├── Button
    ├── Badge ("Termurah")
    ├── Skeleton
    ├── ErrorBoundary
    └── SEOHead
```

---

## 4. Edge Cases

| Case | Handling |
|---|---|
| **Link not Shopee** | Detect domain → "Harap gunakan link Shopee" |
| **Deleted product** | Shopee returns null/error → "Produk sudah tidak tersedia" |
| **Same price** | Sort by store name alphabetically; both get "Termurah" badge |
| **Extremely long URL** | Truncate display, parse correctly |
| **URL with affiliate params** | Strip affiliate params before processing |
| **URL with tracking (?smtt=)** | Strip tracking parameters |
| **Mobile share sheet** | Detect incoming URL via share intent (PWA) |
| **Very slow API (>10s)** | Show timeout error with retry |
| **Rate limited** | Show "Terlalu banyak permintaan. Coba 1 menit lagi" |
| **Product has variants (color/size)** | Show base price; variant selection deferred to V2 |

---

## 5. Mobile Responsive Behavior

| Breakpoint | Layout |
|---|---|
| < 480px (mobile) | Single column, full-width input, stacked cards |
| 480-768px (tablet) | Single column, centered max-width 480px |
| > 768px (desktop) | 2-column result layout: left (product), right (offers) |

### Mobile-Specific

- Bottom sheet for share
- Touch-friendly CTA buttons (min 48px height)
- Native date picker for price alert (V2)
- Swipe to dismiss error banners

---

## 6. Analytics Events (MVP)

| Event | Trigger | Payload |
|---|---|---|
| `page_view` | Page load | page, referrer, url |
| `compare_start` | Submit URL | url, product_id |
| `compare_success` | Result loaded | product_id, offers_count |
| `compare_error` | Error shown | error_type, message |
| `affiliate_click` | Click Shopee CTA | store_name, product_id, price |
| `share_click` | Click share | product_id |

*Implemented via Vercel Analytics (free tier) — no GA dependency*
