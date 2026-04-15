import { Card, Text, XStack } from '@mezon-tutors/app/ui'
import { ShieldCheckIcon } from '@mezon-tutors/app/ui/icons'
import { useTranslations } from 'next-intl'
import { useTheme } from 'tamagui'

export function TrustCards() {
  const t = useTranslations('SubscriptionCheckout.TrustCards')
  const theme = useTheme()
  const cardBg = theme.checkoutSurface?.get() ?? '#0B1A38'
  const cardBorder = theme.checkoutCardBorder?.get() ?? '#1D335F'
  const headingColor = theme.checkoutHeadingText?.get() ?? '#F3F7FF'
  const subtitleColor = theme.checkoutMutedText?.get() ?? '#8DA3CC'
  const accentColor = theme.appPrimary?.get() ?? '#2F86FF'
  const items = t.raw('items') as Array<{ title: string; subtitle: string }>

  return (
    <XStack gap="$3" flexDirection="row" flexWrap="wrap">
      {items.map((item) => (
        <Card
          key={item.title}
          flex={1}
          minWidth={260}
          backgroundColor={cardBg}
          borderColor={cardBorder}
          borderRadius={18}
          padding="$3"
          gap="$2"
        >
          <XStack alignItems="center" gap="$2">
            <ShieldCheckIcon size={16} color={accentColor} />
            <Text color={headingColor} fontWeight="700">
              {item.title}
            </Text>
          </XStack>
          <Text color={subtitleColor} size="sm">
            {item.subtitle}
          </Text>
        </Card>
      ))}
    </XStack>
  )
}
