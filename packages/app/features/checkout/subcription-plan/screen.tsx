'use client'

import { Screen, ScrollView, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { useMemo, useState } from 'react'
import { useMedia, useTheme } from 'tamagui'
import { LearningPlanCard } from './components/LearningPlanCard'
import { OrderSummaryCard } from './components/OrderSummaryCard'
import { PaymentMethodCard } from './components/PaymentMethodCard'
import { TrustCards } from './components/TrustCards'
import { useTranslations } from 'next-intl'

export function SubscriptionPlanCheckoutScreen() {
  const t = useTranslations('SubscriptionCheckout.Screen')
  const media = useMedia()
  const theme = useTheme()
  const isCompact = media.md || media.sm || media.xs
  const pageBg = theme.checkoutBg?.get() ?? '#071327'
  const headingColor = theme.checkoutHeadingText?.get() ?? '#F3F7FF'
  const mutedColor = theme.checkoutMutedText?.get() ?? '#9AAFD8'

  const paymentMethods = [
    {
      id: 'payos',
      title: t('paymentMethods.payos.title'),
      subtitle: t('paymentMethods.payos.subtitle'),
    },
  ]

  const [selectedMethodId, setSelectedMethodId] = useState<string>('payos')

  return (
    <Screen backgroundColor={pageBg}>
      <ScrollView flex={1} contentContainerStyle={{ paddingBottom: 32 }}>
        <YStack
          width="100%"
          maxWidth={1240}
          marginHorizontal="auto"
          padding={isCompact ? '$3' : '$5'}
          gap="$4"
        >
          <YStack gap="$1.5">
            <Text color={headingColor} fontSize={52} lineHeight={54} fontWeight="800">
              {t('headline')}
            </Text>
            <Text color={mutedColor} size="lg">
              {t('subtitle')}
            </Text>
          </YStack>

          <XStack gap="$4" flexDirection={isCompact ? 'column' : 'row'} alignItems="flex-start">
            <YStack flex={1.35} gap="$3">
              <PaymentMethodCard
                isCompact={isCompact}
                paymentMethods={paymentMethods}
                selectedMethodId={selectedMethodId}
                onSelectMethod={setSelectedMethodId}
              />
              <TrustCards />
            </YStack>
            <YStack
              flex={1}
              gap="$3"
              width={isCompact ? '100%' : 'auto'}
              maxWidth={isCompact ? '100%' : 440}
            >
              <LearningPlanCard />
              <OrderSummaryCard />
            </YStack>
          </XStack>
        </YStack>
      </ScrollView>
    </Screen>
  )
}
