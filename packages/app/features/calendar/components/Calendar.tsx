'use client';

import { XStack, YStack } from '@mezon-tutors/app/ui';
import { CALENDAR_CONFIG, CALENDAR_THEME_CONFIG, DEFAULT_THEME_CONFIG } from '@mezon-tutors/shared';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useMedia } from 'tamagui';
import type { BaseCalendarProps, CalendarEvent, CalendarType } from '../types';
import { CalendarColumn, type CalendarColumnConfig } from './CalendarColumn';
import { CalendarDayHeader, type CalendarDayHeaderTokens } from './CalendarDayHeader';
import { CalendarGridLayer, type CalendarGridLayerProps } from './CalendarGridLayer';
import { buildRowModels, CalendarLayoutEngine } from './utils';

function formatHour(hour: number): string {
  return dayjs().hour(hour).minute(0).format('HH:mm');
}

function formatRangeLabel(startHour: number, endHour: number): string {
  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
}

export function Calendar<TEvent = unknown>({
  type,
  weekDays,
  weekHours,
  events = [],
  currentDayIndex,
  currentHour,
  enableGapCollapse = false,
  minGapHours = CALENDAR_CONFIG.MIN_GAP_HOURS,
  readonly = false,
  onSlotClick,
  renderEvent,
  renderSlot,
  themePrefix = 'calendar',
  isCompact: isCompactProp,
}: BaseCalendarProps<TEvent>) {
  const media = useMedia();
  const isCompact = isCompactProp ?? (media.md || media.sm || media.xs);

  const resolvedThemePrefix = type ?? themePrefix;
  const themeConfig = CALENDAR_THEME_CONFIG[resolvedThemePrefix] ?? DEFAULT_THEME_CONFIG;
  const { showTimeline, showGridLines, showNowLine } = themeConfig;
  const showTimelineGrid = themeConfig.showTimelineGrid ?? showGridLines;
  const showDayColumnGridLines = themeConfig.showDayColumnGridLines ?? showGridLines;
  const showGridOuterBorder = themeConfig.showGridOuterBorder ?? showGridLines;

  const timeColumnWidth = isCompact
    ? CALENDAR_CONFIG.TIME_COLUMN_WIDTH.COMPACT
    : CALENDAR_CONFIG.TIME_COLUMN_WIDTH.NORMAL;
  const defaultRowHeight = isCompact
    ? CALENDAR_CONFIG.ROW_HEIGHT.COMPACT
    : CALENDAR_CONFIG.ROW_HEIGHT.NORMAL;
  const defaultGapRowHeight = isCompact
    ? CALENDAR_CONFIG.GAP_ROW_HEIGHT.COMPACT
    : CALENDAR_CONFIG.GAP_ROW_HEIGHT.NORMAL;
  const rowHeight = themeConfig.rowHeight ?? defaultRowHeight;
  const gapRowHeight = themeConfig.gapRowHeight ?? defaultGapRowHeight;
  const slotPadding = isCompact ? 6 : 8;
  const eventPadding = themeConfig.eventPadding ?? slotPadding;
  const eventTopPadding = themeConfig.eventTopPadding ?? eventPadding;

  const rowModels = useMemo(
    () => buildRowModels(weekHours, events, currentHour, enableGapCollapse, minGapHours),
    [weekHours, events, currentHour, enableGapCollapse, minGapHours]
  );

  const layoutEngine = useMemo(
    () => new CalendarLayoutEngine(rowModels, { rowHeight, gapRowHeight }),
    [rowModels, rowHeight, gapRowHeight]
  );

  const eventsByDay = useMemo(() => {
    const grouped = new Map<number, CalendarEvent<TEvent>[]>();
    events.forEach((event) => {
      const items = grouped.get(event.dayIndex) ?? [];
      items.push(event);
      grouped.set(event.dayIndex, items);
    });
    return grouped;
  }, [events]);

  const headerBg = `$${resolvedThemePrefix}GridHeaderBackground`;
  const bodyBg = `$${resolvedThemePrefix}GridBodyBackground`;
  const gridBorder = `$${resolvedThemePrefix}GridBorder`;

  const headerTokens: CalendarDayHeaderTokens = {
    gridBorder,
    activeDayColumn: `$${resolvedThemePrefix}ActiveDayColumn`,
    dayLabel: `$${resolvedThemePrefix}DayLabel`,
    activeDate: `$${resolvedThemePrefix}ActiveDate`,
    inactiveDate: `$${resolvedThemePrefix}InactiveDate`,
  };

  const columnConfig: CalendarColumnConfig<TEvent> = {
    layoutEngine,
    rowHeight,
    slotPadding,
    eventPadding,
    eventTopPadding,
    readonly,
    isCompact,
    showNowLine,
    currentHour,
    headerHeight: CALENDAR_CONFIG.HEADER_HEIGHT,
    onSlotClick,
    renderEvent,
    renderSlot,
    themeTokens: {
      gridBorder,
      currentColumn: `$${resolvedThemePrefix}CurrentColumn`,
      nowLine: `$${resolvedThemePrefix}NowLine`,
      weekendLabel: `$${resolvedThemePrefix}DayLabel`,
    },
    weekendNoSlotDays: themeConfig.weekendNoSlotDays ?? [],
    weekendNoSlotLabel: themeConfig.weekendNoSlotLabel,
    emptySlotMergeHours: themeConfig.emptySlotMergeHours ?? 1,
  };

  const gridProps: CalendarGridLayerProps = {
    rowModels,
    layoutEngine,
    showTimeline,
    showGridLines,
    showTimelineGrid,
    showDayColumnGridLines,
    timeColumnWidth,
    rowHeight,
    gapRowHeight,
    formatHour,
    formatRangeLabel,
    themeTokens: {
      gridBorder,
      gapCellBg: `$${resolvedThemePrefix}GapCellBackground`,
      gapLabel: `$${resolvedThemePrefix}GapLabel`,
      gapHint: `$${resolvedThemePrefix}GapHint`,
      timeLabel: `$${resolvedThemePrefix}TimeLabel`,
    },
    translationNamespace: themeConfig.translationNamespace ?? 'MySchedule',
  };

  return (
    <YStack
      borderWidth={showGridOuterBorder ? 1 : 0}
      borderColor={showGridOuterBorder ? gridBorder : 'transparent'}
      borderRadius={showGridOuterBorder ? 14 : 0}
      overflow="hidden"
      width="100%"
    >
      <XStack
        width="100%"
        minHeight={CALENDAR_CONFIG.HEADER_HEIGHT}
        backgroundColor={headerBg}
        paddingBottom={showGridLines ? 0 : 8}
      >
        {showTimeline && (
          <YStack
            width={timeColumnWidth}
            borderRightWidth={showGridLines ? 1 : 0}
            borderRightColor={gridBorder}
          />
        )}

        {weekDays.map((day, dayIndex) => {
          const isActive = dayIndex === currentDayIndex;
          const isLast = dayIndex === weekDays.length - 1;
          
          return (
            <CalendarDayHeader
              key={`header-${dayIndex}`}
              day={day}
              dayIndex={dayIndex}
              isActive={isActive}
              isLast={isLast}
              showGridLines={showGridLines}
              tokens={headerTokens}
            />
          );
        })}
      </XStack>

      <YStack
        width="100%"
        height={layoutEngine.totalHeight}
        position="relative"
        backgroundColor={bodyBg}
      >
        <CalendarGridLayer {...gridProps} />

        <XStack
          width="100%"
          height="100%"
          position="absolute"
          top={0}
          left={0}
          pointerEvents="box-none"
        >
          {showTimeline && (
            <YStack
              width={timeColumnWidth}
              pointerEvents="none"
            />
          )}

          {weekDays.map((_day, dayIndex) => {
            const isActive = dayIndex === currentDayIndex;
            const isLast = dayIndex === weekDays.length - 1;
            
            return (
              <CalendarColumn
                key={`col-${dayIndex}`}
                dayIndex={dayIndex}
                events={eventsByDay.get(dayIndex) ?? []}
                rowModels={rowModels}
                isLast={isLast}
                isActive={isActive}
                showGridLines={showGridLines}
                showTimelineGrid={showTimelineGrid}
                config={columnConfig}
              />
            );
          })}
        </XStack>
      </YStack>
    </YStack>
  );
}
