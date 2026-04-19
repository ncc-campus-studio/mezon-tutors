import { useTranslations } from 'next-intl';
import { Text, YStack, XStack } from '@mezon-tutors/app/ui';
import { SeamlessInstantMessagingIcon, SeamlessVirtualClassroomIcon } from '@mezon-tutors/app/ui/icons';
import { HomeSeamlessFeatureItem, HOME_SEAMLESS_ICON_COMPONENTS } from '@mezon-tutors/shared';

type HomeSeamlessCardProps = {
  feature: HomeSeamlessFeatureItem;
};

const HOME_SEAMLESS_ICON_REGISTRY = {
  SeamlessVirtualClassroomIcon,
  SeamlessInstantMessagingIcon,
} as const;

export default function HomeSeamlessCard({ feature }: HomeSeamlessCardProps) {
  const t = useTranslations('Home.Seamless');
  const iconName = HOME_SEAMLESS_ICON_COMPONENTS[feature.iconKey];
  const Icon = HOME_SEAMLESS_ICON_REGISTRY[iconName];

  return (
    <XStack
      className="home-glow-card home-feature-card"
      gap="$homeSeamlessCardInnerGap"
      padding="$homeSeamlessCardPadding"
      borderRadius="$homeSeamlessCard"
      borderWidth={1}
      borderColor="$homeSeamlessBorder"
      backgroundColor="$homeSeamlessSurface"
    >
      <YStack
        width="$homeSeamlessIcon"
        height="$homeSeamlessIcon"
        borderRadius="$appPill"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        backgroundColor="$homeSeamlessIconBackground"
        borderWidth={1}
        borderColor="$homeFeatureIconBorder"
      >
        <Icon width={24} height={24} aria-label={t(feature.titleKey)} />
      </YStack>

      <YStack flex={1}>
        <Text fontSize={19} lineHeight={27} fontWeight="700" color="$homeSectionTitle" marginBottom="$2">
          {t(feature.titleKey)}
        </Text>
        <Text fontSize={14} lineHeight={22} color="$homeSectionBody">
          {t(feature.descriptionKey)}
        </Text>
      </YStack>
    </XStack>
  );
}
