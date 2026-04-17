import { Button, Card, Input, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { formatToVND } from '@mezon-tutors/shared'
import { useTranslations } from 'next-intl'
import { useTheme } from 'tamagui'

type PaymentSummaryCardProps = {
  durationMinutes: number
  total: number
}

export function PaymentSummaryCard({ durationMinutes, total }: PaymentSummaryCardProps) {
  const t = useTranslations('TrialLessonCheckout.PaymentSummaryCard')
  const theme = useTheme()
  const cardBg = theme.checkoutSurface?.get() ?? '#0E1B35'
  const cardBorder = theme.checkoutCardBorder?.get() ?? '#22345F'
  const headingColor = theme.checkoutHeadingText?.get() ?? '#F5F8FF'
  const bodyColor = theme.checkoutBodyText?.get() ?? '#DFE7FF'
  const mutedColor = theme.checkoutMutedText?.get() ?? '#A7B4D1'
  const accentColor = theme.appPrimary?.get() ?? '#2F86FF'
  const controlBg = theme.checkoutControlBg?.get() ?? '#0A152D'
  const controlBorder = theme.checkoutControlBorder?.get() ?? '#2A3E6F'
  const placeholderColor = theme.checkoutPlaceholderText?.get() ?? '#7081A7'

  return (
    <Card backgroundColor={cardBg} borderColor={cardBorder} borderRadius={20} padding="$3.5" gap="$3">
      <Text color={headingColor} size="xl" fontWeight="700">
        {t('title')}
      </Text>

      <YStack gap="$2">
        <XStack justifyContent="space-between" alignItems="center">
          <Text color={mutedColor}>{t('trialLesson', { durationMinutes })}</Text>
          <Text color={bodyColor} fontWeight="700">
            {formatToVND(total)}
          </Text>
        </XStack>
      </YStack>

      <XStack
        borderTopWidth={1}
        borderTopColor={cardBorder}
        paddingTop="$2"
        justifyContent="space-between"
      >
        <Text color={headingColor} size="xl" fontWeight="700">
          {t('total')}
        </Text>
        <Text color={accentColor} size="xl" fontWeight="800">
          {formatToVND(total)}
        </Text>
      </XStack>

      <YStack gap="$2">
        <Text color={mutedColor} fontSize={12} textTransform="uppercase" letterSpacing={0.6}>
          {t('promoCode')}
        </Text>
        <XStack gap="$2">
          <Input
            flex={1}
            height={42}
            borderRadius={12}
            backgroundColor={controlBg}
            borderColor={cardBorder}
            color={bodyColor}
            placeholder={t('promoPlaceholder')}
            placeholderTextColor={placeholderColor}
          />
          <Button
            height={42}
            paddingHorizontal="$4"
            borderRadius={12}
            backgroundColor={controlBg}
            borderColor={controlBorder}
            color={bodyColor}
          >
            {t('apply')}
          </Button>
        </XStack>
      </YStack>
    </Card>
  )
}
