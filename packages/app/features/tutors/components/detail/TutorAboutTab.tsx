import { Chip, ChipText, Paragraph, Text, XStack, YStack, useMedia } from '@mezon-tutors/app/ui'
import { TUTOR_DETAIL_MOBILE_CONFIG } from '@mezon-tutors/shared'
import { useTranslations } from 'next-intl'
import { VideoPreview } from '../VideoPreview'
import { TutorAboutTabProps } from './types'

export function TutorAboutTab({ tutor }: TutorAboutTabProps) {
  const t = useTranslations('Tutors.Detail')
  const media = useMedia()
  const isMobile = media.sm

  const config = isMobile ? TUTOR_DETAIL_MOBILE_CONFIG : null

  return (
    <YStack gap={config?.spacing ?? '$4'} paddingHorizontal={config?.padding ?? '$0'}>
      <VideoPreview 
        videoUrl={tutor.videoUrl} 
        height={config?.videoHeight ?? 330} 
        title={t('videoIntroTitle')} 
      />

      <YStack gap="$3">
        <Text 
          color="$tutorsDetailPrimaryText" 
          fontSize={config?.typography.aboutTitle ?? 20} 
          fontWeight="800"
          lineHeight={config?.lineHeight.aboutTitle}
        >
          {t('aboutTitle')}
        </Text>
        
        <YStack gap="$2.5">
          <Paragraph 
            color="$tutorsDetailSecondaryText"
            fontSize={config?.typography.paragraph ?? 16}
            lineHeight={config?.lineHeight.paragraph}
          >
            {tutor.introduce || t('emptySection')}
          </Paragraph>
        </YStack>
      </YStack>

      {tutor.experience ? (
        <YStack gap="$3">
          <Text 
            color="$tutorsDetailPrimaryText" 
            fontSize={config?.typography.aboutTitle ?? 20} 
            fontWeight="800"
            lineHeight={config?.lineHeight.aboutTitle}
          >
            {t('experienceTitle')}
          </Text>
          
          <Paragraph 
            color="$tutorsDetailSecondaryText"
            fontSize={config?.typography.paragraph ?? 16}
            lineHeight={config?.lineHeight.paragraph}
          >
            {tutor.experience}
          </Paragraph>
        </YStack>
      ) : null}

      {tutor.motivate ? (
        <YStack gap="$3">
          <Text 
            color="$tutorsDetailPrimaryText" 
            fontSize={config?.typography.aboutTitle ?? 20} 
            fontWeight="800"
            lineHeight={config?.lineHeight.aboutTitle}
          >
            {t('motivationTitle')}
          </Text>
          
          <Paragraph 
            color="$tutorsDetailSecondaryText"
            fontSize={config?.typography.paragraph ?? 16}
            lineHeight={config?.lineHeight.paragraph}
          >
            {tutor.motivate}
          </Paragraph>
        </YStack>
      ) : null}

      <YStack gap="$3">
        <Text 
          color="$tutorsDetailPrimaryText" 
          fontSize={config?.typography.languageTitle ?? 18} 
          fontWeight="800"
          lineHeight={config?.lineHeight.languageTitle}
        >
          {t('languagesTitle')}
        </Text>
        
        <XStack gap={config?.gap ?? '$2'} flexWrap="wrap">
          {tutor.languages.map((language) => (
            <Chip
              key={`${language.languageCode}-${language.proficiency}`}
              tone="default"
              backgroundColor="$tutorsDetailChipBackground"
              borderWidth={1}
              borderColor="$tutorsDetailChipBorder"
              paddingHorizontal={config?.chip.paddingHorizontal ?? '$3'}
              paddingVertical={config?.chip.paddingVertical ?? '$1.5'}
            >
              <ChipText 
                tone="default" 
                color="$tutorsDetailPrimaryText"
                fontSize={config?.typography.chip ?? 14}
              >
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
