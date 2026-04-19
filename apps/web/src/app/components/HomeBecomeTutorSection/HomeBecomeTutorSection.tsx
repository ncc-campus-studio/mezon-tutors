import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Text, Button, YStack, XStack, useMedia } from '@mezon-tutors/app/ui';
import { ROUTES } from '@mezon-tutors/shared';
import { HOME_BECOME_TUTOR_BENEFIT_KEYS } from '@mezon-tutors/shared/src/constants/home';

function BenefitItem({ label }: { label: string }) {
  return (
    <XStack gap="$homeStatsBenefitItemGap" alignItems="center">
      <YStack width="$homeBenefitDot" height="$homeBenefitDot" borderRadius="$appPill" backgroundColor="$homeSuccess" />
      <Text fontSize={16} lineHeight={24} color="$homeSectionTitle">
        {label}
      </Text>
    </XStack>
  );
}

export default function HomeBecomeTutorSection() {
  const t = useTranslations('Home.BecomeTutor');
  const media = useMedia();
  const isCompact = media.md || media.sm || media.xs;

  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      paddingVertical={isCompact ? 64 : 116}
      paddingHorizontal={isCompact ? 20 : 84}
      gap={isCompact ? 44 : 70}
      backgroundColor="$homePageBackground"
      flexDirection={isCompact ? 'column' : 'row'}
      style={{
        backgroundImage: 'var(--home-stats-backdrop-gradient)',
      }}
    >
      <YStack
        position="relative"
        flex={1}
        style={{
          animation: 'homeRevealUp 620ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <YStack
          className="home-glow-card home-feature-card home-stats-image"
          borderRadius="$homeFeatureCard"
          overflow="hidden"
          width={isCompact ? '100%' : 530}
          borderWidth={1}
          borderColor="$homeFeatureCardBorder"
        >
          <img
            src="/teach.jpg"
            alt="Become a tutor"
            style={{
              width: '100%',
              display: 'block',
              borderRadius: '22px',
            }}
          />
        </YStack>

        <YStack
          position="absolute"
          top="$5"
          left="$5"
          paddingVertical="$2.5"
          paddingHorizontal="$4"
          borderRadius="$homeStatsBadge"
          gap="$1"
          backgroundColor="$homeFeatureExploreBackground"
          borderWidth={1}
          borderColor="$homeFeatureExploreBorder"
          style={{
            boxShadow: 'var(--home-seamless-card-shadow)',
          }}
        >
          <Text fontSize={24} lineHeight={30} fontWeight="900" color="$myLessonsPrimaryButton" margin={0}>
            {t('badgeAmount')}
          </Text>
          <Text fontSize={12} lineHeight={18} color="$homeSectionBody">
            {t('badgeLabel')}
          </Text>
        </YStack>
      </YStack>

      <YStack
        flex={1}
        maxWidth={550}
        style={{
          animation: 'homeRevealUp 760ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <XStack flexWrap="wrap" alignItems="baseline" gap="$2">
          <Text
            fontSize={isCompact ? 38 : 52}
            fontWeight="800"
            lineHeight={isCompact ? 46 : 62}
            color="$homeSectionTitle"
            style={{ letterSpacing: '-0.8px' }}
          >
            {t('title')}
          </Text>
          <Text
            fontSize={isCompact ? 38 : 52}
            fontWeight="800"
            lineHeight={isCompact ? 46 : 62}
            color="$myLessonsPrimaryButton"
            style={{ letterSpacing: '-0.8px' }}
          >
            {t('titleHighlight')}
          </Text>
        </XStack>

        <Text fontSize={16} lineHeight={27} color="$homeSectionBody" marginTop="$4.5">
          {t('description')}
        </Text>

        <YStack marginTop="$6" gap="$homeStatsBenefitGap">
          {HOME_BECOME_TUTOR_BENEFIT_KEYS.map((benefitKey) => (
            <BenefitItem key={benefitKey} label={t(`benefits.${benefitKey}` as never)} />
          ))}
        </YStack>

        <Link href={ROUTES.BECOME_TUTOR.INDEX} style={{ textDecoration: 'none' }}>
          <Button
            marginTop="$8"
            paddingVertical="$4"
            paddingHorizontal="$7.5"
            borderRadius="$appPill"
            fontWeight="700"
            backgroundColor="$myLessonsPrimaryButton"
            color="$myLessonsPrimaryButtonText"
            borderWidth={0}
            hoverStyle={{
              y: -2,
              backgroundColor: '$myLessonsPrimaryButtonHover',
              scale: 1.01,
            }}
            pressStyle={{ y: 0 }}
            style={{
              cursor: 'pointer',
              boxShadow: 'var(--home-primary-button-shadow)',
              transition: 'all 360ms cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            {t('registerButton')}
          </Button>
        </Link>
      </YStack>
    </XStack>
  );
}
