import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const CALENDAR_CONFIG = {
  MIN_GAP_HOURS: 2,
  TIME_COLUMN_WIDTH: {
    COMPACT: 66,
    NORMAL: 78,
  },
  ROW_HEIGHT: {
    COMPACT: 78,
    NORMAL: 88,
  },
  GAP_ROW_HEIGHT: {
    COMPACT: 52,
    NORMAL: 60,
  },
  HEADER_HEIGHT: 72,
  EVENT_WIDTH: {
    COMPACT: 122,
    NORMAL: 136,
  },
  DAYS_PER_WEEK: 7,
} as const;

export type CalendarThemeConfig = {
  showTimeline: boolean;
  showGridLines: boolean;
  showTimelineGrid?: boolean;
  showDayColumnGridLines?: boolean;
  showGridOuterBorder?: boolean; 
  showNowLine: boolean;
  cardBorder?: boolean;
  cardBorderRadius?: number;
  cardPadding?: number;
  rowHeight?: number;
  gapRowHeight?: number;
  eventMaxWidth?: number;
  eventMaxHeight?: number;
  eventBorderRadius?: number;
  eventPadding?: number;
  eventTopPadding?: number;
  showEmptySlots?: boolean;
  emptySlotText?: string;
  emptySlotStyle?: 'text' | 'outlinedCard';
  emptySlotBorderStyle?: 'solid' | 'dashed';
  emptySlotMaxWidth?: number;
  emptySlotMinHeight?: number;
  emptySlotBorderRadius?: number;
  emptySlotMergeHours?: number;
  weekendNoSlotDays?: number[];
  weekendNoSlotLabel?: string;
  translationNamespace?: string;
};

export const DEFAULT_THEME_CONFIG: CalendarThemeConfig = {
  showTimeline: true,
  showGridLines: true,
  showNowLine: false,
  cardBorder: true,
  cardBorderRadius: 16,
  cardPadding: 16,
  eventMaxWidth: undefined,
  eventMaxHeight: undefined,
  eventBorderRadius: 12,
  eventPadding: 8,
  eventTopPadding: undefined,
  showEmptySlots: false,
  emptySlotText: undefined,
  emptySlotStyle: 'text',
  emptySlotBorderStyle: 'solid',
  emptySlotMaxWidth: undefined,
  emptySlotMinHeight: undefined,
  emptySlotBorderRadius: 12,
  emptySlotMergeHours: 1,
  weekendNoSlotDays: [],
  weekendNoSlotLabel: undefined,
  translationNamespace: 'MySchedule',
};

export const CALENDAR_THEME_CONFIG: Record<string, CalendarThemeConfig> = {
  myLessons: {
    showTimeline: true,
    showGridLines: true,
    showGridOuterBorder: true,
    showNowLine: true,
    cardBorder: false,
    cardBorderRadius: 0,
    cardPadding: 0,
    eventMaxWidth: 136,
    eventMaxHeight: undefined,
    eventBorderRadius: 12,
    eventPadding: 8,
    eventTopPadding: 0,
    showEmptySlots: false,
    translationNamespace: 'MyLessons',
  },
  tutorSchedule: {
    showTimeline: true,
    showGridLines: false,
    showGridOuterBorder: true,
    showNowLine: false,
    cardBorder: false,
    cardBorderRadius: 0,
    cardPadding: 0,
    eventMaxWidth: 120,
    eventMaxHeight: 68,
    eventBorderRadius: 12,
    eventPadding: 8,
    eventTopPadding: 8,
    showEmptySlots: true,
    emptySlotText: undefined,
    emptySlotStyle: 'outlinedCard',
    emptySlotBorderStyle: 'solid',
    emptySlotMaxWidth: 110,
    emptySlotMinHeight: 56,
    emptySlotBorderRadius: 12,
    emptySlotMergeHours: 1,
    translationNamespace: 'MySchedule',
  },
  mySchedule: {
    showTimeline: true,
    showGridLines: true,
    showTimelineGrid: true,
    showDayColumnGridLines: false,
    showGridOuterBorder: true,
    showNowLine: false,
    cardBorder: true,
    cardBorderRadius: 16,
    cardPadding: 16,
    eventBorderRadius: 12,
    eventTopPadding: 8,
    rowHeight: 100,
    gapRowHeight: 68,
    showEmptySlots: false,
    translationNamespace: 'MySchedule',
  },
  booking: {
    showTimeline: true,
    showGridLines: true,
    showNowLine: false,
    cardBorder: true,
    cardBorderRadius: 16,
    cardPadding: 16,
    eventBorderRadius: 12,
    eventTopPadding: 8,
    showEmptySlots: false,
    translationNamespace: 'MySchedule',
  },
};

export function getFallbackWeekHours(): number[] {
  const currentHour = dayjs().hour();
  const startHour = Math.max(0, currentHour - 2);
  const endHour = Math.min(23, startHour + 4);

  return Array.from({ length: endHour - startHour + 1 }, (_, index) => startHour + index);
}

export function buildFallbackWeekDays() {
  const now = dayjs();
  const dayOfWeek = now.day();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = now.subtract(mondayOffset, 'day');

  return Array.from({ length: 7 }, (_, index) => {
    const date = monday.add(index, 'day');

    return {
      shortLabel: date.format('ddd'),
      dateLabel: date.format('DD'),
    };
  });
}

export function calculateDynamicTimelineHours(
  events: Array<{ startsAt: Date | string; endsAt: Date | string }>,
  availabilitySlots?: Array<{ startTime: string; endTime: string }>
): number[] {
  const hours = new Set<number>();

  events.forEach((event) => {
    const startHour = dayjs(event.startsAt).tz('Asia/Ho_Chi_Minh').hour();
    const endHour = dayjs(event.endsAt).tz('Asia/Ho_Chi_Minh').hour();
    
    for (let h = startHour; h <= endHour; h++) {
      hours.add(h);
    }
  });

  if (availabilitySlots) {
    availabilitySlots.forEach((slot) => {
      const [startHour] = slot.startTime.split(':').map(Number);
      const [endHour] = slot.endTime.split(':').map(Number);
      
      for (let h = startHour; h <= endHour; h++) {
        hours.add(h);
      }
    });
  }

  if (hours.size === 0) {
    return [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  }

  const sortedHours = Array.from(hours).sort((a, b) => a - b);
  const minHour = sortedHours[0];
  const maxHour = sortedHours[sortedHours.length - 1];

  return Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i);
}
