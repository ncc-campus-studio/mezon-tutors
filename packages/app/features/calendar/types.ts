import type { ReactNode } from 'react';

export type CalendarViewMode = 'week' | 'month' | 'day';

export type CalendarType = 'calendar' | 'myLessons' | 'mySchedule' | 'tutorSchedule' | 'booking';

export type CalendarSlotState = 'available' | 'selected' | 'occupied' | 'blocked' | 'pending';

export type CalendarWeekDay = {
  shortLabel: string;
  dateLabel: string;
  fullDate?: Date;
};

export type CalendarTimeSlot = {
  hour: number;
  dayIndex: number;
  state?: CalendarSlotState;
  data?: unknown;
};

export type CalendarEvent<T = unknown> = {
  id: string;
  dayIndex: number;
  startHour: number;
  endHour?: number;
  data: T;
};

export type CalendarLegendItem = {
  key: string;
  label: string;
  color: string;
};

export type CalendarPresetData = {
  title?: string;
  subtitle?: string;
  weekLabel?: string;
  monthLabel?: string;
  showMonthNav?: boolean;
  showViewSwitcher?: boolean;
  legendItems?: CalendarLegendItem[];
  companyLabel?: string;
  primaryDurationLabel?: string;
  secondaryDurationLabel?: string;
};

export type CalendarCardPresetRenderContext = {
  data: CalendarPresetData;
  isCompact: boolean;
};

export type CalendarCardPresetRenderResult = {
  header?: ReactNode;
  footer?: ReactNode;
};

export type CalendarRowModel =
  | { type: 'hour'; hour: number }
  | { type: 'gap'; startHour: number; endHour: number; hourCount: number };

export type BaseCalendarProps<TEvent = unknown> = {
  viewMode?: CalendarViewMode;
  type?: CalendarType;
  weekDays: CalendarWeekDay[];
  weekHours: number[];
  events?: CalendarEvent<TEvent>[];
  currentDayIndex?: number;
  currentHour?: number;
  enableGapCollapse?: boolean;
  minGapHours?: number;
  readonly?: boolean;
  onSlotClick?: (dayIndex: number, hour: number) => void;
  renderEvent?: (event: CalendarEvent<TEvent>, isCompact: boolean) => ReactNode;
  renderSlot?: (dayIndex: number, hour: number, state?: CalendarSlotState) => ReactNode;
  themePrefix?: string;
  isCompact?: boolean;
};
