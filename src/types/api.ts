import type { Product } from "./product"
import type { Offer } from "./offer"

export interface CompareRequest {
  url: string
}

export interface CompareResponse {
  product: Product
  offers: Offer[]
  lazadaUrl: string | null
}

export interface ApiError {
  error: {
    code: ErrorCode
    message: string
  }
}

export type ErrorCode =
  | "INVALID_URL"
  | "PARSE_FAILED"
  | "PRODUCT_NOT_FOUND"
  | "RATE_LIMITED"
  | "API_ERROR"
  | "TIMEOUT"
  | "INTERNAL_ERROR"

export interface HealthResponse {
  status: "ok" | "degraded" | "error"
  timestamp: string
  version: string
}
