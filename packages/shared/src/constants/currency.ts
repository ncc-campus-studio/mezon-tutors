import { ECurrency } from '../enums/currency'

export type Currency = ECurrency

export const DEFAULT_CURRENCY = ECurrency.USD

export const LOCALE_TO_CURRENCY: Record<string, ECurrency> = {
  vi: ECurrency.VND,
  en: ECurrency.USD,
  fil: ECurrency.PHP,
}

export const CURRENCY_TO_LOCALE: Record<Currency, string> = {
  [ECurrency.USD]: 'en-US',
  [ECurrency.VND]: 'vi-VN',
  [ECurrency.PHP]: 'fil-PH',
}

export const CURRENCY_DECIMALS: Record<Currency, number> = {
  [ECurrency.USD]: 2,
  [ECurrency.VND]: 0,
  [ECurrency.PHP]: 2,
}

export const CURRENCY_NAMES: Record<Currency, string> = {
  [ECurrency.USD]: 'US Dollar',
  [ECurrency.VND]: 'Vietnamese Dong',
  [ECurrency.PHP]: 'Philippine Peso',
}

export const PRICE_FILTER_RANGE = {
  min: 3,
  max: 40,
  currency: ECurrency.USD,
} as const
