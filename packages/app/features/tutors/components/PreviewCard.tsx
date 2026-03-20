import { H3, useTheme } from 'tamagui'
import { Card, YStack, Button, Separator, Text } from '@mezon-tutors/app/ui'
import { VerifiedTutorProfileDto } from '@mezon-tutors/shared'
import { VideoPreview } from './VideoPreview'
import { ArrowRightIcon, CalendarIcon } from '@mezon-tutors/app/ui/icons'
import { useTranslations } from 'next-intl'

type PreviewCardProps = {
  tutor: VerifiedTutorProfileDto | null
  isPopularWeek: boolean
}

export function PreviewCard({ tutor, isPopularWeek }: PreviewCardProps) {
  const t = useTranslations('Tutors.PreviewCard')
  const theme = useTheme()
  const foregroundColor = theme.foreground?.get() ?? theme.appText?.get() ?? '#111827'
  const appPrimaryColor = theme.appPrimary?.get() ?? '#1253D5'

  if (!tutor) {
    return null
  }

  return (
    <Card height="100%" gap="$4" justifyContent="space-between" borderColor="$cardBorder">
      <VideoPreview videoUrl={tutor.videoUrl} height={200} maxWidth={720} />

      <YStack gap="$3">
        <Button variant="secondary" width="100%">
          <CalendarIcon color={foregroundColor} size={16} />
          <Text>{t('viewSchedule')}</Text>
        </Button>
        <Button variant="ghost" width="100%">
          <Text color="$appPrimary">{t('seeProfile')}</Text>
          <ArrowRightIcon color={appPrimaryColor} size={16} />
        </Button>

        {isPopularWeek && (
          <>
            <Separator />
            <Text variant="muted" size="sm">
              {t('popularThisWeek', { count: 12 })}
            </Text>
          </>
        )}
      </YStack>
    </Card>
  )
}
