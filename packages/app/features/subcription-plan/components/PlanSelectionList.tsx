import { Card, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { useTranslations } from 'next-intl'
import { useTheme } from 'tamagui'

export type SubscriptionPlanOption = {
  id: string
  lessonsPerWeek: number
  monthlyPrice: number
  perLessonPrice: number
  isPopular?: boolean
}

type PlanSelectionListProps = {
  plans: SubscriptionPlanOption[]
  selectedPlanId: string
  onSelectPlan: (id: string) => void
}

export function PlanSelectionList({ plans, selectedPlanId, onSelectPlan }: PlanSelectionListProps) {
  const t = useTranslations('SubscriptionPlan.PlanSelectionList')
  const theme = useTheme()
  const activeBg = theme.checkoutSelectedBg?.get() ?? '#102953'
  const inactiveBg = theme.checkoutSurface?.get() ?? '#0B1A38'
  const activeBorder = theme.appPrimary?.get() ?? '#2F86FF'
  const inactiveBorder = theme.checkoutCardBorder?.get() ?? '#1D335F'
  const headingColor = theme.checkoutHeadingText?.get() ?? '#F3F7FF'
  const mutedColor = theme.checkoutMutedText?.get() ?? '#8EA3CD'
  const onPrimaryColor = theme.checkoutOnPrimaryText?.get() ?? '#FFFFFF'
  const radioBorder = theme.checkoutRadioBorder?.get() ?? '#41598B'
  const accentSoftColor = theme.appPrimaryLight?.get() ?? '#5EA0FF'

  return (
    <YStack gap="$2.5">
      {plans.map((plan) => {
        const active = plan.id === selectedPlanId
        return (
          <Card
            key={plan.id}
            borderRadius={16}
            padding="$3"
            gap="$1"
            backgroundColor={active ? activeBg : inactiveBg}
            borderColor={active ? activeBorder : inactiveBorder}
            borderWidth={1}
            cursor="pointer"
            onPress={() => onSelectPlan(plan.id)}
          >
            <XStack alignItems="center" justifyContent="space-between">
              <Text color={headingColor} fontSize={26} lineHeight={36} fontWeight="700">
                {t('lessonsPerWeek', { count: plan.lessonsPerWeek })}
              </Text>
              <YStack alignItems="flex-end" gap="$1">
                {plan.isPopular ? (
                  <XStack
                    backgroundColor={activeBorder}
                    borderRadius={999}
                    paddingHorizontal="$2"
                    paddingVertical={3}
                  >
                    <Text color={onPrimaryColor} fontSize={10} fontWeight="800" letterSpacing={0.8}>
                      {t('popular')}
                    </Text>
                  </XStack>
                ) : null}
                <XStack
                  width={20}
                  height={20}
                  borderRadius={999}
                  borderWidth={1}
                  borderColor={active ? activeBorder : radioBorder}
                  alignItems="center"
                  justifyContent="center"
                >
                  {active ? <XStack width={10} height={10} borderRadius={999} backgroundColor={activeBorder} /> : null}
                </XStack>
              </YStack>
            </XStack>
            <Text color={active ? accentSoftColor : mutedColor} fontSize={14}>
              {t('priceLine', {
                monthlyPrice: plan.monthlyPrice.toFixed(2),
                perLessonPrice: plan.perLessonPrice.toFixed(2),
              })}
            </Text>
          </Card>
        )
      })}
    </YStack>
  )
}
