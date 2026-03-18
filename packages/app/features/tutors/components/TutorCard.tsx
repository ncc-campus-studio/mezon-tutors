import { VerifiedTutorProfileDto } from '@mezon-tutors/shared'
import { Button, Card, Chip, ChipText, Paragraph, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import {
  GraduationCapIcon,
  LanguageIcon,
  StarOutlineIcon,
  WorldIcon,
} from '@mezon-tutors/app/ui/icons'
import { H2, Image, Separator } from 'tamagui'

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <YStack
      paddingHorizontal="$2"
      paddingVertical={6}
      borderRadius={999}
      backgroundColor="$backgroundMuted"
    >
      <Text size="sm" variant="muted">
        {children}
      </Text>
    </YStack>
  )
}

export function TutorCard({
  tutor,
  onHover,
}: {
  tutor: VerifiedTutorProfileDto
  onHover: (tutor: VerifiedTutorProfileDto) => void
}) {
  return (
    <Card cursor="pointer" borderColor="$gray2" onMouseEnter={() => onHover(tutor)}>
      <XStack gap="$4" alignItems="center">
        <YStack gap="$4" alignItems="center" justifyContent="center">
          <Image
            src={tutor.avatar}
            width={150}
            height={150}
            objectFit="cover"
            aspectRatio={1}
            borderRadius={8}
          />
        </YStack>
        <YStack flex={1} gap="$2">
          <XStack alignItems="center" gap="$2" flexWrap="wrap">
            <H2 size="$5" fontWeight="700">
              {tutor.firstName} {tutor.lastName}
            </H2>
            {tutor.isProfessional && (
              <Chip tone="primary">
                <ChipText tone="primary">PROFESSIONAL</ChipText>
              </Chip>
            )}
          </XStack>

          <XStack alignItems="center" gap="$6">
            <XStack alignItems="center" gap="$2">
              <GraduationCapIcon color="#101622" />
              <Text variant="muted">Teaches {tutor.subject}</Text>
            </XStack>
            <XStack alignItems="center" gap="$2">
              <WorldIcon color="#101622" />
              <Text variant="muted">{tutor.country}</Text>
            </XStack>
          </XStack>
          <XStack alignItems="center" gap="$2">
            <LanguageIcon color="#101622" />
            <Text variant="muted">
              Speaks {tutor.languages.map((language) => language.languageCode).join(', ')}
            </Text>
          </XStack>
          <Paragraph numberOfLines={3}>{tutor.introduce}</Paragraph>

          <XStack gap="$2" flexWrap="wrap">
            {tutor.languages.map((language) => (
              <Tag key={language.languageCode}>{language.languageCode}</Tag>
            ))}
          </XStack>
        </YStack>

        <Separator vertical height="100%" />

        <YStack gap="$2" alignItems="flex-start" minWidth="25%">
          <XStack alignItems="center" gap="$1">
            <StarOutlineIcon />
            <Text size="xl" fontWeight="700">
              {tutor.ratingAverage}
            </Text>
            <Text variant="muted">({tutor.ratingCount} reviews)</Text>
          </XStack>
          <XStack alignItems="baseline" gap="$1">
            <Text size="xl" fontWeight="700">
              ${tutor.pricePerHour}
            </Text>
            <Text variant="muted">/ lesson</Text>
          </XStack>

          <Button variant="primary" width="100%">
            Book trial lesson
          </Button>
          <Button variant="outline" width="100%" size="sm">
            Send message
          </Button>
        </YStack>
      </XStack>
    </Card>
  )
}
