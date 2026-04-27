import { YStack } from '@mezon-tutors/app/ui';
import type { LessonItem, MyLessonsCalendarMeta } from '../types';
import { MyLessonsCalendarCard } from './MyLessonsCalendarCard';

type MyLessonsCalendarSectionProps = {
  calendar: MyLessonsCalendarMeta;
  lessons: LessonItem[];
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
};

export function MyLessonsCalendarSection({ calendar, lessons, onPrevWeek, onNextWeek }: MyLessonsCalendarSectionProps) {
  return (
    <YStack gap="$5" width="100%" maxWidth={1032} minWidth={0} alignSelf="center">
      <MyLessonsCalendarCard lessons={lessons} calendar={calendar} onPrevWeek={onPrevWeek} onNextWeek={onNextWeek} />
    </YStack>
  );
}
