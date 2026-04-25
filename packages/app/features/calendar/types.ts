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
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
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

export type MobileCalendarItemBase = {
  id: string;
  dayIndex: number;
  timeLabel: string;
  category?: string;
};

export type MobileCalendarPersonInfo = {
  name: string;
  avatar?: string;
  role?: 'tutor' | 'student';
};

export type MobileCalendarItem = MobileCalendarItemBase & {
  title: string;
  person: MobileCalendarPersonInfo;
  actionLabel?: string;
  onAction?: () => void;
};

export type MobileCalendarMeta = {
  title: string;
  weekDays: CalendarWeekDay[];
  currentDayIndex?: number;
};

export type MobileCalendarConfig = {
  weekDay: {
    minWidth: number;
    maxWidth: number;
    width: number;
    padding: { vertical: number; horizontal: number };
    contentGap: number;
    borderRadius: number;
    dayFontSize: number;
    dayLineHeight: number;
    dateFontSize: number;
    dateLineHeight: number;
  };
  card: {
    borderRadius: number;
    padding: number;
    gap: number;
    avatar: { size: number; borderRadius: number };
    title: { fontSize: number; lineHeight: number };
    subtitle: { fontSize: number; lineHeight: number };
    time: { fontSize: number; lineHeight: number; iconSize: number };
    button: {
      fontSize: number;
      borderRadius: number;
      padding: { vertical: number; horizontal: number };
    };
  };
  category: {
    dotSize: number;
    fontSize: number;
    padding: { horizontal: number; vertical: number };
    borderRadius: number;
  };
  navigation: {
    iconSize: number;
    buttonPadding: number;
    buttonBorderRadius: number;
    titleFontSize: number;
  };
  empty: {
    minHeight: number;
    borderRadius: number;
    padding: number;
    fontSize: number;
  };
};
