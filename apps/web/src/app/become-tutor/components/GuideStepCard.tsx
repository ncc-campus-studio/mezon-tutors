'use client'

import { type GuideStep } from '@mezon-tutors/shared'
import { useTranslations } from 'next-intl'
import { Paragraph, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { H2 } from 'tamagui'

type GuideStepCardProps = {
  step: GuideStep
  isCompact: boolean
}

export function GuideStepCard({ step, isCompact }: GuideStepCardProps) {
  const t = useTranslations('BecomeTutorGuide')

  return (
    <YStack
      flex={1}
      alignItems={isCompact ? 'flex-start' : 'center'}
      paddingHorizontal={isCompact ? 8 : 12}
      paddingVertical={isCompact ? 10 : 8}
      gap="$2"
    >
      <XStack
        width={52}
        height={52}
        borderRadius={14}
        alignItems="center"
        justifyContent="center"
        backgroundColor="$myLessonsCategoryEnglishBackground"
        borderWidth={1}
        borderColor="$myLessonsCategoryEnglishDot"
      >
        <Text color="$myLessonsCategoryEnglishLabel" fontSize={27} fontWeight="800" lineHeight={27}>
          {step.number}
        </Text>
      </XStack>
      <H2 color="$myLessonsHeaderTitle" fontSize={isCompact ? 20 : 24} lineHeight={isCompact ? 24 : 30}>
        {t(step.titleKey)}
      </H2>
      <Paragraph
        color="$myLessonsPromoDescription"
        fontSize={isCompact ? 12 : 11}
        lineHeight={isCompact ? 17 : 16}
        textAlign={isCompact ? 'left' : 'center'}
        maxWidth={250}
      >
        {t(step.descriptionKey)}
      </Paragraph>
    </YStack>
  )
}

