import { Chip, ChipText, Paragraph, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { useTranslations } from 'next-intl'
import { VideoPreview } from '../VideoPreview'
import { TutorAboutTabProps } from './types'

export function TutorAboutTab({ tutor }: TutorAboutTabProps) {
  const t = useTranslations('Tutors.Detail')

  return (
    <YStack gap="$4">
      <VideoPreview videoUrl={tutor.videoUrl} height={330} title={t('videoIntroTitle')} />

      <YStack gap="$2.5">
        <Text color="$tutorsDetailPrimaryText" fontSize={20} fontWeight="800">
          {t('aboutTitle')}
        </Text>
        <Paragraph color="$tutorsDetailSecondaryText">
          {tutor.introduce || t('emptySection')}
        </Paragraph>
        {tutor.experience ? (
          <Paragraph color="$tutorsDetailSecondaryText">{tutor.experience}</Paragraph>
        ) : null}
        {tutor.motivate ? (
          <Paragraph color="$tutorsDetailSecondaryText">{tutor.motivate}</Paragraph>
        ) : null}
      </YStack>

      <YStack gap="$2">
        <Text color="$tutorsDetailPrimaryText" fontSize={18} fontWeight="800">
          {t('languagesTitle')}
        </Text>
        <XStack gap="$2" flexWrap="wrap">
          {tutor.languages.map((language) => (
            <Chip
              key={`${language.languageCode}-${language.proficiency}`}
              tone="default"
              backgroundColor="$tutorsDetailChipBackground"
              borderWidth={1}
              borderColor="$tutorsDetailChipBorder"
            >
              <ChipText tone="default" color="$tutorsDetailPrimaryText">
                {language.languageCode.toUpperCase()}{' '}
                <Text tag="span" color="$tutorsDetailAccentText">
                  {language.proficiency}
                </Text>
              </ChipText>
            </Chip>
          ))}
        </XStack>
      </YStack>
    </YStack>
  )
}
