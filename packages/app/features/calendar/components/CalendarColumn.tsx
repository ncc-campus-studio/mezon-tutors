import { Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { useMemo } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { CalendarEvent, CalendarRowModel, CalendarSlotState } from '../types';
import type { CalendarLayoutEngine } from './utils';

export type CalendarColumnTokens = {
  gridBorder: string;
  currentColumn: string;
  nowLine: string;
  weekendLabel: string;
};

export type CalendarColumnConfig<TEvent> = {
  layoutEngine: CalendarLayoutEngine;
  rowHeight: number;
  slotPadding: number;
  eventPadding: number;
  eventTopPadding: number;
  readonly: boolean;
  isCompact: boolean;
  showNowLine?: boolean;
  currentHour?: number;
  headerHeight: number;
  themeTokens: CalendarColumnTokens;
  weekendNoSlotDays?: number[];
  weekendNoSlotLabel?: string;
  emptySlotMergeHours?: number;
  onSlotClick?: (dayIndex: number, hour: number) => void;
  renderEvent?: (event: CalendarEvent<TEvent>, isCompact: boolean) => ReactNode;
  renderSlot?: (dayIndex: number, hour: number, state?: CalendarSlotState) => ReactNode;
};

type CalendarColumnProps<TEvent> = {
  dayIndex: number;
  events: CalendarEvent<TEvent>[];
  rowModels: CalendarRowModel[];
  isLast: boolean;
  isActive: boolean;
  showGridLines: boolean;
  showTimelineGrid?: boolean;
  config: CalendarColumnConfig<TEvent>;
};

type ColumnEmptySlotProps<TEvent> = {
  row: Extract<CalendarRowModel, { type: 'hour' }>;
  dayIndex: number;
  config: CalendarColumnConfig<TEvent>;
  height?: number;
};

function ColumnEmptySlot<TEvent>({ row, dayIndex, config, height }: ColumnEmptySlotProps<TEvent>) {
  const top = config.layoutEngine.getY(row.hour);
  const hasClick = !config.readonly && config.onSlotClick;

  return (
    <YStack
      position="absolute"
      top={top}
      height={height ?? config.rowHeight}
      width="100%"
      cursor={hasClick ? 'pointer' : 'default'}
      onPress={hasClick ? () => config.onSlotClick?.(dayIndex, row.hour) : undefined}
      padding={config.slotPadding}
    >
      {config.renderSlot ? config.renderSlot(dayIndex, row.hour) : null}
    </YStack>
  );
}

type ColumnEventSlotProps<TEvent> = {
  event: CalendarEvent<TEvent>;
  config: CalendarColumnConfig<TEvent>;
};

function ColumnEventSlot<TEvent>({ event, config }: ColumnEventSlotProps<TEvent>) {
  const top = config.layoutEngine.getY(event.startHour);
  const endHour = event.endHour ?? event.startHour + 1;
  const bottom = config.layoutEngine.getY(endHour);
  const height = Math.max(0, bottom - top);
  const inset = height > 8 ? 1 : 0;

  return (
    <YStack
      position="absolute"
      top={top + inset}
      height={Math.max(0, height - inset * 2)}
      width="100%"
      paddingHorizontal={config.eventPadding}
      paddingTop={config.eventTopPadding}
      paddingBottom={config.eventPadding}
      zIndex={10}
    >
      {config.renderEvent ? config.renderEvent(event, config.isCompact) : null}
    </YStack>
  );
}

function ColumnNowLine<TEvent>({ config }: { config: CalendarColumnConfig<TEvent> }) {
  if (!config.showNowLine || config.currentHour === undefined) return null;

  const top = config.layoutEngine.getY(config.currentHour);

  return (
    <XStack
      position="absolute"
      left={0}
      right={0}
      top={top}
      alignItems="center"
      pointerEvents="none"
      zIndex={20}
    >
      <YStack
        width={7}
        height={7}
        borderRadius={999}
        backgroundColor={config.themeTokens.nowLine}
        marginLeft={-4}
      />
      <YStack
        flex={1}
        height={2}
        backgroundColor={config.themeTokens.nowLine}
      />
    </XStack>
  );
}

function getEventEndHour(event: CalendarEvent<unknown>) {
  return event.endHour ?? event.startHour + 1;
}

export function CalendarColumn<TEvent = unknown>({
  dayIndex,
  events,
  rowModels,
  isLast,
  isActive,
  showGridLines,
  showTimelineGrid = true,
  config,
}: CalendarColumnProps<TEvent>) {
  const isWeekendNoSlotsColumn =
    events.length === 0 &&
    Boolean(config.weekendNoSlotLabel) &&
    Boolean(config.weekendNoSlotDays?.includes(dayIndex));
  const mergeHours = Math.max(1, config.emptySlotMergeHours ?? 1);

  const hourRows = useMemo(
    () =>
      rowModels.filter(
        (row): row is Extract<CalendarRowModel, { type: 'hour' }> => row.type === 'hour'
      ),
    [rowModels]
  );

  const rowHourSet = useMemo(() => new Set(hourRows.map((row) => row.hour)), [hourRows]);

  const occupiedHourSet = useMemo(() => {
    if (!events.length) return new Set<number>();
    const occupied = new Set<number>();
    hourRows.forEach((row) => {
      const hasOverlap = events.some(
        (event) => event.startHour < row.hour + 1 && getEventEndHour(event) > row.hour
      );
      if (hasOverlap) occupied.add(row.hour);
    });
    return occupied;
  }, [events, hourRows]);

  const hasEventInHour = (hour: number) => occupiedHourSet.has(hour);

  const weekendNoSlotLabelStyle: CSSProperties = {
    letterSpacing: 1.2,
    transform: 'rotate(90deg)',
    whiteSpace: 'nowrap',
  };

  return (
    <YStack
      flex={1}
      flexBasis={0}
      minWidth={0}
      borderRightWidth={showGridLines && !isLast ? 1 : 0}
      borderRightColor={config.themeTokens.gridBorder}
      borderTopWidth={showTimelineGrid ? 1 : 0}
      borderTopColor={config.themeTokens.gridBorder}
      backgroundColor={isActive ? config.themeTokens.currentColumn : 'transparent'}
      position="relative"
    >
      {rowModels.map((row) => {
        if (row.type === 'gap') return null;
        if (isWeekendNoSlotsColumn) return null;
        if (config.renderSlot && hasEventInHour(row.hour)) return null;

        const isBlockStart =
          !config.renderSlot || !hasEventInHour(row.hour - 1) || mergeHours === 1;

        if (!isBlockStart) return null;

        let span = 1;
        if (config.renderSlot && mergeHours > 1) {
          while (span < mergeHours) {
            const nextHour = row.hour + span;
            const hasNextHour = rowHourSet.has(nextHour);
            if (!hasNextHour || hasEventInHour(nextHour)) break;
            span += 1;
          }
        }

        return (
          <ColumnEmptySlot
            key={`slot-${row.hour}`}
            row={row}
            dayIndex={dayIndex}
            config={config}
            height={config.rowHeight * span}
          />
        );
      })}

      {events.map((event) => (
        <ColumnEventSlot
          key={event.id}
          event={event}
          config={config}
        />
      ))}

      {isWeekendNoSlotsColumn && (
        <YStack
          position="absolute"
          left={0}
          right={0}
          top={config.headerHeight}
          bottom={0}
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
        >
          <Text
            color={config.themeTokens.weekendLabel}
            fontSize={11}
            fontWeight="700"
            opacity={0.45}
            style={weekendNoSlotLabelStyle}
          >
            {config.weekendNoSlotLabel}
          </Text>
        </YStack>
      )}

      {isActive && <ColumnNowLine config={config} />}
    </YStack>
  );
}
