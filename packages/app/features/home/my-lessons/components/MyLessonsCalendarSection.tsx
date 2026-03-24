import { YStack } from '@mezon-tutors/app/ui';
import type { LessonItem, MyLessonsCalendarMeta } from '../types';
import { MyLessonsCalendarCard } from './MyLessonsCalendarCard';
import { MyLessonsPromoCard } from './MyLessonsPromoCard';

type MyLessonsCalendarSectionProps = {
  calendar: MyLessonsCalendarMeta;
  lessons: LessonItem[];
};

export function MyLessonsCalendarSection({ calendar, lessons }: MyLessonsCalendarSectionProps) {
  return (
    <YStack gap="$5" width="100%" maxWidth={1032} minWidth={0} alignSelf="center">
      <MyLessonsPromoCard />
      <MyLessonsCalendarCard lessons={lessons} calendar={calendar} />
    </YStack>
  );
}
