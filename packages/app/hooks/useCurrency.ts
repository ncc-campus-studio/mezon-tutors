'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { currencyService } from '../services/currency.service'
import { DEFAULT_CURRENCY, LOCALE_TO_CURRENCY } from '@mezon-tutors/shared'
import type { ConversionResult } from '@mezon-tutors/shared'

const STORAGE_KEY = 'currency'

function readStoredCurrency(): string {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_CURRENCY
}

export function useCurrency() {
  const locale = useLocale()
  const [currency, setCurrency] = useState<string>(readStoredCurrency)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      const localeDefault = LOCALE_TO_CURRENCY[locale as keyof typeof LOCALE_TO_CURRENCY] ?? DEFAULT_CURRENCY
      localStorage.setItem(STORAGE_KEY, localeDefault)
      setCurrency(localeDefault)
    }
  }, [locale])

  const switchCurrency = useCallback((next: string) => {
    setCurrency(next)
    localStorage.setItem(STORAGE_KEY, next)
    window.dispatchEvent(new CustomEvent('currency-change', { detail: next }))
  }, [])

  const convert = useCallback(
    async (amount: number, fromCurrency: string, toCurrency?: string): Promise<ConversionResult> => {
      const to = toCurrency ?? currency
      if (fromCurrency.toUpperCase() === to.toUpperCase()) {
        return { amount, fromCurrency, toCurrency: to, rate: 1, convertedAmount: amount }
      }
      return currencyService.convert({ amount, fromCurrency, toCurrency: to })
    },
    [currency]
  )

  return { currency, switchCurrency, convert }
}
