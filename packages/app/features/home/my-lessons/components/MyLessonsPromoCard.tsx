import { Button, Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { useTranslations } from 'next-intl';
import { useMedia } from 'tamagui';

export function MyLessonsPromoCard() {
  const t = useTranslations('MyLessons');
  const media = useMedia();
  const isCompact = media.md || media.sm || media.xs;

  return (
    <XStack
      width="100%"
      borderWidth={1}
      borderColor="$myLessonsCardBorder"
      borderRadius={16}
      backgroundColor="$myLessonsCardBackground"
      padding={isCompact ? '$3' : '$4'}
      gap="$4"
      alignItems="center"
      flexDirection={isCompact ? 'column' : 'row'}
    >
      <YStack flex={1} gap="$2">
        <Text
          color="$myLessonsPromoTitle"
          fontSize={isCompact ? 20 : 28}
          lineHeight={isCompact ? 24 : 34}
          fontWeight="500"
        >
          {t('promo.title')}
        </Text>
        <Text color="$myLessonsPromoDescription" fontSize={14} lineHeight={22} maxWidth={540}>
          {t('promo.description')}
        </Text>
        <Button
          variant="tertiary"
          backgroundColor="$myLessonsPromoButtonBg"
          borderColor="$myLessonsPromoButtonBorder"
          color="$myLessonsPromoButtonText"
          width={isCompact ? '100%' : 160}
          marginTop="$2"
          hoverStyle={{
            backgroundColor: '$myLessonsPromoButtonHover',
            borderColor: '$myLessonsPromoButtonHover',
          }}
        >
          {t('promo.scheduleButton')}
        </Button>
      </YStack>

      <YStack
        width={isCompact ? '100%' : 420}
        minHeight={120}
        borderRadius={18}
        overflow="hidden"
        backgroundColor="$myLessonsPromoVisualBg"
        position="relative"
      >
        <YStack
          position="absolute"
          width="100%"
          height="100%"
          backgroundColor="$myLessonsPromoVisualOverlay"
        />
        <YStack
          position="absolute"
          bottom={-8}
          left={130}
          width={12}
          height={54}
          borderRadius={8}
          backgroundColor="$myLessonsPromoVisualStickOne"
        />
        <YStack
          position="absolute"
          bottom={-10}
          left={170}
          width={14}
          height={84}
          borderRadius={8}
          backgroundColor="$myLessonsPromoVisualStickTwo"
        />
      </YStack>
    </XStack>
  );
}
