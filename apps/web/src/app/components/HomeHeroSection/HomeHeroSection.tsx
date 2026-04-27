import { useTranslations } from 'next-intl';
import { Text, Button, YStack, XStack, useMedia } from '@mezon-tutors/app/ui';
import { TutorVideoCardIcon, FlashIcon, PlayIcon, StarIcon, WatchDemoIcon } from '@mezon-tutors/app/ui/icons';
import { HOME_HERO_CARD } from '@mezon-tutors/shared';

export default function HomeHeroSection() {
  const t = useTranslations('Home.Hero');
  const media = useMedia();
  const isCompact = media.md || media.sm || media.xs;
  const isTiny = media.xs;

  return (
    <XStack
      minHeight={isCompact ? 'auto' : 'calc(100vh - 80px)'}
      alignItems="center"
      justifyContent="center"
      gap={isCompact ? 42 : 72}
      paddingTop={isCompact ? 48 : 72}
      paddingBottom={isCompact ? 72 : 96}
      paddingHorizontal={isCompact ? 20 : 84}
      backgroundColor="$homeHeroBackground"
      flexDirection={isCompact ? 'column' : 'row'}
      position="relative"
      overflow="hidden"
      style={{
        backgroundImage: 'var(--home-hero-backdrop-gradient)',
        transition: 'background-image 520ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <YStack
        position="absolute"
        top={-70}
        right={-80}
        width={260}
        height={260}
        borderRadius={999}
        pointerEvents="none"
        style={{
          background: 'var(--home-hero-orb-primary)',
          filter: 'blur(60px)',
          animation: 'homePulse 7s ease-in-out infinite',
        }}
      />
      <YStack
        position="absolute"
        bottom={-120}
        left={-120}
        width={300}
        height={300}
        borderRadius={999}
        pointerEvents="none"
        style={{
          background: 'var(--home-hero-orb-secondary)',
          filter: 'blur(70px)',
          animation: 'homePulse 8.5s ease-in-out infinite 0.8s)',
        }}
      />

      <YStack
        width={isCompact ? '100%' : '52%'}
        minWidth={0}
        maxWidth={isCompact ? '100%' : 560}
        gap="$4"
        style={{
          animation: 'homeRevealUp 620ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <XStack
          className="home-hero-badge"
          paddingVertical="$2"
          paddingHorizontal="$3.5"
          borderRadius="$appPill"
          alignSelf="flex-start"
          alignItems="center"
          gap="$2"
          backgroundColor="$homeHeroBadgeBackground"
          borderWidth={1}
          borderColor="$homeFeatureExploreBorder"
        >
          <YStack width="$homeHeroFlashIcon" height="$homeHeroFlashIcon">
            <FlashIcon width={16} height={16} aria-label="flash" />
          </YStack>
          <Text fontSize={12} lineHeight={18} fontWeight="700" color="$homeHeroBadgeText">
            {t('badge')}
          </Text>
        </XStack>

        <YStack marginTop={20}>
          <Text
            fontSize={isTiny ? 42 : isCompact ? 48 : 66}
            fontWeight="800"
            lineHeight={isTiny ? 50 : isCompact ? 56 : 74}
            color="$homeSectionTitle"
            letterSpacing={-1}
          >
            {t('title')}
          </Text>
          <Text
            fontSize={isTiny ? 42 : isCompact ? 48 : 66}
            fontWeight="800"
            lineHeight={isTiny ? 50 : isCompact ? 56 : 74}
            color="$myLessonsPrimaryButton"
            className="home-hero-highlight-line"
            letterSpacing={-1}
          >
            {t('titleHighlight')}
          </Text>
        </YStack>

        <Text fontSize={17} lineHeight={28} color="$homeSectionBody" marginTop={18} maxWidth={520}>
          {t('description')}
        </Text>

        <XStack gap="$4" flexWrap="wrap" marginTop="$7.5">
          <Button
            paddingVertical="$3.5"
            paddingHorizontal="$7.5"
            borderRadius="$appPill"
            fontWeight="700"
            backgroundColor="$myLessonsPrimaryButton"
            color="$myLessonsPrimaryButtonText"
            borderWidth={0}
            style={{
              cursor: 'pointer',
              boxShadow: 'var(--home-primary-button-shadow)',
              transition: 'all 320ms cubic-bezier(0.22,1,0.36,1)',
            }}
            hoverStyle={{
              backgroundColor: '$myLessonsPrimaryButtonHover',
              y: -3,
              scale: 1.015,
            }}
            pressStyle={{ y: 0, scale: 0.995 }}
          >
            {t('startNow')}
          </Button>

          <Button
            paddingVertical="$3.5"
            paddingHorizontal="$7.5"
            borderRadius="$appPill"
            fontWeight="700"
            borderWidth={1}
            borderColor="$homeFeatureExploreBorder"
            borderStyle="solid"
            color="$homeSectionTitle"
            backgroundColor="$homeFeatureExploreBackground"
            style={{
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
              transition: 'all 320ms cubic-bezier(0.22,1,0.36,1)',
            }}
            hoverStyle={{ y: -2, borderColor: '$myLessonsPrimaryButton', scale: 1.012 }}
            pressStyle={{ y: 0, scale: 0.995 }}
          >
            <XStack gap="$2" alignItems="center">
              <YStack width={20} height={20} className="home-demo-icon">
                <WatchDemoIcon width={20} height={20} aria-label="demo" />
              </YStack>
              <Text fontWeight="700" lineHeight={22} color="$homeSectionTitle">
                {t('watchDemo')}
              </Text>
            </XStack>
          </Button>
        </XStack>
      </YStack>

      <YStack
        width={isCompact ? '100%' : '48%'}
        maxWidth={isCompact ? 420 : 540}
        alignItems="center"
        justifyContent="center"
        style={{
          animation: 'homeRevealUp 740ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <YStack position="relative">
          <YStack
            width={isCompact ? 320 : 398}
            height={isCompact ? 428 : 526}
            borderRadius="$homeHeroCard"
            overflow="hidden"
            borderWidth={1}
            borderColor="$homeHeroCardBorder"
            position="relative"
            style={{
              transform: 'rotate(1.35deg)',
              boxShadow: 'var(--home-hero-card-shadow)',
              animation: 'homeFloatY 6.8s ease-in-out infinite',
              willChange: 'transform',
              transition: 'transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms cubic-bezier(0.22,1,0.36,1)',
            }}
            hoverStyle={{ y: -6, scale: 1.01 }}
          >
            <img
              src={HOME_HERO_CARD.image}
              alt={HOME_HERO_CARD.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />

            <YStack
              position="absolute"
              bottom={0}
              left={0}
              width="100%"
              height="64%"
              style={{
                background: 'var(--home-hero-image-overlay-gradient)',
                zIndex: 1,
              }}
            />

            <YStack position="absolute" bottom={0} left={0} padding="$5" width="100%" style={{ zIndex: 2 }}>
              <XStack gap="$2.5" marginBottom="$2" alignItems="center">
                <XStack
                  paddingVertical="$1.5"
                  paddingHorizontal="$3"
                  borderRadius="$appPill"
                  alignItems="center"
                  gap="$1.5"
                  backgroundColor="$homeHeroChipBackground"
                  style={{
                    width: 'fit-content',
                    boxShadow: 'var(--home-hero-chip-shadow)',
                  }}
                >
                  <Text fontSize={12} lineHeight={18} fontWeight="700" color="$homeHeroChipText">
                    {HOME_HERO_CARD.match}% {t('match')}
                  </Text>
                </XStack>

                <XStack
                  gap="$1.5"
                  alignItems="center"
                  paddingVertical="$1"
                  paddingHorizontal="$2"
                  borderRadius="$appPill"
                  backgroundColor="$homeHeroStatBackground"
                  borderWidth={1}
                  borderColor="$homeHeroGlassBorder"
                >
                  <StarIcon width={14} height={14} aria-label="star" />
                  <Text fontSize={13} lineHeight={18} fontWeight="700" color="$homeHeroStatText">
                    {HOME_HERO_CARD.rating}
                  </Text>
                </XStack>
              </XStack>

              <Text
                fontSize={isCompact ? 28 : 30}
                lineHeight={isCompact ? 34 : 36}
                fontWeight="800"
                color="$homeHeroChipText"
                marginVertical="$1.5"
                style={{
                  textShadow: 'var(--home-hero-name-text-shadow)',
                  animation: 'homeFloatYSoft 4.6s ease-in-out infinite 0.6s',
                }}
              >
                {HOME_HERO_CARD.name}
              </Text>
              <Text fontSize={13} lineHeight={20} marginBottom="$3.5" style={{ color: 'var(--home-hero-card-description-color)' }}>
                {HOME_HERO_CARD.description}
              </Text>

              <XStack gap="$2.5">
                <Button
                  flex={1}
                  paddingVertical="$2.5"
                  borderRadius="$homeHeroButton"
                  fontWeight="600"
                  fontSize={14}
                  color="$homeHeroChipText"
                  backgroundColor="$homeHeroStatBackground"
                  borderWidth={1}
                  borderColor="$homeHeroGlassBorder"
                  borderStyle="solid"
                  style={{
                    backdropFilter: 'blur(8px)',
                    letterSpacing: '0.2px',
                    transition: 'all 260ms cubic-bezier(0.22,1,0.36,1)',
                  }}
                  hoverStyle={{ backgroundColor: '$homeHeroGlassBackground', y: -1 }}
                >
                  {t('profile')}
                </Button>
                <Button
                  flex={1}
                  paddingVertical="$2.5"
                  borderRadius="$homeHeroButton"
                  fontWeight="700"
                  fontSize={14}
                  color="$myLessonsPrimaryButtonText"
                  backgroundColor="$myLessonsPrimaryButton"
                  borderWidth={0}
                  style={{
                    letterSpacing: '0.2px',
                    boxShadow: 'var(--home-hero-connect-button-shadow)',
                    transition: 'all 260ms cubic-bezier(0.22,1,0.36,1)',
                  }}
                  hoverStyle={{ y: -1, scale: 1.01, backgroundColor: '$myLessonsPrimaryButtonHover' }}
                >
                  {t('connect')}
                </Button>
              </XStack>
            </YStack>
          </YStack>

          {!isCompact && (
            <YStack
              position="absolute"
              bottom={-6}
              right={-116}
              width={202}
              height={114}
              borderRadius="$4"
              overflow="hidden"
              borderWidth={1}
              borderColor="$homeHeroVideoBorder"
              style={{
                transform: 'rotate(1deg)',
                boxShadow: 'var(--home-hero-video-shadow)',
                animation: 'homeFloatYSoft 5.6s ease-in-out infinite 0.9s',
                zIndex: 3,
              }}
            >
              <TutorVideoCardIcon width="100%" height="100%" aria-label="video" />

              <YStack
                position="absolute"
                top="50%"
                left="50%"
                width="$homeHeroVideoPlayIcon"
                height="$homeHeroVideoPlayIcon"
                alignItems="center"
                justifyContent="center"
                borderRadius="$appPill"
                backgroundColor="$homeHeroGlassBackground"
                borderWidth={1}
                borderColor="$homeHeroGlassBorder"
                style={{ transform: 'translate(-50%, -50%)', backdropFilter: 'blur(6px)' }}
              >
                <PlayIcon width="62%" height="62%" aria-label="play" />
              </YStack>
            </YStack>
          )}
        </YStack>
      </YStack>
    </XStack>
  );
}
