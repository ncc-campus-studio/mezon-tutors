import { YStack } from '@mezon-tutors/app/ui';
import type dayjs from 'dayjs';
import { MiniCalendar } from './MiniCalendar';
import { WeeklyInsight } from './WeeklyInsight';

type MyScheduleSidebarProps = {
  selectedDate: dayjs.Dayjs;
  onDateSelect: (date: dayjs.Dayjs) => void;
};

export function MyScheduleSidebar({ selectedDate, onDateSelect }: MyScheduleSidebarProps) {
  return (
    <YStack width={240} gap="$3" flexShrink={0}>
      <MiniCalendar selectedDate={selectedDate} onDateSelect={onDateSelect} />
      <WeeklyInsight />
    </YStack>
  );
}
