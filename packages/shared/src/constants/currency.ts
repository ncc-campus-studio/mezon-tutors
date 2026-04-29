import { ECurrency } from "../enums/currency";

export const CURRENCY_RATE_API_URLS = [
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies",
  "https://latest.currency-api.pages.dev/v1/currencies",
]

export const MIN_PRICE = {
  [ECurrency.VND]: 50000,
  [ECurrency.USD]: 3,
  [ECurrency.PHP]: 100,
}

export const MAX_PRICE = {
  [ECurrency.VND]: 1000000,
  [ECurrency.USD]: 45,
  [ECurrency.PHP]: 20000,
}

export const PRICE_STEP = {
  [ECurrency.VND]: 10000,
  [ECurrency.USD]: 1,
  [ECurrency.PHP]: 100,
}