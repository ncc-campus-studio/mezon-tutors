import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { isAuthenticatedAtom } from '@mezon-tutors/app/store/auth.atom';
import { myLessonsService } from '@mezon-tutors/app/services/my-lessons.service';
import type dayjs from 'dayjs';

export function useMyLessons(selectedDate: dayjs.Dayjs) {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const dayOfWeek = selectedDate.day();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = selectedDate.subtract(mondayOffset, 'day').startOf('day');
  const weekStartDate = monday.format('YYYY-MM-DD');

  return useQuery({
    queryKey: ['my-lessons', weekStartDate],
    queryFn: () => myLessonsService.getOverview(weekStartDate),
    enabled: isAuthenticated,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: true,
  });
}
