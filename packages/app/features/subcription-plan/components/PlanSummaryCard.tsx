import { Button, Card, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import {
  ArrowRightIcon,
  CalendarIcon,
  ShieldCheckIcon,
  UsersIcon,
} from '@mezon-tutors/app/ui/icons'
import { SubscriptionPlanOption } from './PlanSelectionList'
import { useTranslations } from 'next-intl'
import { useTheme } from 'tamagui'
import { formatToVND } from '@mezon-tutors/shared'

type PlanSummaryCardProps = {
  selectedPlan: SubscriptionPlanOption
  onContinue: () => void
}

export function PlanSummaryCard({ selectedPlan, onContinue }: PlanSummaryCardProps) {
  const t = useTranslations('SubscriptionPlan.PlanSummaryCard')
  const theme = useTheme()
  const cardBg = theme.checkoutSurface?.get() ?? '#0B1A38'
  const cardBorder = theme.checkoutCardBorder?.get() ?? '#1D335F'
  const headingColor = theme.checkoutHeadingText?.get() ?? '#F3F7FF'
  const bodyColor = theme.checkoutBodyText?.get() ?? '#A3B5D8'
  const mutedColor = theme.checkoutMutedText?.get() ?? '#8EA3CD'
  const accentColor = theme.appPrimary?.get() ?? '#2F86FF'
  const sectionBg = theme.checkoutMediaBg?.get() ?? '#1B2B4E'
  const sectionBorder = theme.checkoutControlBorder?.get() ?? '#2B406F'
  const sectionSubText = bodyColor
  const dividerColor = theme.checkoutCardBorder?.get() ?? '#22345F'
  const onPrimaryColor = theme.checkoutOnPrimaryText?.get() ?? '#FFFFFF'

  return (
    <Card
      backgroundColor={cardBg}
      borderColor={cardBorder}
      borderRadius={20}
      padding="$3.5"
      gap="$3"
      style={{ boxShadow: '0 20px 42px rgba(3,10,26,0.38)' }}
    >
      <Text color={accentColor} fontSize={12} textTransform="uppercase" letterSpacing={1}>
        {t('summary')}
      </Text>
      <Text color={headingColor} fontSize={32} lineHeight={36} fontWeight="700">
        {t('title')}
      </Text>

      <YStack
        height={150}
        borderRadius={16}
        backgroundColor={sectionBg}
        borderWidth={1}
        borderColor={sectionBorder}
        justifyContent="flex-end"
        padding="$3"
      >
        <Text color={headingColor} fontSize={28} lineHeight={34} fontWeight="700">
          {t('planCard.title')}
        </Text>
        <Text color={sectionSubText}>{t('planCard.subtitle')}</Text>
      </YStack>

      <XStack justifyContent="space-between" alignItems="center">
        <Text color={bodyColor}>{t('frequency')}</Text>
        <Text color={headingColor} fontWeight="700">
          {t('lessonsPerWeek', { count: selectedPlan.lessonsPerWeek })}
        </Text>
      </XStack>

      <YStack gap="$2">
        <XStack alignItems="center" gap="$2">
          <CalendarIcon size={16} color={accentColor} />
          <Text color={bodyColor}>{t('benefits.schedule')}</Text>
        </XStack>
        <XStack alignItems="center" gap="$2">
          <UsersIcon size={16} color={accentColor} />
          <Text color={bodyColor}>{t('benefits.changeTutor')}</Text>
        </XStack>
        <XStack alignItems="center" gap="$2">
          <ShieldCheckIcon size={16} color={accentColor} />
          <Text color={bodyColor}>{t('benefits.cancelAnytime')}</Text>
        </XStack>
      </YStack>

      <XStack
        borderTopWidth={1}
        borderTopColor={dividerColor}
        paddingTop="$2.5"
        justifyContent="space-between"
        alignItems="baseline"
      >
        <Text color={headingColor} size="xl" fontWeight="700">
          {t('total')}
        </Text>
        <XStack alignItems="baseline" gap="$1">
          <Text color={headingColor} fontSize={36} lineHeight={46} fontWeight="800">
            {formatToVND(selectedPlan.monthlyPrice)}
          </Text>
          <Text color={mutedColor}>{t('perMonth')}</Text>
        </XStack>
      </XStack>

      <Button
        variant="primary"
        height={52}
        borderRadius={14}
        onPress={onContinue}
        gap="$2"
        justifyContent="center"
      >
        {t('continue')}
        <ArrowRightIcon size={16} color={onPrimaryColor} />
      </Button>

      <Text color={mutedColor} size="sm" textAlign="center">
        {t('securityNotice')}
      </Text>
    </Card>
  )
}
