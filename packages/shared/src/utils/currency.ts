import { CURRENCY_DECIMALS, CURRENCY_TO_LOCALE, type Currency } from '../constants/currency'

export function getCurrencyLocale(currency: string): string {
  const currencyCode = currency.toUpperCase() as Currency
  return CURRENCY_TO_LOCALE[currencyCode] ?? 'en-US'
}

export function formatCurrency(amount: number, currency: string): string {
  const currencyCode = currency.toUpperCase() as Currency
  const decimals = CURRENCY_DECIMALS[currencyCode] ?? 2
  const locale = getCurrencyLocale(currency)

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    style: 'currency',
    currency: currencyCode,
  }).format(amount)
}

export function getCurrencyDecimals(currency: string): number {
  return CURRENCY_DECIMALS[currency.toUpperCase() as Currency] ?? 2
}
