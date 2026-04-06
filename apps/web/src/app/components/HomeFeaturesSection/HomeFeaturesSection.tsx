'use client';

import { useTranslations } from 'next-intl';
import { Text, YStack, XStack, useMedia } from '@mezon-tutors/app/ui';
import { HOME_FEATURES } from '@mezon-tutors/shared';
import HomeFeatureCard from './HomeFeatureCard';

export default function HomeFeaturesSection() {
  const t = useTranslations('Home.Features');
  const media = useMedia();
  const isCompact = media.sm || media.xs;

  return (
    <YStack
      paddingVertical={isCompact ? 60 : 100}
      paddingHorizontal={isCompact ? 20 : 120}
      backgroundColor="$homeFeatureSectionBackground"
      style={{
        backgroundImage: 'var(--home-feature-backdrop-gradient)',
        animation: 'homeRevealUp 560ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <XStack
        justifyContent="space-between"
        alignItems="flex-start"
        marginBottom={isCompact ? 40 : 72}
        gap={30}
        flexDirection={isCompact ? 'column' : 'row'}
      >
        <YStack flex={1} maxWidth={780}>
          <Text
            fontSize={isCompact ? 30 : 40}
            fontWeight="800"
            lineHeight={isCompact ? 38 : 48}
            color="$homeSectionTitle"
            marginBottom="$3.5"
            style={{ letterSpacing: '-0.6px' }}
          >
            {t('title')}
          </Text>
          <Text fontSize={16} lineHeight={28} color="$homeSectionBody">
            {t('description')}
          </Text>
        </YStack>

        <XStack
          borderWidth={1}
          borderColor="$homeFeatureExploreBorder"
          backgroundColor="$homeFeatureExploreBackground"
          borderRadius="$appPill"
          paddingVertical="$2.5"
          paddingHorizontal="$4"
          alignItems="center"
          gap="$2"
          style={{
            cursor: 'pointer',
            transition: 'all 280ms cubic-bezier(0.22,1,0.36,1)',
          }}
          hoverStyle={{ y: -1, scale: 1.02, borderColor: '$myLessonsPrimaryButton' }}
        >
          <Text color="$homeFeatureExploreText" lineHeight={20} fontWeight="700">
            {t('exploreAll')}
          </Text>
          <Text color="$homeFeatureExploreText" lineHeight={20} fontWeight="700">
            {'->'}
          </Text>
        </XStack>
      </XStack>

      <XStack
        gap="$homeFeatureCardGap"
        width="100%"
        style={{
          display: 'grid',
          gridTemplateColumns: isCompact ? '1fr' : 'repeat(3, minmax(0, 1fr))',
        }}
      >
        {HOME_FEATURES.map((feature) => (
          <HomeFeatureCard
            key={feature.id}
            isCompact={isCompact}
            feature={feature}
          />
        ))}
      </XStack>
    </YStack>
  );
}
