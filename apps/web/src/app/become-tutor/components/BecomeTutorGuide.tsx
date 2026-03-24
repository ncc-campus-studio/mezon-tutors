'use client';

import { LoginButton } from '@mezon-tutors/app/components/auth/LoginButton';
import {
  ArrowRightLineIcon,
  ClockOutlineIcon,
  GrowthOutlineIcon,
  WalletOutlineIcon,
} from '@mezon-tutors/app/ui/icons';
import {
  GUIDE_HIGHLIGHTS,
  GUIDE_STEPS,
  ROUTES,
  type GuideHighlightIconKey,
} from '@mezon-tutors/shared';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useMedia, XStack, YStack, Paragraph, H1, H2, Text } from 'tamagui';

const HIGHLIGHT_ICON_BY_KEY: Record<GuideHighlightIconKey, typeof WalletOutlineIcon> = {
  setOwnRate: WalletOutlineIcon,
  teachAnytime: ClockOutlineIcon,
  growProfessionally: GrowthOutlineIcon,
};

export function BecomeTutorGuide() {
  const t = useTranslations('BecomeTutorGuide');
  const media = useMedia();
  const isCompact = media.sm || media.xs;
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const steps = GUIDE_STEPS.map((step) => ({
    ...step,
    title: t(step.titleKey),
    description: t(step.descriptionKey),
  }));

  const highlights = GUIDE_HIGHLIGHTS.map((item) => ({
    ...item,
    Icon: HIGHLIGHT_ICON_BY_KEY[item.iconKey],
    title: t(item.titleKey),
    description: t(item.descriptionKey),
    tag: t(item.tagKey),
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
                top={34}
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
                  key={step.id}
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
                  key={item.id}
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
                    <Icon color={isHovered ? '#F6FAFF' : '#1D66F2'} />
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
                    <ArrowRightLineIcon 
                      color={isHovered ? '$myLessonsPrimaryButtonText' : '$myLessonsPrimaryButton'} 
                    />
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
