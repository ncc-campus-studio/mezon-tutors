import { Button, Text, XStack, YStack } from '@mezon-tutors/app/ui';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Image } from 'tamagui';
import type { LessonItem } from '../types';

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

function LessonPersonBadge({ name, avatar }: { name: string; avatar?: string }) {
  const avatarUri = avatar?.trim() || '';

  return (
    <YStack
      width={40}
      height={40}
      borderRadius={999}
      alignItems="center"
      justifyContent="center"
      backgroundColor="$myLessonsAvatarBackground"
      borderWidth={1}
      borderColor="$myLessonsAvatarBorder"
      overflow="hidden"
    >
      {avatarUri ? (
        <Image source={{ uri: avatarUri }} width={40} height={40} borderRadius={999} accessibilityLabel={name} />
      ) : (
        <Text color="$myLessonsAvatarText" fontSize={11} fontWeight="700">
          {getInitials(name)}
        </Text>
      )}
    </YStack>
  );
}

function PastLessonListItem({
  lesson,
  rateLabel,
  ratedLabel,
}: {
  lesson: LessonItem;
  rateLabel: string;
  ratedLabel: string;
}) {
  const rated = lesson.status === 'completed';

  return (
    <XStack
      width="100%"
      borderWidth={1}
      borderColor="$myLessonsLessonsCardBorder"
      borderRadius={10}
      backgroundColor="$myLessonsLessonsCardBackground"
      paddingHorizontal="$3"
      paddingVertical="$2.5"
      justifyContent="space-between"
      alignItems="center"
      gap="$3"
      flexWrap="wrap"
    >
      <XStack alignItems="center" gap="$2.5" flex={1} minWidth={220}>
        <LessonPersonBadge name={lesson.tutor} avatar={lesson.tutorAvatar} />
        <YStack gap={2}>
          <Text color="$myLessonsLessonsPrimaryText" fontSize={12} lineHeight={16} fontWeight="700">
            {lesson.dateLabel} - {lesson.timeLabel}
          </Text>
          <Text color="$myLessonsLessonsSecondaryText" fontSize={12} lineHeight={16}>
            {lesson.subject} - {lesson.tutor}
          </Text>
        </YStack>
      </XStack>

      <XStack alignItems="center" gap="$2">
        {rated ? (
          <YStack
            borderWidth={1}
            borderColor="$myLessonsLessonsRatingBorder"
            borderRadius={8}
            paddingHorizontal="$2"
            paddingVertical="$1"
            backgroundColor="$myLessonsLessonsRatingBackground"
            alignItems="center"
          >
            <Text color="$myLessonsLessonsRatingText" fontSize={11} fontWeight="700">
              {'☆ 4.8'}
            </Text>
            <Text color="$myLessonsLessonsRatingText" fontSize={10} fontWeight="600">
              {ratedLabel}
            </Text>
          </YStack>
        ) : (
          <Button
            chromeless
            backgroundColor="$myLessonsLessonsActionSecondaryBg"
            borderWidth={1}
            borderColor="$myLessonsLessonsActionSecondaryBorder"
            borderRadius={8}
            paddingHorizontal="$2.5"
            paddingVertical="$1.5"
            color="$myLessonsLessonsActionSecondaryText"
            fontSize={11}
            fontWeight="600"
          >
            {`☆ ${rateLabel}`}
          </Button>
        )}

        <Text color="$myLessonsLessonsMutedText" fontSize={18} lineHeight={18} paddingHorizontal={4}>
          ...
        </Text>
      </XStack>
    </XStack>
  );
}

function UpcomingLessonItem({
  lesson,
  rescheduleOrCancelLabel,
  joinLessonLabel,
}: {
  lesson: LessonItem;
  rescheduleOrCancelLabel: string;
  joinLessonLabel: string;
}) {
  return (
    <XStack
      width="100%"
      borderWidth={1}
      borderColor="$myLessonsLessonsCardBorder"
      borderRadius={10}
      backgroundColor="$myLessonsLessonsCardBackground"
      paddingHorizontal="$3"
      paddingVertical="$2.5"
      justifyContent="space-between"
      alignItems="center"
      gap="$3"
      flexWrap="wrap"
    >
      <XStack alignItems="center" gap="$2.5" flex={1} minWidth={220}>
        <LessonPersonBadge name={lesson.tutor} avatar={lesson.tutorAvatar} />
        <YStack gap={2}>
          <Text color="$myLessonsLessonsPrimaryText" fontSize={12} lineHeight={16} fontWeight="700">
            {lesson.dateLabel}
          </Text>
          <Text color="$myLessonsLessonsPrimaryText" fontSize={18} lineHeight={22} fontWeight="800">
            {lesson.timeLabel}
          </Text>
          <Text color="$myLessonsLessonsSecondaryText" fontSize={12} lineHeight={16}>
            {lesson.subject} - {lesson.tutor}
          </Text>
        </YStack>
      </XStack>

      <XStack gap="$2" marginLeft="auto">
        <Button
          chromeless
          backgroundColor="$myLessonsLessonsActionSecondaryBg"
          borderWidth={1}
          borderColor="$myLessonsLessonsActionSecondaryBorder"
          borderRadius={8}
          paddingHorizontal="$3"
          paddingVertical="$2"
          color="$myLessonsLessonsActionSecondaryText"
          fontSize={12}
          fontWeight="600"
        >
          {rescheduleOrCancelLabel}
        </Button>

        <Button
          variant="primary"
          backgroundColor="$myLessonsLessonsActionPrimaryBg"
          borderColor="$myLessonsLessonsActionPrimaryBorder"
          color="$myLessonsLessonsActionPrimaryText"
          borderRadius={8}
          paddingHorizontal="$3.5"
          paddingVertical="$2"
          fontSize={12}
          fontWeight="700"
        >
          {joinLessonLabel}
        </Button>
      </XStack>
    </XStack>
  );
}

function EmptyUpcomingCard({
  scheduleNowLabel,
  noUpcomingLabel,
  noUpcomingHintLabel,
}: {
  scheduleNowLabel: string;
  noUpcomingLabel: string;
  noUpcomingHintLabel: string;
}) {
  return (
    <YStack
      width="100%"
      minHeight={220}
      borderWidth={1}
      borderColor="$myLessonsLessonsEmptyBorder"
      borderRadius={12}
      backgroundColor="$myLessonsLessonsEmptyBackground"
      alignItems="center"
      justifyContent="center"
      gap="$2"
      padding="$4"
    >
      <YStack
        width={28}
        height={28}
        borderWidth={2}
        borderColor="$myLessonsLessonsEmptyIcon"
        borderRadius={6}
        alignItems="center"
        justifyContent="center"
      >
        <YStack width={16} height={2} backgroundColor="$myLessonsLessonsEmptyIcon" marginBottom={3} />
        <YStack
          width={10}
          height={10}
          borderWidth={2}
          borderColor="$myLessonsLessonsEmptyIcon"
          borderRadius={3}
        />
      </YStack>

      <Text color="$myLessonsLessonsEmptyTitle" fontSize={28} fontWeight="700" lineHeight={34}>
        {noUpcomingLabel}
      </Text>
      <Text color="$myLessonsLessonsEmptyDescription" fontSize={14} textAlign="center" maxWidth={380}>
        {noUpcomingHintLabel}
      </Text>

      <Button
        variant="primary"
        backgroundColor="$myLessonsLessonsEmptyButtonBg"
        borderColor="$myLessonsLessonsEmptyButtonBorder"
        color="$myLessonsLessonsEmptyButtonText"
        borderRadius={8}
        marginTop="$2"
        paddingHorizontal="$4"
      >
        {scheduleNowLabel}
      </Button>
    </YStack>
  );
}

function LessonsSectionTitle({ title }: { title: string }) {
  return (
    <Text color="$myLessonsLessonsSectionTitle" fontSize={28} lineHeight={34} fontWeight="700">
      {title}
    </Text>
  );
}

function LessonsSection({
  title,
  lessons,
  emptyState,
  rescheduleOrCancelLabel,
  joinLessonLabel,
}: {
  title: string;
  lessons: LessonItem[];
  emptyState?: ReactNode;
  rescheduleOrCancelLabel: string;
  joinLessonLabel: string;
}) {
  return (
    <YStack gap="$3">
      <LessonsSectionTitle title={title} />

      <YStack gap="$2.5">
        {lessons.length ? (
          lessons.map((lesson) => (
            <UpcomingLessonItem
              key={lesson.id}
              lesson={lesson}
              rescheduleOrCancelLabel={rescheduleOrCancelLabel}
              joinLessonLabel={joinLessonLabel}
            />
          ))
        ) : (
          emptyState
        )}
      </YStack>
    </YStack>
  );
}

function PastLessonsSection({
  title,
  lessons,
  rateLabel,
  ratedLabel,
}: {
  title: string;
  lessons: LessonItem[];
  rateLabel: string;
  ratedLabel: string;
}) {
  return (
    <YStack gap="$3">
      <LessonsSectionTitle title={title} />

      <YStack gap="$2.5">
        {lessons.map((lesson) => (
          <PastLessonListItem key={lesson.id} lesson={lesson} rateLabel={rateLabel} ratedLabel={ratedLabel} />
        ))}
      </YStack>
    </YStack>
  );
}

type MyLessonsLessonsPanelProps = {
  upcomingLessons: LessonItem[];
  previousLessons: LessonItem[];
};

export function MyLessonsLessonsPanel({
  upcomingLessons,
  previousLessons,
}: MyLessonsLessonsPanelProps) {
  const t = useTranslations('MyLessons');

  return (
    <YStack gap="$6" width="100%" maxWidth={1032} alignSelf="center">
      <LessonsSection
        title={t('panels.lessons.upcoming.title')}
        lessons={upcomingLessons}
        rescheduleOrCancelLabel={t('panels.lessons.upcoming.rescheduleOrCancel')}
        joinLessonLabel={t('panels.lessons.upcoming.joinLesson')}
        emptyState={
          <EmptyUpcomingCard
            scheduleNowLabel={t('panels.lessons.upcoming.scheduleNow')}
            noUpcomingLabel={t('panels.lessons.upcoming.emptyTitle')}
            noUpcomingHintLabel={t('panels.lessons.upcoming.emptyDescription')}
          />
        }
      />

      <PastLessonsSection
        title={t('panels.lessons.past.title')}
        lessons={previousLessons}
        rateLabel={t('panels.lessons.past.rate')}
        ratedLabel={t('panels.lessons.past.rated')}
      />
    </YStack>
  );
}
