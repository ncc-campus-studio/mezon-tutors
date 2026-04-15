import { Card, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { Image } from 'tamagui'
import { useTranslations } from 'next-intl'
import { useTheme } from 'tamagui'

type TrialLessonDetailsCardProps = {
  isCompact: boolean
  tutorName: string
  tutorSubtitle: string
  avatarUrl: string
  dateLabel: string
  timeLabel: string
  durationLabel: string
}

export function TrialLessonDetailsCard({
  isCompact,
  tutorName,
  tutorSubtitle,
  avatarUrl,
  dateLabel,
  timeLabel,
  durationLabel,
}: TrialLessonDetailsCardProps) {
  const t = useTranslations('TrialLessonCheckout.TrialLessonDetailsCard')
  const theme = useTheme()
  const cardBg = theme.checkoutSurface?.get() ?? '#0E1B35'
  const cardBorder = theme.checkoutCardBorder?.get() ?? '#22345F'
  const headingColor = theme.checkoutHeadingText?.get() ?? '#F5F8FF'
  const bodyColor = theme.checkoutBodyText?.get() ?? '#EAF0FF'
  const mutedColor = theme.checkoutMutedText?.get() ?? '#6B7EA8'
  const accentColor = theme.appPrimary?.get() ?? '#3C8CFF'
  const successColor = theme.checkoutSuccessText?.get() ?? '#2CD38B'
  const mediaBg = theme.checkoutMediaBg?.get() ?? '#1A2A4F'
  const mediaFallbackText = theme.checkoutMediaFallbackText?.get() ?? '#8192B8'

  return (
    <Card
      backgroundColor={cardBg}
      borderColor={cardBorder}
      borderRadius={20}
      padding={0}
      overflow="hidden"
      gap={0}
    >
      <XStack
        padding="$4"
        alignItems={isCompact ? 'flex-start' : 'center'}
        justifyContent="space-between"
        flexDirection={isCompact ? 'column' : 'row'}
        gap="$3"
      >
        <YStack gap="$1.5" flex={1}>
          <Text
            color={accentColor}
            fontSize={11}
            letterSpacing={0.6}
            fontWeight="700"
            textTransform="uppercase"
          >
            {t('trialLesson')}
          </Text>
          <Text color={headingColor} size="xl" fontWeight="700">
            {tutorName}
          </Text>
          <Text color={mutedColor}>{tutorSubtitle}</Text>
        </YStack>

        <YStack
          width={isCompact ? '100%' : 170}
          height={100}
          borderRadius={14}
          backgroundColor={mediaBg}
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
        >
          {avatarUrl ? (
            <Image src={avatarUrl} width="100%" height={100} objectFit="cover" alt="" />
          ) : (
            <Text color={mediaFallbackText} fontSize={12}>
              …
            </Text>
          )}
        </YStack>
      </XStack>

      <XStack borderTopWidth={1} borderTopColor={cardBorder} padding="$4" gap="$4" flexWrap="wrap" justifyContent="space-between" alignItems="flex-start">
        <YStack gap="$4">
          <YStack gap="$1" minWidth={110}>
            <Text color={mutedColor} fontSize={11} textTransform="uppercase" letterSpacing={0.5}>
              {t('date')}
            </Text>
            <Text color={bodyColor} fontWeight="700">
              {dateLabel}
            </Text>
          </YStack>
          <YStack gap="$1" minWidth={110}>
            <Text color={mutedColor} fontSize={11} textTransform="uppercase" letterSpacing={0.5}>
              {t('time')}
            </Text>
            <Text color={bodyColor} fontWeight="700">
              {timeLabel}
            </Text>
          </YStack>
        </YStack>
        <YStack gap="$4">
          <YStack gap="$1" minWidth={110}>
            <Text color={mutedColor} fontSize={11} textTransform="uppercase" letterSpacing={0.5}>
              {t('duration')}
            </Text>
            <Text color={bodyColor} fontWeight="700">
              {durationLabel}
            </Text>
          </YStack>
          <YStack gap="$1" minWidth={110}>
            <Text color={mutedColor} fontSize={11} textTransform="uppercase" letterSpacing={0.5}>
              {t('policy')}
            </Text>
            <Text color={successColor} fontWeight="700">
              {t('freeCancellation')}
            </Text>
          </YStack>
        </YStack>
      </XStack>
    </Card>
  )
}
