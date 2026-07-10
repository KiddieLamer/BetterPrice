# BRD — Business Requirements Document
## BetterPrice — Price Comparison Platform for Indonesia

**Version:** 1.0  
**Date:** 2026-07-07  
**Status:** Draft  

---

## 1. Executive Summary

BetterPrice is a price comparison platform targeting Indonesian online shoppers. Users paste a Shopee product link and instantly see the cheapest price across different Shopee sellers. Revenue comes from affiliate commissions when users click through to purchase. MVP focuses on API-only (no scraping) to achieve $0 hosting cost on Vercel Hobby tier.

---

## 2. Problem Statement

| Problem | Impact |
|---|---|---|
| Indonesian shoppers find same product at different prices across Shopee sellers without knowing which is cheapest | Overpaying 10-40% per item |
| Manual comparison across Shopee store tabs is tedious (open 5+ tabs) | Abandoned purchases, decision fatigue |
| Existing aggregators (iPrice, BigGo) focus on cross-platform search, not "paste link → compare sellers" | No fast path for already-found products |
| No platform serves the "I found this item, who sells it cheapest?" workflow | Gap in user mental model |

---

## 3. Target Market

### Market Size

| Metric | Value | Source |
|---|---|---|
| Indonesia e-commerce GMV 2025 | ~$82B | Google, Temasek, Bain e-Conomy |
| Shopee Indonesia market share | ~40% | Similarweb |
| Lazada Indonesia market share | ~15% | Similarweb |
| Monthly active e-commerce users | ~180M | We Are Social |
| Average order value (fashion/electronics) | IDR 50k-500k | Internal estimates |

### User Segmentation

| Segment | Behavior | Willingness to Compare |
|---|---|---|
| **Harga Hunter** | Actively seeks discounts, uses multiple platforms | High |
| **Impulse Buyer** | Sees product, wants best price NOW | Medium |
| **Reseller/Dropshipper** | Bulk purchases, margin-sensitive | Very High |
| **Budget Shopper** | Price-sensitive but time-poor | Medium |

---

## 4. Competitive Landscape

### Market Context

Shopee dominates Indonesian e-commerce (~40% GMV share). Tokopedia second (~20%). Lazada is distant third (~10%). V1 focuses on Shopee-to-Shopee price comparison (the most impactful single-platform use case). Cross-platform comparison is deferred to V2.

| Competitor | Strengths | Weaknesses | Our Advantage |
|---|---|---|---|
| **iPrice.co.id** | Established, multi-platform, SEO | Generic search, not link-to-compare | Paste link → instant result |
| **BigGo.id** | 500k+ downloads, cashback | Cluttered UI, slow | Clean mobile-first UX |
| **Nuvora.id** | Simple UI, Tokopedia included | No Lazada, less known | Shopee-first focus |
| **Manual Tab Switching** | Free, no trust barrier | Painful, 5+ steps | 1-click compare |
| **Google Shopping** | Trusted brand | Limited Indonesia coverage | Market-specific |

---

## 5. Revenue Model

### Primary: Affiliate Commissions

| Channel | Commission Rate | Est. RPM |
|---|---|---|
| Shopee Affiliate Program | 2-8% per sale + Commissions Xtra | IDR 5k-40k/conversion |
| Involve Asia (Shopee — optional) | 1-5% per sale | IDR 2k-25k/conversion |

### Projections (MVP → Year 1)

| Month | Users | Clicks | Conversions | Revenue (IDR) |
|---|---|---|---|---|
| 1-3 | 1k | 500 | 25 | 125k-250k |
| 4-6 | 10k | 5k | 250 | 1.25M-5M |
| 7-12 | 50k | 25k | 1,250 | 6.25M-25M |

*Assumptions: 50% click-through rate, 5% conversion from click, avg commission IDR 10k*

### Future Monetization

| Feature | Model | Timeline |
|---|---|---|
| Sponsored placements | CPC/CPS from sellers | V2 |
| Price alert (WhatsApp/email) | Freemium | V2 |
| Reseller bulk check | Subscription | V3 |
| Browser extension | Organic acquisition | V3 |

---

## 6. Success Metrics (OKRs)

| Objective | Key Result | Target |
|---|---|---|
| **Acquisition** | Monthly unique visitors | 1k (M1), 10k (M3), 50k (M6) |
| **Activation** | Users who complete a comparison | >60% of visitors |
| **Revenue** | Monthly affiliate commission | >IDR 100k (breakeven at $0 hosting) |
| **Engagement** | Return rate (next 7 days) | >15% |
| **Satisfaction** | Users who would recommend | NPS >40 |

---

## 7. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| Shopee Affiliate API deprecated | Low | Critical | Build scraper backup (Playwright) |
| Shopee Affiliate approval rejected | Medium | Critical | Apply early (Step 0); pivot to scraping if rejected |
| Affiliate commission rate cut | Medium | Medium | Diversify to cross-platform (V2) |
| Low conversion rate | Medium | Medium | Optimize UX, test CTA placement |
| Competitor copies flow | High | Low | First-mover advantage, SEO moat |
| API rate limits | Medium | Medium | Vercel KV caching |
| Legal/compliance (affiliate disclosure) | Low | Medium | Clear disclosure on UI |

---

## 8. Timeline & Milestones

| Phase | Duration | Deliverables |
|---|---|---|
| **Foundation** | Week 1 | PRD, FSD, TSD, Data Model, API Contract |
| **Scaffold** | Week 2 | Next.js project, Vercel setup, URL parser |
| **API Integration** | Week 3-4 | Shopee Affiliate client, Involve Asia client |
| **MVP Launch** | Week 5 | Compare page, result page, deploy |
| **Iterate** | Week 6+ | Analytics, bug fixes, V2 planning |

---

## 9. Budget (MVP)

| Item | Cost | Notes |
|---|---|---|
| Vercel Hobby | $0/mo | Serverless functions + Postgres + KV |
| Domain (betterprice.id) | ~IDR 150k/yr | Niagahoster / idwebhost |
| Shopee Affiliate Account | Free | Registration + approval |
| Involve Asia Account | Free | Registration + campaign approval |
| **Total** | **~IDR 150k/yr** | Domain only |
