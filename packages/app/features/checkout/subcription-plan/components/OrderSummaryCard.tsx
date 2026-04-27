import { Button, Card, Input, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { formatToVND } from '@mezon-tutors/shared'
import { useTranslations } from 'next-intl'
import { useTheme } from 'tamagui'

export function OrderSummaryCard() {
  const t = useTranslations('SubscriptionCheckout.OrderSummaryCard')
  const theme = useTheme()
  const cardBg = theme.checkoutSurface?.get() ?? '#0B1A38'
  const cardBorder = theme.checkoutCardBorder?.get() ?? '#1D335F'
  const headingColor = theme.checkoutHeadingText?.get() ?? '#F3F7FF'
  const bodyColor = theme.checkoutBodyText?.get() ?? '#E5EEFF'
  const mutedColor = theme.checkoutMutedText?.get() ?? '#A3B5D8'
  const accentColor = theme.appPrimary?.get() ?? '#2F86FF'
  const controlBg = theme.checkoutControlBg?.get() ?? '#0A152D'
  const controlBorder = theme.checkoutControlBorder?.get() ?? '#324667'
  const placeholderColor = theme.checkoutPlaceholderText?.get() ?? '#7081A7'

  return (
    <Card
      backgroundColor={cardBg}
      borderColor={cardBorder}
      borderRadius={20}
      padding="$3.5"
      gap="$3"
      style={{ boxShadow: '0 20px 42px rgba(3,10,26,0.38)' }}
    >
      <Text color={headingColor} size="xl" fontWeight="700">
        {t('title')}
      </Text>
      <YStack gap="$2">
        <XStack justifyContent="space-between">
          <Text color={mutedColor}>{t('selectedPlan')}</Text>
          <Text color={bodyColor} fontWeight="700">
            {formatToVND(142000)}
          </Text>
        </XStack>
        <XStack justifyContent="space-between">
          <Text color={mutedColor}>{t('processingFee')}</Text>
          <Text color={bodyColor} fontWeight="700">
            {formatToVND(2000)}
          </Text>
        </XStack>
      </YStack>

      <XStack
        borderTopWidth={1}
        borderTopColor={cardBorder}
        paddingTop="$2.5"
        justifyContent="space-between"
      >
        <YStack>
          <Text color={headingColor} size="xl" fontWeight="700">
            {t('totalMonthlyPrice')}
          </Text>
          <Text color={mutedColor} size="sm">
            {t('billedMonthly')}
          </Text>
        </YStack>
        <Text color={accentColor} fontSize={32} lineHeight={38} fontWeight="800">
          {formatToVND(144000)}
        </Text>
      </XStack>

      <XStack gap="$2">
        <Input
          flex={1}
          height={40}
          borderRadius={12}
          backgroundColor={controlBg}
          borderColor={cardBorder}
          color={bodyColor}
          placeholder={t('promoPlaceholder')}
          placeholderTextColor={placeholderColor}
        />
        <Button
          height={40}
          borderRadius={12}
          backgroundColor={controlBg}
          borderColor={controlBorder}
          color={bodyColor}
        >
          {t('apply')}
        </Button>
      </XStack>
    </Card>
  )
}
