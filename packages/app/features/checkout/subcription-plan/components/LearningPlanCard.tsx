import { Card, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { CheckIcon } from '@mezon-tutors/app/ui/icons'
import { useTranslations } from 'next-intl'
import { useTheme } from 'tamagui'

export function LearningPlanCard() {
  const t = useTranslations('SubscriptionCheckout.LearningPlanCard')
  const theme = useTheme()
  const cardBg = theme.checkoutCardBg?.get() ?? '#112650'
  const cardBorder = theme.checkoutCardBorder?.get() ?? '#1F3A6A'
  const titleColor = theme.checkoutHeadingText?.get() ?? '#F2F6FF'
  const subtitleColor = theme.checkoutMutedText?.get() ?? '#8EA4CF'
  const iconColor = theme.appPrimary?.get() ?? '#2F86FF'
  const planItems = t.raw('items') as Array<{ title: string; subtitle: string }>

  return (
    <Card
      backgroundColor={cardBg}
      borderColor={cardBorder}
      borderRadius={18}
      padding="$3.5"
      gap="$3"
      style={{ boxShadow: '0 16px 36px rgba(2,9,28,0.45)' }}
    >
      <Text color={titleColor} size="xl" fontWeight="700">
        {t('title')}
      </Text>
      <YStack gap="$2.5">
        {planItems.map((item) => (
          <XStack key={item.title} gap="$2.5" alignItems="flex-start">
            <CheckIcon size={16} color={iconColor} />
            <YStack flex={1}>
              <Text color={titleColor} fontWeight="700">
                {item.title}
              </Text>
              <Text color={subtitleColor} size="sm">
                {item.subtitle}
              </Text>
            </YStack>
          </XStack>
        ))}
      </YStack>
    </Card>
  )
}
