'use client'

import { useState, useEffect } from 'react'
import { XStack, YStack, Text } from '@mezon-tutors/app/ui'
import { formatCurrency } from '@mezon-tutors/shared'
import { useCurrency } from '@mezon-tutors/app/hooks/useCurrency'
import { useTranslations } from 'next-intl'

type Size = 'sm' | 'md' | 'lg' | 'xl'

type PriceDisplayProps = {
  amount: number
  currency: string
  showOriginal?: boolean
  size?: Size
  color?: string
  inline?: boolean
}


const fontSizeMap: Record<Size, { price: number; currency: number; original: number }> = {
  sm: { price: 16, currency: 12, original: 10 },
  md: { price: 20, currency: 13, original: 11 },
  lg: { price: 24, currency: 14, original: 12 },
  xl: { price: 32, currency: 14, original: 12 },
}

export function PriceDisplay({
  amount,
  currency,
  showOriginal = true,
  size = 'lg',
  color,
  inline = false,
}: PriceDisplayProps) {
  const t = useTranslations('Common.Currency')
  const { currency: preferredCurrency, convert } = useCurrency()
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!preferredCurrency) return

    let cancelled = false
    setConvertedAmount(null)
    setHasError(false)
    setIsLoading(true)

    convert(amount, currency, preferredCurrency)
      .then((result) => {
        if (!cancelled) setConvertedAmount(result.convertedAmount)
      })
      .catch((err) => {
        console.error('[PriceDisplay] Conversion error:', err)
        if (!cancelled) {
          setHasError(true)
          setConvertedAmount(amount)
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [amount, currency, preferredCurrency, convert])

  if (isLoading || convertedAmount === null) {
    return <Text>Loading...</Text>
  }

  const displayCurrency = hasError ? currency : preferredCurrency
  const fontSize = fontSizeMap[size]
  const priceColor = color || '$appPrimary'

  if (inline) {
    return (
      <Text fontSize={fontSize.price} fontWeight="700" color={priceColor}>
        {formatCurrency(convertedAmount, displayCurrency)}
      </Text>
    )
  }

  const isSameCurrency = currency.toUpperCase() === preferredCurrency.toUpperCase()

  return (
    <YStack gap={4}>
      <XStack alignItems="baseline" gap={4}>
        <Text fontSize={fontSize.price} fontWeight="700" color={priceColor}>
          {formatCurrency(convertedAmount, displayCurrency)}
        </Text>
        <Text fontSize={fontSize.currency} color="$colorMuted">
          {displayCurrency.toUpperCase()}
        </Text>
      </XStack>

      {showOriginal && !isSameCurrency && !hasError && (
        <Text fontSize={fontSize.original} color="$colorMuted">
          ≈ {formatCurrency(amount, currency)} {currency.toUpperCase()}
        </Text>
      )}

      {hasError && (
        <Text fontSize={fontSize.original} color="$red10">
          {t('conversionError')}
        </Text>
      )}
    </YStack>
  )
}
