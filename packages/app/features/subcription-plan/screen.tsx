'use client'

import { ROUTES } from '@mezon-tutors/shared'
import { Screen, ScrollView, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { useMemo, useState } from 'react'
import { useRouter } from 'solito/navigation'
import { useMedia, useTheme } from 'tamagui'
import { PlanSelectionList } from './components/PlanSelectionList'
import { PlanSummaryCard } from './components/PlanSummaryCard'
import type { SubscriptionPlanOption } from './components/PlanSelectionList'
import { useTranslations } from 'next-intl'

const SUBSCRIPTION_PLANS: SubscriptionPlanOption[] = [
  { id: 'plan-1', lessonsPerWeek: 1, monthlyPrice: 40, perLessonPrice: 10 },
  { id: 'plan-2', lessonsPerWeek: 2, monthlyPrice: 76, perLessonPrice: 9.5 },
  { id: 'plan-3', lessonsPerWeek: 3, monthlyPrice: 108, perLessonPrice: 9, isPopular: true },
  { id: 'plan-4', lessonsPerWeek: 4, monthlyPrice: 140, perLessonPrice: 8.75 },
  { id: 'plan-5', lessonsPerWeek: 5, monthlyPrice: 170, perLessonPrice: 8.5 },
]

export function SubscriptionPlanScreen() {
  const t = useTranslations('SubscriptionPlan.Screen')
  const media = useMedia()
  const theme = useTheme()
  const isCompact = media.md || media.sm || media.xs
  const router = useRouter()
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-3')
  const pageBg = theme.checkoutBg?.get() ?? '#071327'
  const headingColor = theme.checkoutHeadingText?.get() ?? '#F3F7FF'
  const mutedColor = theme.checkoutMutedText?.get() ?? '#9AAFD8'
  const accentColor = theme.appPrimary?.get() ?? '#1A56D9'
  const onPrimaryColor = theme.checkoutOnPrimaryText?.get() ?? '#FFFFFF'

  const selectedPlan = useMemo(
    () => SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) ?? SUBSCRIPTION_PLANS[2],
    [selectedPlanId]
  )

  const handleContinue = () => {
    const params = new URLSearchParams()
    params.set('planId', selectedPlan.id)
    params.set('lessonsPerWeek', String(selectedPlan.lessonsPerWeek))
    params.set('monthlyPrice', String(selectedPlan.monthlyPrice))
    router.push(`${ROUTES.CHECKOUT.SUBCRIPTION_PLAN}?${params.toString()}`)
  }

  return (
    <Screen backgroundColor={pageBg}>
      <ScrollView flex={1} contentContainerStyle={{ paddingBottom: 28 }}>
        <YStack
          width="100%"
          maxWidth={1240}
          marginHorizontal="auto"
          padding={isCompact ? '$3' : '$5'}
          gap="$4"
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap="$2">
              <XStack
                width={28}
                height={28}
                borderRadius={999}
                backgroundColor={accentColor}
                alignItems="center"
                justifyContent="center"
              >
                <Text color={onPrimaryColor} fontSize={14} fontWeight="800">
                  S
                </Text>
              </XStack>
              <Text color={headingColor} fontWeight="700">
                {t('brand')}
              </Text>
            </XStack>
          </XStack>

          <XStack gap="$4" flexDirection={isCompact ? 'column' : 'row'} alignItems="flex-start">
            <YStack flex={1.35} gap="$3">
              <YStack gap="$1.5">
                <Text color={headingColor} fontSize={54} lineHeight={66} fontWeight="800">
                  {t('headline')}
                </Text>
                <Text color={mutedColor} size="lg">
                  {t('subtitle')}
                </Text>
              </YStack>

              <Text color={headingColor} fontSize={32} lineHeight={38} fontWeight="700">
                {t('selectPlan')}
              </Text>
              <PlanSelectionList
                plans={SUBSCRIPTION_PLANS}
                selectedPlanId={selectedPlanId}
                onSelectPlan={setSelectedPlanId}
              />
            </YStack>

            <YStack
              flex={1}
              width={isCompact ? '100%' : 'auto'}
              maxWidth={isCompact ? '100%' : 450}
            >
              <PlanSummaryCard selectedPlan={selectedPlan} onContinue={handleContinue} />
            </YStack>
          </XStack>
        </YStack>
      </ScrollView>
    </Screen>
  )
}
