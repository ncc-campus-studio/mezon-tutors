import { Button, Card, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { CheckIcon, WalletIcon } from '@mezon-tutors/app/ui/icons'
import { useTranslations } from 'next-intl'
import { useTheme } from 'tamagui'

export type SubscriptionPaymentMethodOption = {
  id: string
  title: string
  subtitle: string
}

type PaymentMethodCardProps = {
  isCompact: boolean
  paymentMethods: SubscriptionPaymentMethodOption[]
  selectedMethodId: string
  onSelectMethod: (methodId: string) => void
  onConfirm?: () => void
}

export function PaymentMethodCard({
  isCompact: _isCompact,
  paymentMethods,
  selectedMethodId,
  onSelectMethod,
  onConfirm,
}: PaymentMethodCardProps) {
  const t = useTranslations('SubscriptionCheckout.PaymentMethodCard')
  const theme = useTheme()
  const cardBg = theme.checkoutSurface?.get() ?? '#0B1A38'
  const cardBorder = theme.checkoutCardBorder?.get() ?? '#1D335F'
  const headingColor = theme.checkoutHeadingText?.get() ?? '#F3F7FF'
  const bodyColor = theme.checkoutBodyText?.get() ?? '#F3F7FF'
  const mutedColor = theme.checkoutMutedText?.get() ?? '#8DA3CC'
  const accentColor = theme.appPrimary?.get() ?? '#2F86FF'
  const selectedBg = theme.checkoutSelectedBg?.get() ?? '#102953'
  const controlBg = theme.checkoutControlBg?.get() ?? '#0A152D'
  const controlBorder = theme.checkoutControlBorder?.get() ?? '#243E70'
  const radioMuted = theme.checkoutRadioBorder?.get() ?? '#38598F'
  const iconMuted = theme.checkoutIconMuted?.get() ?? '#91A5CF'

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
        {paymentMethods.map((method) => {
          const active = selectedMethodId === method.id
          return (
            <XStack
              key={method.id}
              minHeight={56}
              borderWidth={1}
              borderColor={active ? accentColor : controlBorder}
              borderRadius={14}
              backgroundColor={active ? selectedBg : controlBg}
              alignItems="center"
              justifyContent="space-between"
              paddingHorizontal="$3"
              onPress={() => onSelectMethod(method.id)}
            >
              <XStack alignItems="center" gap="$2.5">
                <XStack
                  width={12}
                  height={12}
                  borderRadius={999}
                  backgroundColor={active ? accentColor : radioMuted}
                />
                <WalletIcon size={18} color={active ? accentColor : iconMuted} />
                <YStack>
                  <Text color={bodyColor} fontWeight="700">
                    {method.title}
                  </Text>
                  <Text color={mutedColor} size="sm">
                    {method.subtitle}
                  </Text>
                </YStack>
              </XStack>
              {active ? <CheckIcon size={16} color={accentColor} /> : null}
            </XStack>
          )
        })}
      </YStack>

      <Button variant="primary" height={52} borderRadius={14} onPress={onConfirm}>
        {t('confirm')}
      </Button>
      <Text color={mutedColor} size="sm">
        {t('termsNotice')}
      </Text>
    </Card>
  )
}
