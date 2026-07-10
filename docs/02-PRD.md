# PRD — Product Requirements Document
## BetterPrice — Price Comparison Platform for Indonesia

**Version:** 1.0  
**Date:** 2026-07-07  
**Status:** Draft  

---

## 1. Vision & Mission

**Vision:** Menjadi tempat pertama yang dikunjungi pembeli Indonesia sebelum belanja — cek harga termurah dari semua toko Shopee dalam satu klik.

**Mission:** Menghilangkan FOMO harga dengan memberikan transparansi harga real-time sesama toko Shopee dan antar marketplace ke depannya.

**Value Proposition:** "Paste link Shopee → liat harga termurah dari toko-toko Shopee lain. Satu klik."

---

## 2. User Personas

### Persona 1: Rina — "Si Harga Hunter"

| Trait | Detail |
|---|---|
| Usia | 22-30 |
| Pekerjaan | Karyawan swasta / mahasiswa |
| Perilaku | Suka hunting diskon, join grup promo Telegram |
| Pain | Buka 5-10 tab, copy paste manual |
| Quote | "Beli sebelum cek harga di tempat lain, nyesel." |

### Persona 2: Dimas — "Impulse Buyer"

| Trait | Detail |
|---|---|
| Usia | 25-35 |
| Pekerjaan | Freelancer / remote worker |
| Perilaku | Lihat barang keren, langsung mau beli |
| Pain | Takut kecewa, butuh validasi harga cepat |
| Quote | "Dari pada buka sana sini, minta tolong BetterPrice aja." |

### Persona 3: Sari — "Reseller Kecil"

| Trait | Detail |
|---|---|
| Usia | 20-28 |
| Pekerjaan | Reseller fashion / aksesoris |
| Perilaku | Order barang dalam jumlah kecil, margin tipis |
| Pain | Setiap rupiah berarti, butuh cek harga grosir termurah |
| Quote | "Beda 2rb per item, kalau order 50 jadi 100rb." |

---

## 3. Feature List by Phase

### V1 — MVP (Core Loop)

| ID | Feature | Description | Priority |
|---|---|---|---|---|
| F-01 | Paste Link Input | Text input untuk Shopee product URL | P0 |
| F-02 | URL Parser | Ekstrak shop_id, item_id, product name | P0 |
| F-03 | Shopee Price Check | Cari harga dari Shopee Affiliate API | P0 |
| F-05 | Compare Result | Tampilkan produk + daftar harga Shopee terendah ke tertinggi | P0 |
| F-06 | Affiliate Redirect | Link ke Shopee dengan tag affiliate | P0 |
| F-07 | Error Handling | Invalid URL, product not found, API error | P0 |
| F-08 | Loading State | Skeleton/loading indicator selama fetching | P1 |
| F-09 | Empty State | "Belum ada hasil" dengan contoh link | P1 |
| F-10 | Mobile Responsive | Full responsive, mobile-first | P0 |
| F-11 | Basic Analytics | Hit counter, product search log | P1 |

### V2 — Enhancement

| ID | Feature | Description | Priority |
|---|---|---|---|---|
| F-12 | Search by Name | Search produk tanpa link | P1 |
| F-13 | Price History Chart | Grafik harga dari cron job | P1 |
| F-14 | Lazada Integration | Search redirect + future price compare Shopee vs Lazada | P2 |
| F-15 | Share Result | Shareable link hasil compare | P2 |
| F-16 | SEO Product Pages | Tiap produk punya halaman sendiri | P1 |
| F-17 | Price Alert | Notifikasi ketika harga turun | P2 |
| F-18 | Dark Mode | Toggle tema | P2 |

### V3 — Scale

| ID | Feature | Description | Priority |
|---|---|---|---|---|
| F-19 | User Accounts | Save history, watchlist | P2 |
| F-20 | Tokopedia Integration | Compare Shopee vs Tokopedia (via scraping/API) | P2 |
| F-21 | Browser Extension | Compare from any page | P2 |
| F-22 | Bulk Check | Paste multiple links at once | P2 |
| F-23 | Affiliate Dashboard | Earn stats for admin | P2 |
| F-24 | Multi-language | EN/ID | P3 |

---

## 4. Acceptance Criteria

### F-01: Paste Link Input

```
GIVEN user visits BetterPrice
WHEN user sees the main page
THEN there is a single text input with:
  - Placeholder: "Paste link Shopee..."
  - Clear button on input
  - CTA button: "Cek Harga"
  - Example link text below input

GIVEN user pastes a valid Shopee link
WHEN user clicks "Cek Harga"
THEN URL is validated, loading state shown

GIVEN user pastes invalid text
WHEN user clicks "Cek Harga"
THEN error message: "Link tidak valid. Pastikan link Shopee."
```

### F-05: Compare Result

```
GIVEN product found successfully
WHEN result page loads
THEN user sees:
  - Product image
  - Product name
  - Price sorted: lowest → highest (Shopee sellers only)
  - Each offer shows: store name, price, CTA button

GIVEN multiple Shopee offers exist
WHEN displayed
THEN cheapest price is highlighted with badge "Termurah"
  And CTA buttons use affiliate links
  And disclosure text: "Harga diperbarui beberapa saat lalu"
```

### F-07: Error Handling

```
GIVEN Shopee API fails
WHEN /compare request processed
THEN show error: "Gagal mengambil data. Coba lagi nanti."
  AND log error for monitoring

GIVEN Shopee API succeeds but no offers found
WHEN /compare request processed
THEN show: "Produk tidak ditemukan. Mungkin sudah tidak tersedia."
  AND suggest similar products if available
```

---

## 5. Non-Functional Requirements

| Category | Requirement | Target |
|---|---|---|
| Performance | API response time (p95) | <3s |
| Availability | Uptime | >99.5% |
| Mobile Support | Responsive | 100% pages |
| SEO | Products indexable | V2 target |
| Accessibility | WCAG A | Basic compliance |
| Security | Affiliate keys | Never exposed client-side |
| Observability | Error logging | All API errors logged |

---

## 6. Out of Scope (MVP)

- User accounts / login
- Cross-platform comparison (Lazada, Tokopedia, TikTok Shop)
- Search by product name (only by URL)
- Price history chart
- Browser extension
- Mobile app
- Admin dashboard
- Cashback / rewards
- Seller dashboard
