export interface CurrencyAPIResponse {
  date: string
  [baseCurrency: string]: string | Record<string, number>
}

export interface ConversionParams {
  amount: number
  fromCurrency: string
  toCurrency: string
}

export interface ConversionResult {
  amount: number
  fromCurrency: string
  toCurrency: string
  rate: number
  convertedAmount: number
}
