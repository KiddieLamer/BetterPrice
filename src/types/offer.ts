export interface Offer {
  platform: "shopee" | "lazada" | "tokopedia"
  storeName: string
  price: number
  originalPrice: number | null
  currency: string
  url: string
  rating: number | null
  historicalSold: number | null
  location: string | null
  isLowest: boolean
}
