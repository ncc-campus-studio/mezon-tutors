import { Button, Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { CompassIcon } from '@mezon-tutors/app/ui/icons';
import { useTranslations } from 'next-intl';
import { Image, useMedia, useTheme } from 'tamagui';
import type { TutorItem } from '../types';

function getInitials(name: string): string {
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) {
    return 'NA';
  }

  return tokens
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? '')
    .join('');
}

function TutorCard({ tutor }: { tutor: TutorItem }) {
  const t = useTranslations('MyLessons');
  const displayNextLesson = tutor.nextLessonLabel || t('panels.tutors.unscheduled');
  const avatarUri = tutor.avatar?.trim() || '';

  return (
    <XStack
      width="100%"
      borderWidth={1}
      borderColor="$myLessonsLessonsCardBorder"
      borderRadius={12}
      backgroundColor="$myLessonsLessonsCardBackground"
      padding="$3"
      gap="$3"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
    >
      <XStack alignItems="center" gap="$3" flex={1} minWidth={260}>
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            width={64}
            height={64}
            borderRadius={12}
            accessibilityLabel={tutor.name}
          />
        ) : (
          <YStack
            width={64}
            height={64}
            borderRadius={12}
            alignItems="center"
            justifyContent="center"
            backgroundColor="$myLessonsAvatarBackground"
            borderWidth={1}
            borderColor="$myLessonsAvatarBorder"
          >
            <Text color="$myLessonsAvatarText" fontSize={20} fontWeight="700">
              {getInitials(tutor.name)}
            </Text>
          </YStack>
        )}

        <YStack gap={2} flex={1} minWidth={180}>
          <Text color="$myLessonsLessonsPrimaryText" fontSize={22} lineHeight={26} fontWeight="800">
            {tutor.name}
          </Text>
          <Text color="$myLessonsNavActive" fontSize={13} lineHeight={18} fontWeight="700">
            {tutor.teaches}
          </Text>

          <XStack marginTop="$1" gap="$4" flexWrap="wrap">
            <YStack gap={2}>
              <Text color="$myLessonsLessonsMutedText" fontSize={10} fontWeight="700" textTransform="uppercase">
                {t('panels.tutors.completed')}
              </Text>
              <Text color="$myLessonsLessonsPrimaryText" fontSize={15} fontWeight="700">
                {t('panels.tutors.lessonsCount', { count: tutor.completedLessons })}
              </Text>
            </YStack>

            <YStack gap={2}>
              <Text color="$myLessonsLessonsMutedText" fontSize={10} fontWeight="700" textTransform="uppercase">
                {t('panels.tutors.nextLesson')}
              </Text>
              <Text color="$myLessonsLessonsPrimaryText" fontSize={15} fontWeight="700">
                {displayNextLesson}
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </XStack>

      <YStack marginLeft="auto" alignItems="flex-end" gap="$2.5">
        <XStack alignItems="center" gap="$1.5">
          <Text color="$myLessonsLessonsRatingText" fontSize={13} fontWeight="700">
            {'☆'}
          </Text>
          <Text color="$myLessonsLessonsPrimaryText" fontSize={13} fontWeight="700">
            {tutor.ratingAverage.toFixed(1)}
          </Text>
          <Text color="$myLessonsLessonsMutedText" fontSize={11}>
            {t('panels.tutors.reviewCount', { count: tutor.reviewCount })}
          </Text>
        </XStack>

        <Button
          variant="primary"
          backgroundColor="$myLessonsPrimaryButton"
          borderColor="$myLessonsPrimaryButtonBorder"
          color="$myLessonsPrimaryButtonText"
          borderRadius={999}
          paddingHorizontal="$4"
          height={34}
          fontSize={12}
          fontWeight="700"
        >
          {t('panels.tutors.schedule')}
        </Button>

        <Button
          chromeless
          backgroundColor="$myLessonsLessonsActionSecondaryBg"
          borderWidth={1}
          borderColor="$myLessonsLessonsActionSecondaryBorder"
          color="$myLessonsLessonsActionSecondaryText"
          borderRadius={999}
          paddingHorizontal="$4"
          height={34}
          fontSize={12}
          fontWeight="700"
        >
          {t('panels.tutors.message')}
        </Button>

        <Text color="$myLessonsLessonsMutedText" fontSize={18} lineHeight={18} paddingHorizontal={6}>
          ...
        </Text>
      </YStack>
    </XStack>
  );
}

function DiscoverCard() {
  const t = useTranslations('MyLessons');
  const theme = useTheme();

  return (
    <YStack
      width="100%"
      marginTop="$2"
      borderWidth={1}
      borderStyle="dashed"
      borderColor="$myLessonsLessonsCardBorder"
      borderRadius={14}
      backgroundColor="$myLessonsLessonsEmptyBackground"
      alignItems="center"
      justifyContent="center"
      padding="$6"
      gap="$2.5"
    >
      <YStack
        width={30}
        height={30}
        borderRadius={999}
        alignItems="center"
        justifyContent="center"
        backgroundColor="$myLessonsLessonsRatingBackground"
      >
        <CompassIcon size={16} color={theme.myLessonsLessonsRatingText?.get() ?? '#2F7CFF'} />
      </YStack>

      <Text color="$myLessonsLessonsPrimaryText" fontSize={24} lineHeight={28} fontWeight="700" textAlign="center">
        {t('panels.tutors.discoverTitle')}
      </Text>
      <Text color="$myLessonsLessonsSecondaryText" fontSize={13} textAlign="center" maxWidth={560}>
        {t('panels.tutors.discoverDescription')}
      </Text>

      <XStack gap="$2.5" marginTop="$2" flexWrap="wrap" justifyContent="center">
        <Button
          variant="primary"
          backgroundColor="$myLessonsPrimaryButton"
          borderColor="$myLessonsPrimaryButtonBorder"
          color="$myLessonsPrimaryButtonText"
          borderRadius={999}
          paddingHorizontal="$4"
          height={36}
          fontSize={12}
          fontWeight="700"
        >
          {t('panels.tutors.findTutors')}
        </Button>

        <Button
          chromeless
          backgroundColor="$myLessonsLessonsActionSecondaryBg"
          borderWidth={1}
          borderColor="$myLessonsLessonsActionSecondaryBorder"
          color="$myLessonsLessonsActionSecondaryText"
          borderRadius={999}
          paddingHorizontal="$4"
          height={36}
          fontSize={12}
          fontWeight="700"
        >
          {t('panels.tutors.viewSubjects')}
        </Button>
      </XStack>
    </YStack>
  );
}

type MyLessonsTutorsPanelProps = {
  tutors: TutorItem[];
};

export function MyLessonsTutorsPanel({ tutors }: MyLessonsTutorsPanelProps) {
  const t = useTranslations('MyLessons');
  const media = useMedia();
  const isCompact = media.md || media.sm || media.xs;

  return (
    <YStack width="100%" maxWidth={1032} alignSelf="center" gap="$5">
      <XStack
        width="100%"
        justifyContent="space-between"
        alignItems={isCompact ? 'flex-start' : 'center'}
        flexDirection={isCompact ? 'column' : 'row'}
        gap="$3"
      >
        <YStack gap={2}>
          <Text color="$myLessonsLessonsSectionTitle" fontSize={42} lineHeight={44} fontWeight="800">
            {t('panels.tutors.title')}
          </Text>
          <Text color="$myLessonsLessonsSecondaryText" fontSize={13}>
            {t('panels.tutors.subtitle', { count: tutors.length })}
          </Text>
        </YStack>

        <Button
          variant="primary"
          backgroundColor="$myLessonsPrimaryButton"
          borderColor="$myLessonsPrimaryButtonBorder"
          color="$myLessonsPrimaryButtonText"
          borderRadius={999}
          paddingHorizontal="$4"
          height={38}
          fontSize={12}
          fontWeight="700"
        >
          {t('panels.tutors.findNewTutors')}
        </Button>
      </XStack>

      <YStack gap="$3">
        {tutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </YStack>

      <DiscoverCard />
    </YStack>
  );
}
