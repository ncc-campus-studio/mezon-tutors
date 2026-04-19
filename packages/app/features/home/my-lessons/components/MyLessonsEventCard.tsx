import { Text, YStack } from '@mezon-tutors/app/ui';
import { getCategoryTheme } from '../category-theme';
import type { LessonItem } from '../types';

type MyLessonsEventCardProps = {
  lesson: LessonItem;
  isCompact: boolean;
};

export function MyLessonsEventCard({ lesson, isCompact }: MyLessonsEventCardProps) {
  const theme = getCategoryTheme(lesson.category);
  const eventWidth = isCompact ? 122 : 136;

  return (
    <YStack
      width={eventWidth}
      maxWidth="100%"
      minWidth={0}
      alignSelf="flex-start"
      marginTop={2}
      borderRadius={12}
      backgroundColor={theme.background}
      borderWidth={1}
      borderColor="$myLessonsEventBorder"
      padding={isCompact ? '$1.5' : '$2'}
      gap={4}
      justifyContent="center"
      minHeight={isCompact ? 50 : 56}
      overflow="hidden"
    >
      <Text
        color={theme.label}
        fontSize={10}
        fontWeight="700"
        textTransform="uppercase"
        letterSpacing={0.7}
        numberOfLines={1}
      >
        {lesson.subject}
      </Text>
      <Text color="$myLessonsEventTutor" fontSize={12} fontWeight="500" numberOfLines={1}>
        {lesson.tutor}
      </Text>
      <Text color="$myLessonsEventTime" fontSize={10} numberOfLines={1}>
        {lesson.timeLabel}
      </Text>
    </YStack>
  );
}
