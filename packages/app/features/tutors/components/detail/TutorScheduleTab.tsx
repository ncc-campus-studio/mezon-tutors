import { CalendarCard } from '@mezon-tutors/app';
import type { CalendarEvent, CalendarWeekDay } from '@mezon-tutors/app';
import type { TutorDetailAvailabilitySlotDto } from '@mezon-tutors/shared';
import { getFallbackWeekHours } from '@mezon-tutors/shared';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import { useLocale, useTranslations } from 'next-intl';
import { useMedia } from 'tamagui';
import { TutorScheduleEventCard } from './TutorScheduleEventCard';
import type { TutorScheduleTabProps } from './types';

dayjs.extend(customParseFormat);

function buildTutorScheduleWeekDays(locale: string): CalendarWeekDay[] {
  const now = dayjs();
  const dayOfWeek = now.day();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = now.subtract(mondayOffset, 'day');

  return Array.from({ length: 7 }, (_, index) => {
    const date = monday.add(index, 'day').locale(locale);
    return {
      shortLabel: date.format('ddd').toUpperCase(),
      dateLabel: date.format('DD'),
      fullDate: date.toDate(),
    };
  });
}

function parseTimeToHour(time: string): number {
  const parsed = dayjs(time, 'HH:mm');
  return parsed.hour() + parsed.minute() / 60;
}

function convertSlotsToEvents(
  slots: TutorDetailAvailabilitySlotDto[]
): CalendarEvent<TutorDetailAvailabilitySlotDto>[] {
  return slots
    .filter((slot) => slot.isActive)
    .map((slot) => ({
      id: `${slot.dayOfWeek}-${slot.startTime}-${slot.endTime}`,
      dayIndex: slot.dayOfWeek,
      startHour: parseTimeToHour(slot.startTime),
      endHour: parseTimeToHour(slot.endTime),
      data: slot,
    }));
}

function getWeekHoursFromSlots(slots: TutorDetailAvailabilitySlotDto[]): number[] {
  if (!slots.length) return getFallbackWeekHours();

  const hours = new Set<number>();
  slots.forEach((slot) => {
    const startHour = Math.floor(parseTimeToHour(slot.startTime));
    const endHour = Math.floor(parseTimeToHour(slot.endTime));
    for (let h = startHour; h < endHour; h++) {
      hours.add(h);
    }
  });

  return Array.from(hours).sort((a, b) => a - b);
}

export function TutorScheduleTab({ tutor }: TutorScheduleTabProps) {
  const t = useTranslations('Tutors.Detail');
  const locale = useLocale();
  const media = useMedia();
  const isCompact = media.md || media.sm || media.xs;

  const weekDays = buildTutorScheduleWeekDays(locale);
  const weekHours = getWeekHoursFromSlots(tutor.availability);
  const events = convertSlotsToEvents(tutor.availability);

  return (
    <CalendarCard
      type="tutorSchedule"
      weekDays={weekDays}
      weekHours={weekHours}
      events={events}
      enableGapCollapse
      readonly
      renderEvent={(event, isCompact) => <TutorScheduleEventCard slot={event.data} isCompact={isCompact} />}
      isCompact={isCompact}
      presetData={{
        title: t('scheduleTitle'),
        subtitle: t('scheduleHint', { timezone: tutor.timezone }),
      }}
    />
  );
}
