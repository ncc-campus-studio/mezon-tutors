import { useQuery } from '@tanstack/react-query';
import { myLessonsService } from '@mezon-tutors/app/services/my-lessons.service';
import type dayjs from 'dayjs';

export function useMyLessons(studentMezonUserId: string | undefined, selectedDate: dayjs.Dayjs) {
  const dayOfWeek = selectedDate.day();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = selectedDate.subtract(mondayOffset, 'day').startOf('day');
  const weekStartDate = monday.format('YYYY-MM-DD');

  return useQuery({
    queryKey: ['my-lessons', studentMezonUserId, weekStartDate],
    queryFn: () => myLessonsService.getOverview(studentMezonUserId ?? '', weekStartDate),
    enabled: !!studentMezonUserId,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: true,
  });
}
