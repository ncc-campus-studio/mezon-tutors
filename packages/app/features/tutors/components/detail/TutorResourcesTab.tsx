import { Button, Card, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { ExternalLinkIcon, VideoIcon } from '@mezon-tutors/app/ui/icons'
import { useTranslations } from 'next-intl'
import { TutorResourcesTabProps } from './types'

export function TutorResourcesTab({ tutor }: TutorResourcesTabProps) {
  const t = useTranslations('Tutors.Detail')

  if (!tutor.resources.length) {
    return (
      <YStack gap="$2">
        <Text color="$tutorsDetailPrimaryText" fontSize={20} fontWeight="800">
          {t('resourcesTitle')}
        </Text>
        <Text color="$tutorsDetailMutedText">{t('resourcesEmpty')}</Text>
      </YStack>
    )
  }

  return (
    <YStack gap="$3">
      <Text color="$tutorsDetailPrimaryText" fontSize={20} fontWeight="800">
        {t('resourcesTitle')}
      </Text>

      {tutor.resources.map((resource) => (
        <Card
          key={resource.id}
          backgroundColor="$tutorsDetailReviewCardBackground"
          borderColor="$tutorsDetailReviewCardBorder"
          borderWidth={1}
          borderRadius={14}
          padding="$3"
        >
          <XStack alignItems="center" justifyContent="space-between" gap="$3">
            <XStack alignItems="center" gap="$2.5">
              <YStack
                width={36}
                height={36}
                borderRadius={10}
                alignItems="center"
                justifyContent="center"
                backgroundColor="$tutorsDetailChipBackground"
                borderWidth={1}
                borderColor="$tutorsDetailChipBorder"
              >
                <VideoIcon size={16} color="$tutorsDetailAccentText" />
              </YStack>
              <YStack>
                <Text color="$tutorsDetailPrimaryText" fontWeight="700">
                  {resource.title}
                </Text>
                <Text color="$tutorsDetailMutedText" fontSize={12}>
                  {t('resourceTypeVideo')}
                </Text>
              </YStack>
            </XStack>

            <Button
              size="sm"
              variant="outline"
              onPress={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLinkIcon size={14} />
              {t('openResource')}
            </Button>
          </XStack>
        </Card>
      ))}
    </YStack>
  )
}
