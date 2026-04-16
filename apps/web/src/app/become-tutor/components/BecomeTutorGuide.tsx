'use client';

import { LoginButton } from '@mezon-tutors/app/components/auth/LoginButton';
import {
  GUIDE_HIGHLIGHTS,
  GUIDE_STEPS,
  ROUTES,
} from '@mezon-tutors/shared';
import { useTranslations } from 'next-intl';
import { useMedia, XStack, YStack, Paragraph, H1 } from '@mezon-tutors/app/ui';
import { GuideHighlightCard } from './GuideHighlightCard';
import { GuideStepCard } from './GuideStepCard';

export function BecomeTutorGuide() {
  const t = useTranslations('BecomeTutorGuide')
  const media = useMedia()
  const isCompact = media.sm || media.xs

  return (
    <YStack
      minHeight="100vh"
      paddingTop={isCompact ? 80 : 92}
      paddingBottom={36}
      paddingHorizontal={isCompact ? 12 : 20}
      backgroundColor="$tutorsPageBackground"
      gap="$4"
    >
      <YStack
        maxWidth={960}
        width="100%"
        alignSelf="center"
        borderRadius={6}
        overflow="hidden"
        backgroundColor="$myLessonsTopNavBackground"
      >
        <YStack height={40} backgroundColor="$myLessonsTopNavBackground" />

        <YStack
          paddingHorizontal={isCompact ? 16 : 28}
          paddingTop={isCompact ? 26 : 42}
          paddingBottom={isCompact ? 24 : 36}
          gap="$3.5"
          backgroundColor="$myLessonsCardBackground"
        >
          <YStack alignItems="center" gap="$2">
            <H1
              color="$myLessonsHeaderTitle"
              fontSize={isCompact ? 34 : 50}
              lineHeight={isCompact ? 40 : 58}
              textAlign="center"
              fontWeight="800"
            >
              {t('title')}
            </H1>
            <Paragraph
              color="$myLessonsPromoDescription"
              textAlign="center"
              maxWidth={640}
              fontSize={isCompact ? 12 : 13}
              lineHeight={isCompact ? 18 : 19}
            >
              {t('subtitle')}
            </Paragraph>
          </YStack>

          <YStack position="relative" marginTop={isCompact ? 4 : 10}>
            {!isCompact ? (
              <YStack
                position="absolute"
                top={34}
                left={52}
                right={52}
                height={1}
                backgroundColor="$myLessonsCardBorder"
                opacity={0.55}
              />
            ) : null}

            <XStack flexDirection={isCompact ? 'column' : 'row'} gap={isCompact ? '$2.5' : '$2'}>
              {GUIDE_STEPS.map((step) => (
                <GuideStepCard
                  key={step.id}
                  step={step}
                  isCompact={isCompact}
                />
              ))}
            </XStack>
          </YStack>

          <YStack
            alignItems="center"
            gap="$2"
            marginTop={isCompact ? 8 : 12}
            marginBottom={isCompact ? 2 : 4}
          >
            <YStack
              borderRadius={999}
              padding={3}
              backgroundColor="$myLessonsPrimaryButton"
              shadowColor="$myLessonsPrimaryButton"
              shadowOpacity={0.45}
              shadowRadius={20}
              shadowOffset={{ width: 0, height: 8 }}
            >
              <LoginButton label={t('loginNow')} redirectTo={ROUTES.BECOME_TUTOR.INDEX} />
            </YStack>
            <Paragraph color="$myLessonsPromoDescription" fontSize={isCompact ? 12 : 13} textAlign="center">
              {t('ctaNote')}
            </Paragraph>
          </YStack>
        </YStack>

        <YStack padding={isCompact ? 16 : 22} backgroundColor="$tutorsPageBackground" gap="$4">
          <XStack flexDirection={isCompact ? 'column' : 'row'} gap="$2.5">
            {GUIDE_HIGHLIGHTS.map((item) => (
              <GuideHighlightCard
                key={item.id}
                item={item}
                isCompact={isCompact}
              />
            ))}
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  )
}
