import type { CurrencyAPIResponse, ConversionParams, ConversionResult } from '@mezon-tutors/shared'

const PRIMARY_BASE_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies'
const FALLBACK_BASE_URL = 'https://latest.currency-api.pages.dev/v1/currencies'
const CACHE_DURATION_MS = 3_600_000 

type RatesCacheEntry = { rates: Record<string, number>; timestamp: number }

class CurrencyService {
  private readonly cache = new Map<string, RatesCacheEntry>()

  async convert({ amount, fromCurrency, toCurrency }: ConversionParams): Promise<ConversionResult> {
    const from = fromCurrency.toLowerCase()
    const to = toCurrency.toLowerCase()

    if (from === to) {
      return { amount, fromCurrency, toCurrency, rate: 1, convertedAmount: amount }
    }

    const rates = await this.fetchRates(from)
    const rate = rates[to]

    if (!rate) throw new Error(`No exchange rate found for ${fromCurrency} → ${toCurrency}`)

    return { amount, fromCurrency, toCurrency, rate, convertedAmount: amount * rate }
  }

  private async fetchRates(baseCurrency: string): Promise<Record<string, number>> {
    const cached = this.cache.get(baseCurrency)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
      return cached.rates
    }

    const rates = await this.fetchWithFallback(baseCurrency)
    this.cache.set(baseCurrency, { rates, timestamp: Date.now() })
    return rates
  }

  private async fetchWithFallback(baseCurrency: string): Promise<Record<string, number>> {
    const urls = [
      `${PRIMARY_BASE_URL}/${baseCurrency}.json`,
      `${FALLBACK_BASE_URL}/${baseCurrency}.json`,
    ]

    let lastError: unknown
    for (const url of urls) {
      try {
        return await this.fetchFromUrl(url, baseCurrency)
      } catch (err) {
        lastError = err
      }
    }

    console.error('All currency API endpoints failed:', lastError)
    throw new Error(`Failed to fetch exchange rates for ${baseCurrency}`)
  }

  private async fetchFromUrl(url: string, baseCurrency: string): Promise<Record<string, number>> {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)

    const data: CurrencyAPIResponse = await res.json()
    const rates = data[baseCurrency] as Record<string, number>

    if (!rates || typeof rates !== 'object') {
      throw new Error(`Invalid response format for ${baseCurrency}`)
    }

    return rates
  }
}

export const currencyService = new CurrencyService()
