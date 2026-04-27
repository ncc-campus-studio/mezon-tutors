import { CalendarCard, type CalendarEvent, formatWeekDays } from '@mezon-tutors/app';
import { buildFallbackWeekDays, getFallbackWeekHours, ALL_SESSION_STATUSES, getStatusLabelKey, getStatusTokenName } from '@mezon-tutors/shared';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useMedia } from 'tamagui';
import type { MyScheduleCalendarMeta, ScheduleItem } from '../types';
import { MyScheduleEventCard } from './MyScheduleEventCard';
import { LessonDetailModal } from './LessonDetailModal';

type MyScheduleCalendarCardProps = {
  schedules: ScheduleItem[];
  calendar: MyScheduleCalendarMeta;
};

export function MyScheduleCalendarCard({ schedules, calendar }: MyScheduleCalendarCardProps) {
  const locale = useLocale();
  const media = useMedia();
  const isCompact = media.md || media.sm || media.xs;
  const t = useTranslations('MySchedule.legend');
  const [selectedLesson, setSelectedLesson] = useState<ScheduleItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rawWeekDays = calendar.weekDays.length ? calendar.weekDays : buildFallbackWeekDays();
  const displayWeekDays = formatWeekDays(rawWeekDays, locale);
  const displayWeekHours = calendar.weekHours.length ? calendar.weekHours : getFallbackWeekHours();

  const events: CalendarEvent<ScheduleItem>[] = schedules
    .map((schedule) => ({
      id: schedule.id,
      dayIndex: schedule.dayIndex,
      startHour: schedule.startHour,
      endHour: schedule.endHour,
      data: schedule,
    }))
    .sort((a, b) => {
      if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex;
      if (a.startHour !== b.startHour) return a.startHour - b.startHour;
      return (a.endHour ?? a.startHour + 1) - (b.endHour ?? b.startHour + 1);
    });

  const legendItems = ALL_SESSION_STATUSES.map((status) => ({
    key: status,
    label: t(getStatusLabelKey(status)),
    color: getStatusTokenName(status, 'Dot'),
  }));

  const handleLessonPress = (lesson: ScheduleItem) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  return (
    <>
      <CalendarCard
        type="mySchedule"
        weekDays={displayWeekDays}
        weekHours={displayWeekHours}
        events={events}
        currentDayIndex={calendar.currentDayIndex}
        currentHour={calendar.currentHour}
        enableGapCollapse
        readonly
        renderEvent={(event, isCompact) => (
          <MyScheduleEventCard
            schedule={event.data}
            isCompact={isCompact}
            onPress={() => handleLessonPress(event.data)}
          />
        )}
        isCompact={isCompact}
        presetData={{
          legendItems,
        }}
      />
      <LessonDetailModal
        lesson={selectedLesson}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
