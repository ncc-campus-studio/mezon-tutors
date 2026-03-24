import { Text, XStack, YStack } from '@mezon-tutors/app/ui';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useTranslations } from 'next-intl';
import { useMedia } from 'tamagui';
import { getCategoryTheme } from '../category-theme';
import type { LessonItem, MyLessonsCalendarMeta, WeekDay } from '../types';

dayjs.extend(utc);

type MyLessonsWeekGridProps = {
  lessons: LessonItem[];
  calendar: MyLessonsCalendarMeta;
};

type HourRowModel = {
  type: 'hour';
  hour: number;
};

type GapRowModel = {
  type: 'gap';
  startHour: number;
  endHour: number;
  hourCount: number;
};

type RowModel = HourRowModel | GapRowModel;

function formatHour(hour: number) {
  return dayjs.utc().startOf('day').add(hour, 'hour').format('HH:mm');
}

function getFallbackWeekHours(): number[] {
  const currentHour = dayjs.utc().hour();
  const startHour = Math.max(0, currentHour - 2);
  const endHour = Math.min(23, startHour + 4);

  return Array.from({ length: endHour - startHour + 1 }, (_, index) => startHour + index);
}

function buildFallbackWeekDays(): WeekDay[] {
  const now = dayjs.utc();
  const utcDay = now.day();
  const calendarDay = utcDay === 0 ? 6 : utcDay - 1;
  const monday = now.subtract(calendarDay, 'day');

  return Array.from({ length: 7 }, (_, index) => {
    const date = monday.add(index, 'day');

    return {
      shortLabel: date.format('ddd'),
      dateLabel: date.format('DD'),
    };
  });
}

function buildRowModels(weekHours: number[], lessons: LessonItem[], currentHour: number): RowModel[] {
  if (!weekHours.length) {
    return [];
  }

  const sortedHours = [...weekHours].sort((a, b) => a - b);
  const lessonStartHours = new Set(lessons.map((lesson) => lesson.startHour));
  const rows: RowModel[] = [];

  let index = 0;

  while (index < sortedHours.length) {
    const hour = sortedHours[index];
    const hasLesson = lessonStartHours.has(hour);
    const isCurrentHour = hour === currentHour;

    if (hasLesson || isCurrentHour) {
      rows.push({ type: 'hour', hour });
      index += 1;
      continue;
    }

    const startIndex = index;

    while (index < sortedHours.length) {
      const cursorHour = sortedHours[index];
      const cursorHasLesson = lessonStartHours.has(cursorHour);
      const cursorIsCurrent = cursorHour === currentHour;

      if (cursorHasLesson || cursorIsCurrent) {
        break;
      }

      index += 1;
    }

    const emptyCount = index - startIndex;

    if (emptyCount >= 2) {
      const startHour = sortedHours[startIndex];
      const lastEmptyHour = sortedHours[index - 1] ?? startHour;
      rows.push({
        type: 'gap',
        startHour,
        endHour: Math.min(24, lastEmptyHour + 1),
        hourCount: emptyCount,
      });
      continue;
    }

    rows.push({ type: 'hour', hour: sortedHours[startIndex] });
  }

  return rows;
}

function formatRangeLabel(startHour: number, endHour: number): string {
  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
}

function MyLessonsEventCard({ lesson, isCompact }: { lesson: LessonItem; isCompact: boolean }) {
  const theme = getCategoryTheme(lesson.category);
  const eventWidth = isCompact ? 122 : 136;

  return (
    <YStack
      width={eventWidth}
      maxWidth="100%"
      minWidth={0}
      alignSelf="flex-start"
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

export function MyLessonsWeekGrid({ lessons, calendar }: MyLessonsWeekGridProps) {
  const t = useTranslations('MyLessons');
  const media = useMedia();
  const isCompact = media.md || media.sm || media.xs;

  const timeColumnWidth = isCompact ? 66 : 78;
  const rowHeight = isCompact ? 78 : 88;
  const gapRowHeight = isCompact ? 52 : 60;

  const displayWeekDays = calendar.weekDays.length ? calendar.weekDays : buildFallbackWeekDays();
  const displayWeekHours = calendar.weekHours.length ? calendar.weekHours : getFallbackWeekHours();
  const rowModels = buildRowModels(displayWeekHours, lessons, calendar.currentHour);

  return (
    <YStack
      borderWidth={1}
      borderColor="$myLessonsGridBorder"
      borderRadius={14}
      overflow="hidden"
      width="100%"
    >
      <XStack width="100%" minHeight={72} backgroundColor="$myLessonsGridHeaderBackground">
        <YStack width={timeColumnWidth} borderRightWidth={1} borderRightColor="$myLessonsGridBorder" />

        {displayWeekDays.map((day, dayIndex) => {
          const isActiveDay = dayIndex === calendar.currentDayIndex;

          return (
            <YStack
              key={day.shortLabel}
              flex={1}
              flexBasis={0}
              minWidth={0}
              borderRightWidth={dayIndex === displayWeekDays.length - 1 ? 0 : 1}
              borderRightColor="$myLessonsGridBorder"
              alignItems="center"
              justifyContent="center"
              gap={2}
              backgroundColor={isActiveDay ? '$myLessonsActiveDayColumn' : 'transparent'}
            >
              <Text
                color="$myLessonsDayLabel"
                fontSize={10}
                textTransform="uppercase"
                letterSpacing={1}
                fontWeight="700"
              >
                {day.shortLabel}
              </Text>
              <Text
                color={isActiveDay ? '$myLessonsActiveDate' : '$myLessonsInactiveDate'}
                fontSize={22}
                lineHeight={24}
                fontWeight="700"
              >
                {day.dateLabel}
              </Text>
            </YStack>
          );
        })}
      </XStack>

      {rowModels.map((row) => {
        if (row.type === 'gap') {
          return (
            <XStack
              key={`gap-${row.startHour}-${row.endHour}`}
              width="100%"
              minHeight={gapRowHeight}
              backgroundColor="$myLessonsGridBodyBackground"
            >
              <YStack
                width={timeColumnWidth}
                borderTopWidth={1}
                borderTopColor="$myLessonsGridBorder"
                borderRightWidth={1}
                borderRightColor="$myLessonsGridBorder"
                alignItems="center"
                justifyContent="center"
                paddingHorizontal={4}
                gap={2}
              >
                <Text
                  color="$myLessonsGapLabel"
                  fontSize={10}
                  fontWeight="500"
                  textAlign="center"
                  numberOfLines={1}
                >
                  {formatRangeLabel(row.startHour, row.endHour)}
                </Text>
                <Text color="$myLessonsGapHint" fontSize={9} fontWeight="500">
                  {t('weekGrid.emptyHours', { hours: row.hourCount })}
                </Text>
              </YStack>

              {displayWeekDays.map((day, dayIndex) => {
                const isCurrentColumn = dayIndex === calendar.currentDayIndex;

                return (
                  <YStack
                    key={`gap-${day.shortLabel}-${row.startHour}`}
                    flex={1}
                    flexBasis={0}
                    minWidth={0}
                    borderTopWidth={1}
                    borderTopColor="$myLessonsGridBorder"
                    borderRightWidth={dayIndex === displayWeekDays.length - 1 ? 0 : 1}
                    borderRightColor="$myLessonsGridBorder"
                    backgroundColor={
                      isCurrentColumn ? '$myLessonsCurrentColumnGap' : '$myLessonsGapCellBackground'
                    }
                  />
                );
              })}
            </XStack>
          );
        }

        const hour = row.hour;

        return (
          <XStack key={hour} width="100%" minHeight={rowHeight} backgroundColor="$myLessonsGridBodyBackground">
            <YStack
              width={timeColumnWidth}
              borderTopWidth={1}
              borderTopColor="$myLessonsGridBorder"
              borderRightWidth={1}
              borderRightColor="$myLessonsGridBorder"
              alignItems="center"
              paddingTop={10}
            >
              <Text color="$myLessonsTimeLabel" fontSize={11} fontWeight="500">
                {formatHour(hour)}
              </Text>
            </YStack>

            {displayWeekDays.map((day, dayIndex) => {
              const isCurrentColumn = dayIndex === calendar.currentDayIndex;
              const lesson = lessons.find((item) => item.dayIndex === dayIndex && item.startHour === hour);

              return (
                <YStack
                  key={`${day.shortLabel}-${hour}`}
                  flex={1}
                  flexBasis={0}
                  minWidth={0}
                  borderTopWidth={1}
                  borderTopColor="$myLessonsGridBorder"
                  borderRightWidth={dayIndex === displayWeekDays.length - 1 ? 0 : 1}
                  borderRightColor="$myLessonsGridBorder"
                  padding={isCompact ? 6 : 8}
                  backgroundColor={isCurrentColumn ? '$myLessonsCurrentColumn' : 'transparent'}
                  position="relative"
                  overflow="hidden"
                >
                  {isCurrentColumn && hour === calendar.currentHour ? (
                    <XStack position="absolute" left={0} right={0} top={0} alignItems="center" pointerEvents="none">
                      <YStack
                        width={7}
                        height={7}
                        borderRadius={999}
                        backgroundColor="$myLessonsNowLine"
                        marginLeft={-4}
                      />
                      <YStack flex={1} height={2} backgroundColor="$myLessonsNowLine" />
                    </XStack>
                  ) : null}

                  {lesson ? <MyLessonsEventCard lesson={lesson} isCompact={isCompact} /> : null}
                </YStack>
              );
            })}
          </XStack>
        );
      })}
    </YStack>
  );
}
