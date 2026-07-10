# Discussion Points — BetterPrice Audit

**Date:** 2026-07-07  
**Status:** For review & discussion  
**Scope:** V1 = Shopee-only price comparison. Cross-platform (Lazada, Tokopedia) = V2/V3.  

Dokumen ini berisi temuan dari audit 6 dokumen fondasi (BRD, PRD, FSD, TSD, API Contract, Data Model). Dibagi per kategori biar enak didiskusiin satu-satu.

---

## A. Asumsi Kritis yang Belum Tervalidasi

Ini yang paling penting — kalo salah satu dari ini gagal, arsitektur harus pivot.

### A.1 Apakah `productOfferV2` return multiple sellers?

Kita mengasumsikan: paste Shopee URL → API → balikin harga dari toko A, B, C yang jual produk SAMA.

**Kenyataan**: Kita gak tau. Mungkin API cuma return 1 result (produk original yang di-paste doang). Kalau cuma 1, **V1 gak berguna** — user liat harga yang sama kayak yang mereka udah tau.

**Solusi**: Test call setelah daftar Shopee Affiliate. Sebelum itu, jangan coding.

### A.2 Shopee Affiliate approval chance?

Ada kemungkinan ditolak. Kalau ditolak, opsi tinggal:
- Scraping (Playwright + proxy rotator) — $ cost naik, gak bisa $0 hosting
- Pake API tidak resmi (risk takedown)
- Ganti model bisnis

**Diskusi**: Seberapa yakin kita bisa approval? Ada plan B konkret?

### A.3 Involve Asia API — apakah kita butuh?

Involve Asia = affiliate link generator. Optional. Fungsinya cuma nge-wrap Shopee product link jadi deeplink (mungkin komisi lebih tinggi). Gak dipake buat dapetin data harga.

**Pertanyaan**: Butuh involve Asia di V1, atau Shopee Affiliate API langsung doang cukup?

---

## B. Critical Issues — Bikin Implementasi Salah

### B.1 Error response format outdated (TSD §8)

Error format response di TSD masih mention field `platform` yang udah dihapus dari API Contract.

```
// OLD (masih di TSD)
"offers": [{ "platform", "price", "currency", ... }]

// NEW (sudah di API Contract)
"offers": [{ "storeName", "price", ... }]
```

**Fix**: Sinkronin TSD sama API Contract.

### B.2 Cron "top 100 products" gak muat 60s

Vercel Hobby cron max 60s. 100 produk × 1 API call (~2s) = 200s. Gak muat.

**Fix**: Turunin jadi 15-20 produk per run. Atau staggered scheduling (20 produk per jam).

### B.3 Table `cached_searches` redundant

Ada table `cached_searches` di Data Model yang fungsinya sama persis dengan Vercel KV cache. Double storage, double maintenance.

**Fix**: Hapus table, pake KV aja.

---

## C. Medium Issues — Harus Dibenerin Sebelum Coding

### C.1 Gak ada acquisition strategy

OKR bilang "1k users month 1" tapi gak ada penjelasan dari mana datangnya. Organic? Sosial? Forum? Paid?

**Pertanyaan**: Siapa yang tanggung jawab ngasih user pertama? Ada komunitas / channel distribusi?

### C.2 Privacy & legal page

Affiliate marketing di Indonesia wajib disclosure. Juga butuh:
- Privacy policy (data apa yang dikumpulin)
- Cookie policy
- Affiliate disclosure (kami dapet komisi)
- Terms of service

Bisa pake template generik, tapi harus ada.

### C.3 Gak ada performance budget

Mobile-first tanpa target performa:
- LCP (Largest Contentful Paint) target?
- FID (First Input Delay)?
- CLS (Cumulative Layout Shift)?
- API response time p95 <3s udah ada, tapi frontend performance belum.

### C.4 SEO basics belum ada

Satu-satunya channel murah buat dapetin user adalah **Google**. Butuh:
- Meta tags per halaman
- Sitemap.xml
- Robots.txt
- Canonical URL
- Structured data (product schema kalau V2)

### C.5 Testing masih abstrak

TSD mention "Vitest + MSW" tapi gak ada:
- Test file structure (dimana taroh test?)
- Contoh test (gimana mock API?)
- Coverage target
- Test data / fixtures

### C.6 Gak ada cara liat analytics data

Events udah defined di FSD, tapi gak ada yang mention:
- Dashboard dimana?
- Siapa yang monitor?
- Alert kalo error rate tinggi?

Vercel Analytics kasih dashboard basic, tapi perlu dikonfigurasi.

### C.7 Health check cek Involve Asia padahal optional

`GET /api/health` ngecek reachability Involve Asia API. Tapi Involve Asia optional di V1. Kalo gak dipake, sebaiknya gak usah di-check biar gak false alarm.

---

## D. Minor Issues — Bisa Nanti

### D.1 Cuma 3 dari 11 fitur V1 punya acceptance criteria

Fitur yang punya: F-01 (Paste Input), F-05 (Compare Result), F-07 (Error Handling).

Fitur yang gak punya: F-02 URL Parser, F-03 Shopee Price Check, F-06 Affiliate Redirect, F-08 Loading State, F-09 Empty State, F-10 Mobile Responsive, F-11 Analytics.

### D.2 Gak ada priority matrix

Impact vs effort chart berguna buat nentuin mana yang dikerjain duluan.

### D.3 Gak ada 404 page

User salah URL → bakal liat error mentah Next.js.

### D.4 `CRON_SECRET` env var gak ada di env list

Cron job di API Contract pake auth `Bearer {CRON_SECRET}` tapi secret-nya gak ada di list environment variables TSD.

### D.5 Gak ada request ID / correlation ID

Kalo API error, susah nge-track request mana yang fail tanpa ID.

### D.6 Gak ada launch checklist

Pre-launch verification:
- Domain pointing bener?
- SSL valid?
- Affiliate links tested?
- Analytics tracking?

---

## E. Bonus Features — Proposed Additions

### E.1 How It Works section

3-step ilustrasi di landing page:
```
📋 Paste link → 🔍 Cari harga → 🛒 Beli termurah
```

Meningkatkan konversi first-time user yang gak ngerti cara pake.

### E.2 Example links

3-4 link contoh di bawah input biar user langsung nyoba tanpa perlu buka Shopee dulu.

### E.3 Input persist di result page

Biar user gak perlu back-and-forth kalo mau cek link lain.

### E.4 Recent searches (localStorage)

Simpen 5 recent links biar user bisa balik ke produk yang pernah dicek.

### E.5 OG tags + Twitter cards

Buat share result jadi preview bagus di WhatsApp / Telegram.

---

## Prioritas Diskusi

| Urutan | Topik | Keputusan yang Dibutuhkan |
|---|---|---|
| 1 | **A.1 — productOfferV2 behavior** | Test call dulu atau coding dulu? |
| 2 | **A.2 — Approval chance** | Plan B kalau ditolak? |
| 3 | **C.1 — Acquisition strategy** | User pertama dari mana? |
| 4 | **B.1 + B.2 + B.3 — Critical fixes** | Setuju diperbaiki? |
| 5 | **C.2 — Privacy/legal** | Pake template atau bikin sendiri? |
| 6 | **E.1 + E.2 — How it works + examples** | Mau include di V1 atau V2? |
