import { Button, Card, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { ArrowRightIcon, WalletIcon } from '@mezon-tutors/app/ui/icons'
import { formatCurrency } from '@mezon-tutors/shared'
import { useTranslations } from 'next-intl'
import { useTheme } from 'tamagui'

export type PaymentMethodOption = {
  id: string
  title: string
  subtitle: string
}

type PaymentMethodPanelProps = {
  total: number
  paymentMethods: PaymentMethodOption[]
  selectedMethodId: string
  onSelectMethod: (methodId: string) => void
  onPay: () => void | Promise<void>
  onContinuePayment?: () => void
  showContinuePayment?: boolean
  continuePaymentDisabled?: boolean
  payDisabled?: boolean
  isPayLoading?: boolean
}

export function PaymentMethodPanel({
  total,
  paymentMethods,
  selectedMethodId,
  onSelectMethod,
  onPay,
  onContinuePayment,
  showContinuePayment = false,
  continuePaymentDisabled = false,
  payDisabled = false,
  isPayLoading = false,
}: PaymentMethodPanelProps) {
  const t = useTranslations('TrialLessonCheckout.PaymentMethodPanel')
  const theme = useTheme()
  const cardBg = theme.checkoutSurface?.get() ?? '#0E1B35'
  const cardBorder = theme.checkoutCardBorder?.get() ?? '#22345F'
  const headingColor = theme.checkoutHeadingText?.get() ?? '#F5F8FF'
  const bodyColor = theme.checkoutBodyText?.get() ?? '#EAF0FF'
  const mutedColor = theme.checkoutMetaText?.get() ?? '#7F90B6'
  const accentColor = theme.appPrimary?.get() ?? '#2F86FF'
  const selectedBg = theme.checkoutSelectedBg?.get() ?? '#102953'
  const controlBg = theme.checkoutControlBg?.get() ?? '#0A152D'
  const controlBorder = theme.checkoutControlBorder?.get() ?? '#2A3E6F'
  const iconMuted = theme.checkoutIconMuted?.get() ?? '#A7B4D1'
  const radioBorder = theme.checkoutRadioBorder?.get() ?? '#4A5D88'
  const onPrimary = theme.checkoutOnPrimaryText?.get() ?? '#FFFFFF'
  const hasContinuePayment = showContinuePayment && Boolean(onContinuePayment)
  const primaryButtonDisabled = hasContinuePayment
    ? continuePaymentDisabled
    : payDisabled || isPayLoading
  const handlePrimaryPress = hasContinuePayment
    ? onContinuePayment
    : () => {
        void onPay()
      }

  return (
    <Card
      backgroundColor={cardBg}
      borderColor={cardBorder}
      borderRadius={20}
      padding="$4"
      gap="$3"
      minWidth={320}
    >
      <Text color={headingColor} fontSize={32} lineHeight={36} fontWeight="800">
        {t('title')}
      </Text>

      <YStack gap="$2.5">
        {paymentMethods.map((method) => {
          const active = selectedMethodId === method.id
          return (
            <XStack
              key={method.id}
              borderWidth={1}
              borderColor={active ? accentColor : controlBorder}
              borderRadius={14}
              backgroundColor={active ? selectedBg : controlBg}
              minHeight={56}
              paddingHorizontal="$3"
              alignItems="center"
              gap="$2.5"
              justifyContent="space-between"
              onPress={() => onSelectMethod(method.id)}
            >
              <XStack alignItems="center" gap="$2.5" flex={1}>
                <WalletIcon size={18} color={active ? accentColor : iconMuted} />
                <YStack flex={1}>
                  <Text color={bodyColor} fontWeight="700">
                    {method.title}
                  </Text>
                  <Text color={mutedColor} size="sm">
                    {method.subtitle}
                  </Text>
                </YStack>
              </XStack>
              <XStack
                width={18}
                height={18}
                borderRadius={999}
                borderWidth={1}
                borderColor={active ? accentColor : radioBorder}
                alignItems="center"
                justifyContent="center"
              >
                {active ? (
                  <XStack width={8} height={8} borderRadius={999} backgroundColor={accentColor} />
                ) : null}
              </XStack>
            </XStack>
          )
        })}
      </YStack>

      <Button
        variant="primary"
        height={48}
        borderRadius={14}
        gap="$2"
        justifyContent="center"
        disabled={primaryButtonDisabled}
        onPress={handlePrimaryPress}
      >
        {hasContinuePayment
          ? 'Continue payment'
          : isPayLoading
            ? t('processing')
            : total > 0
              ? t('bookAndPay', { amount: formatCurrency(total, 'VND') })
              : t('bookLesson')}
        {!isPayLoading ? <ArrowRightIcon size={16} color={onPrimary} /> : null}
      </Button>

      <Text color={mutedColor} fontSize={12} textAlign="center">
        {t('securityNotice')}
      </Text>
    </Card>
  )
}
