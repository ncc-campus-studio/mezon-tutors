'use client';

import { LoginButton } from '@mezon-tutors/app/components/auth/LoginButton';
import { ROUTES } from '@mezon-tutors/shared';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useMedia, XStack, YStack, Paragraph, H1, H2, Text } from 'tamagui';

const STEP_KEYS = ['1', '2', '3'] as const;
const HIGHLIGHT_KEYS = ['1', '2', '3'] as const;
const STEP_BADGE_SIZE = 52;
const STEP_ROW_PADDING_Y_DESKTOP = 8;

function WalletIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="6.5" width="17" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 10.5h17M8 14h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v4.2l3 1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GrowthIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 16.5l4.5-4.5 3 3L19 8.5M14 8.5h5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 12h12M13 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const HIGHLIGHT_ICONS = [WalletIcon, ClockIcon, GrowthIcon] as const;

export function BecomeTutorGuide() {
  const t = useTranslations('BecomeTutorGuide');
  const media = useMedia();
  const isCompact = media.sm || media.xs;
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const steps = STEP_KEYS.map((key, index) => ({
    number: `0${index + 1}`,
    title: t(`steps.${key}.title`),
    description: t(`steps.${key}.description`),
  }));

  const highlights = HIGHLIGHT_KEYS.map((key, index) => ({
    Icon: HIGHLIGHT_ICONS[index],
    title: t(`highlights.${key}.title`),
    description: t(`highlights.${key}.description`),
    tag: t(`highlights.${key}.tag`),
  }));

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
                top={STEP_ROW_PADDING_Y_DESKTOP + STEP_BADGE_SIZE / 2}
                left={52}
                right={52}
                height={1}
                backgroundColor="$myLessonsCardBorder"
                opacity={0.55}
              />
            ) : null}

            <XStack
              flexDirection={isCompact ? 'column' : 'row'}
              gap={isCompact ? '$2.5' : '$2'}
            >
              {steps.map((step) => (
                <YStack
                  key={step.number}
                  flex={1}
                  alignItems={isCompact ? 'flex-start' : 'center'}
                  paddingHorizontal={isCompact ? 8 : 12}
                  paddingVertical={isCompact ? 10 : STEP_ROW_PADDING_Y_DESKTOP}
                  gap="$2"
                >
                  <XStack
                    width={STEP_BADGE_SIZE}
                    height={STEP_BADGE_SIZE}
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
                    {step.title}
                  </H2>
                  <Paragraph
                    color="$myLessonsPromoDescription"
                    fontSize={isCompact ? 12 : 11}
                    lineHeight={isCompact ? 17 : 16}
                    textAlign={isCompact ? 'left' : 'center'}
                    maxWidth={250}
                  >
                    {step.description}
                  </Paragraph>
                </YStack>
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
              <LoginButton
                label={t('loginNow')}
                redirectTo={ROUTES.BECOME_TUTOR.INDEX}
              />
            </YStack>
            <Paragraph
              color="$myLessonsPromoDescription"
              fontSize={isCompact ? 12 : 13}
              textAlign="center"
            >
              {t('ctaNote')}
            </Paragraph>
          </YStack>
        </YStack>

        <YStack padding={isCompact ? 16 : 22} backgroundColor="$tutorsPageBackground" gap="$4">
          <XStack flexDirection={isCompact ? 'column' : 'row'} gap="$2.5">
            {highlights.map((item, index) => {
              const isHovered = hoveredCard === index;
              const Icon = item.Icon;

              return (
                <YStack
                  key={item.title}
                  flex={1}
                  minHeight={isCompact ? 220 : 252}
                  padding={isCompact ? 16 : 18}
                  borderRadius={20}
                  borderWidth={1}
                  borderColor={isHovered ? '$myLessonsPrimaryButtonBorder' : '$myLessonsCardBorder'}
                  backgroundColor={isHovered ? '$myLessonsPrimaryButton' : '$myLessonsCardBackground'}
                  shadowColor={isHovered ? '$myLessonsPrimaryButton' : '$myLessonsCardBorder'}
                  shadowOpacity={isHovered ? 0.34 : 0.12}
                  shadowRadius={isHovered ? 26 : 14}
                  shadowOffset={{ width: 0, height: 10 }}
                  gap="$3"
                  position="relative"
                  overflow="hidden"
                  cursor="pointer"
                  y={isHovered ? -2 : 0}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <YStack
                    position="absolute"
                    top={-34}
                    right={-30}
                    width={92}
                    height={92}
                    borderRadius={999}
                    backgroundColor={isHovered ? 'rgba(255,255,255,0.14)' : 'rgba(30, 97, 243, 0.08)'}
                  />

                  <XStack
                    width={32}
                    height={32}
                    borderRadius={10}
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor={isHovered ? 'rgba(255,255,255,0.16)' : 'rgba(32, 107, 255, 0.12)'}
                  >
                    <Text color={isHovered ? '$myLessonsPrimaryButtonText' : '$myLessonsPrimaryButton'}>
                      <Icon />
                    </Text>
                  </XStack>

                  <H2
                    color={isHovered ? '$myLessonsPrimaryButtonText' : '$myLessonsHeaderTitle'}
                    fontSize={isCompact ? 30 : 38}
                    lineHeight={isCompact ? 35 : 44}
                    fontWeight="800"
                  >
                    {item.title}
                  </H2>
                  <Paragraph
                    color={isHovered ? '$myLessonsPrimaryButtonText' : '$myLessonsPromoDescription'}
                    fontSize={12}
                    lineHeight={18}
                    opacity={isHovered ? 0.92 : 1}
                  >
                    {item.description}
                  </Paragraph>

                  <YStack flex={1} />

                  <XStack alignItems="center" justifyContent="space-between">
                    <Text
                      color={isHovered ? '$myLessonsPrimaryButtonText' : '$myLessonsPrimaryButton'}
                      fontSize={9}
                      letterSpacing={1.1}
                      fontWeight="700"
                      textTransform="uppercase"
                    >
                      {item.tag}
                    </Text>
                    <Text
                      color={isHovered ? '$myLessonsPrimaryButtonText' : '$myLessonsPrimaryButton'}
                      fontSize={14}
                    >
                      <ArrowIcon />
                    </Text>
                  </XStack>
                </YStack>
              );
            })}
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
