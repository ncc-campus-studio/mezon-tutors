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
  const priceColor = color || '$appPrimary'

  if (inline) {
    return (
      <Text size={size} fontWeight="700" color={priceColor}>
        {formatCurrency(convertedAmount, displayCurrency)}
      </Text>
    )
  }

  const isSameCurrency = currency.toUpperCase() === preferredCurrency.toUpperCase()

  return (
    <YStack gap={4}>
      <XStack alignItems="baseline" gap={4}>
        <Text size={size} fontWeight="700" color={priceColor}>
          {formatCurrency(convertedAmount, displayCurrency)}
        </Text>
        <Text fontSize={14} color="$colorMuted">
          {displayCurrency.toUpperCase()}
        </Text>
      </XStack>

      {showOriginal && !isSameCurrency && !hasError && (
        <Text fontSize={12} color="$colorMuted">
          ≈ {formatCurrency(amount, currency)} {currency.toUpperCase()}
        </Text>
      )}

      {hasError && (
        <Text fontSize={12} color="$red10">
          {t('conversionError')}
        </Text>
      )}
    </YStack>
  )
}
