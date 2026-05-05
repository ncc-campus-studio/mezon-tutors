import { ECurrency} from '../enums/currency'
import { ELocale } from '../enums/locale'

export function formatToCurrency(locale: string, currency: string, amount: number): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatToVND(amount: number): string {
  return new Intl.NumberFormat(ELocale.VIETNAMESE, {
    style: 'currency',
    currency: ECurrency.VND,
  }).format(amount)
}
