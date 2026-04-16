import { useQuery } from '@tanstack/react-query';
import { myScheduleService } from '@mezon-tutors/app/services/my-schedule.service';
import type dayjs from 'dayjs';

export function useMySchedule(tutorMezonUserId: string | undefined, selectedDate: dayjs.Dayjs) {
  const dayOfWeek = selectedDate.day();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = selectedDate.subtract(mondayOffset, 'day').startOf('day');
  const weekStartDate = monday.format('YYYY-MM-DD');

  return useQuery({
    queryKey: ['my-schedule', tutorMezonUserId, weekStartDate],
    queryFn: () => myScheduleService.getSchedule(tutorMezonUserId, weekStartDate),
    enabled: !!tutorMezonUserId,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: true,
  });
}
