import { CalendarCard, type CalendarEvent, formatCalendarTitle, formatWeekDays } from '@mezon-tutors/app';
import { YStack } from '@mezon-tutors/app/ui';
import { buildFallbackWeekDays, getFallbackWeekHours } from '@mezon-tutors/shared';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { useTranslations, useLocale } from 'next-intl';
import { useMedia } from 'tamagui';
import { getCategoryKey, getCategoryLabel, getCategoryTheme } from '../category-theme';
import type { LessonItem, MyLessonsCalendarMeta } from '../types';
import { MyLessonsEventCard } from './MyLessonsEventCard';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

type MyLessonsCalendarCardProps = {
  lessons: LessonItem[];
  calendar: MyLessonsCalendarMeta;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
};

export function MyLessonsCalendarCard({
  lessons,
  calendar,
  onPrevWeek,
  onNextWeek,
}: MyLessonsCalendarCardProps) {
  const t = useTranslations('MyLessons');
  const locale = useLocale();
  const media = useMedia();
  const isCompact = media.md || media.sm || media.xs;
  
  const formattedTitle = formatCalendarTitle(calendar.title, locale);
  const calendarDate = dayjs.utc(calendar.title, 'MMMM YYYY', true);
  const yearLabel = calendarDate.isValid() ? calendarDate.format('YYYY') : dayjs.utc().format('YYYY');

  const displayWeekDays = formatWeekDays(calendar.weekDays.length ? calendar.weekDays : buildFallbackWeekDays(), locale);
  const displayWeekHours = calendar.weekHours.length ? calendar.weekHours : getFallbackWeekHours();

  const events: CalendarEvent<LessonItem>[] = lessons.map((lesson) => ({
    id: lesson.id,
    dayIndex: lesson.dayIndex,
    startHour: lesson.startHour,
    endHour: lesson.endHour,
    data: lesson,
  }));

  const legendItems = Array.from(new Map(lessons.map((lesson) => [getCategoryKey(lesson.category), lesson])).values())
    .map((lesson) => ({
      key: getCategoryKey(lesson.category),
      label: getCategoryLabel(lesson.category, t('calendar.legendSuffix')),
      color: getCategoryTheme(lesson.category).dot,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <YStack minWidth={isCompact ? 900 : 0} width="100%">
      <CalendarCard
        type="myLessons"
        weekDays={displayWeekDays}
        weekHours={displayWeekHours}
        events={events}
        currentDayIndex={calendar.currentDayIndex}
        currentHour={calendar.currentHour}
        enableGapCollapse
        readonly
        renderEvent={(event, isCompact) => <MyLessonsEventCard lesson={event.data} isCompact={isCompact} />}
        isCompact={isCompact}
        presetData={{
          title: formattedTitle,
          weekLabel: t('calendar.switchWeek'),
          monthLabel: t('calendar.switchMonth'),
          showMonthNav: true,
          legendItems,
          companyLabel: t('calendar.company', { year: yearLabel }),
          onPrevWeek,
          onNextWeek,
        }}
      />
    </YStack>
  );
}
