import { useTranslations } from 'next-intl';
import { Text, YStack } from '@mezon-tutors/app/ui';
import {
  FeatureEveningClassesIcon,
  FeatureFlexibleWeekendsIcon,
  FeatureLearnViaMezonIcon,
} from '@mezon-tutors/app/ui/icons';
import { HomeFeatureItem, HOME_FEATURE_ICON_COMPONENTS } from '@mezon-tutors/shared';
import { useTheme } from 'tamagui';

type HomeFeatureCardProps = {
  feature: HomeFeatureItem;
  isCompact?: boolean;
};

const HOME_FEATURE_ICON_REGISTRY = {
  FeatureEveningClassesIcon,
  FeatureFlexibleWeekendsIcon,
  FeatureLearnViaMezonIcon,
} as const;

export default function HomeFeatureCard({ feature, isCompact = false }: HomeFeatureCardProps) {
  const t = useTranslations('Home.Features');
  const theme = useTheme();
  const iconName = HOME_FEATURE_ICON_COMPONENTS[feature.iconKey];
  const Icon = HOME_FEATURE_ICON_REGISTRY[iconName];

  return (
    <YStack
      className="home-glow-card home-feature-card"
      padding={isCompact ? '$homeFeatureCardPaddingCompact' : '$homeFeatureCardPadding'}
      borderRadius="$homeFeatureCard"
      borderWidth={1}
      borderColor="$homeFeatureCardBorder"
      backgroundColor="$homeFeatureCardBackground"
      width="100%"
      style={{
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <YStack
        width="$homeFeatureIcon"
        height="$homeFeatureIcon"
        alignItems="center"
        justifyContent="center"
        marginBottom="$homeFeatureIconMargin"
        className="feature-icon-wrapper"
      >
        <Icon 
          width={96} 
          height={96}
          color={theme.homeFeatureIconCircle?.get()}
          primary={theme.homeFeatureIconGlyph?.get()}
          aria-label={t(feature.titleKey)} 
        />
      </YStack>

      <YStack flex={1} width="100%">
        <Text fontSize={22} lineHeight={30} fontWeight="700" marginBottom="$2.5" color="$homeSectionTitle">
          {t(feature.titleKey)}
        </Text>
        <Text fontSize={16} lineHeight={25} color="$homeSectionBody">
          {t(feature.descriptionKey)}
        </Text>
      </YStack>
    </YStack>
  );
}
