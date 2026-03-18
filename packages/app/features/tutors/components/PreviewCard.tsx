import { H3 } from 'tamagui'
import { Card, YStack, Paragraph, Button, Separator, Text } from '@mezon-tutors/app/ui'
import { VerifiedTutorProfileDto } from '@mezon-tutors/shared'
import { VideoPreview } from './VideoPreview'
import { ArrowRightIcon, CalendarIcon } from '@mezon-tutors/app/ui/icons'

type PreviewCardProps = {
  tutor: VerifiedTutorProfileDto | null
  isPopularWeek: boolean
}

export function PreviewCard({ tutor, isPopularWeek }: PreviewCardProps) {
  if (!tutor) {
    return null
  }

  return (
    <Card height="100%" gap="$4" justifyContent="space-between" borderColor="$gray2">
      <VideoPreview videoUrl={tutor.videoUrl} />

      <YStack gap="$2">
        <H3 fontWeight="700">{tutor.headline}</H3>
        <Paragraph>{tutor.motivate}</Paragraph>
      </YStack>

      <YStack gap="$3">
        <Button variant="secondary" width="100%">
          <CalendarIcon color="#101622" size={16} />
          <Text>View full schedule</Text>
        </Button>
        <Button variant="ghost" width="100%">
          <Text color="$appPrimary">See full profile</Text>
          <ArrowRightIcon color="#1253D5" size={16} />
        </Button>

        {isPopularWeek && (
          <>
            <Separator />
            <Text variant="muted" size="sm">
              Popular this week · 12 students booked in last 24h
            </Text>
          </>
        )}
      </YStack>
    </Card>
  )
}
