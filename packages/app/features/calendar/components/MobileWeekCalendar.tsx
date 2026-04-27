'use client';

import { Button, Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { ChevronLeftIcon, ChevronRightIcon } from '@mezon-tutors/app/ui/icons';
import { CALENDAR_CONFIG, MOBILE_CALENDAR_CONFIG } from '@mezon-tutors/shared';
import { useLocale } from 'next-intl';
import { useMemo } from 'react';
import { useTheme } from 'tamagui';
import type { CalendarType, CalendarWeekDay } from '../types';
import { formatCalendarTitle, formatWeekDays } from '../utils/format-locale';

type MobileWeekCalendarProps = {
  type: Extract<CalendarType, 'myLessons' | 'tutorSchedule' | 'booking'>;
  title: string;
  weekDays: CalendarWeekDay[];
  selectedDayIndex: number;
  currentDayIndex?: number;
  onSelectDay: (dayIndex: number) => void;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
};

export function MobileWeekCalendar({
  type,
  title,
  weekDays,
  selectedDayIndex,
  currentDayIndex,
  onSelectDay,
  onPrevWeek,
  onNextWeek,
}: MobileWeekCalendarProps) {
  const locale = useLocale();
  const theme = useTheme();
  const localizedTitle = useMemo(() => formatCalendarTitle(title, locale), [title, locale]);
  const localizedWeekDays = useMemo(() => formatWeekDays(weekDays, locale), [weekDays, locale]);

  const baseConfig = MOBILE_CALENDAR_CONFIG;
  const variantKey = type === 'booking' ? 'mySchedule' : type;
  const variantConfig =
    MOBILE_CALENDAR_CONFIG.variants[variantKey] ?? MOBILE_CALENDAR_CONFIG.variants.myLessons;
  const weekDayConfig = baseConfig.weekDay;
  const dayFontSize = variantConfig.weekDay.dayFontSize ?? weekDayConfig.dayFontSize;
  const dateFontSize = variantConfig.weekDay.dateFontSize ?? weekDayConfig.dateFontSize;
  const titleFontSize =
    variantConfig.navigationTitleFontSize ?? baseConfig.navigation.titleFontSize;
  const variantStyle = 'style' in variantConfig ? variantConfig.style : undefined;
  const chevronColor = theme.myLessonsMonthNav?.val;

  return (
    <YStack
      gap={baseConfig.base.containerGap}
      width="100%"
    >
      <XStack
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Button
          chromeless
          onPress={onPrevWeek}
          padding={baseConfig.navigation.buttonPadding}
          borderRadius={baseConfig.navigation.buttonBorderRadius}
          disabled={!onPrevWeek}
        >
          <ChevronLeftIcon
            size={baseConfig.navigation.iconSize}
            color={chevronColor}
          />
        </Button>

        <Text
          color={type === 'tutorSchedule' ? '$tutorsDetailPrimaryText' : '$myLessonsCalendarTitle'}
          fontSize={titleFontSize}
          fontWeight="700"
          textAlign="center"
        >
          {localizedTitle}
        </Text>

        <Button
          chromeless
          onPress={onNextWeek}
          padding={baseConfig.navigation.buttonPadding}
          borderRadius={baseConfig.navigation.buttonBorderRadius}
          disabled={!onNextWeek}
        >
          <ChevronRightIcon
            size={baseConfig.navigation.iconSize}
            color={chevronColor}
          />
        </Button>
      </XStack>

      <XStack
        gap={baseConfig.base.weekDaysGap}
        width="100%"
        flexWrap={baseConfig.base.weekDaysWrap}
        overflow="visible"
      >
        {localizedWeekDays.slice(0, CALENDAR_CONFIG.DAYS_PER_WEEK).map((day, index) => {
          const isActive = selectedDayIndex === index;
          const isToday = currentDayIndex === index;

          return (
            <Button
              key={`${day.shortLabel}-${day.dateLabel}-${index}`}
              chromeless
              onPress={() => onSelectDay(index)}
              paddingVertical={weekDayConfig.padding.vertical}
              paddingHorizontal={weekDayConfig.padding.horizontal}
              borderRadius={weekDayConfig.borderRadius}
              backgroundColor={
                isActive
                  ? (variantStyle?.selectedBackgroundToken ?? '$myLessonsPrimaryButton')
                  : 'transparent'
              }
              borderWidth={
                isActive ? (variantStyle?.selectedBorderWidth ?? 0) : isToday && !isActive ? 1 : 0
              }
              borderColor={
                isActive
                  ? (variantStyle?.selectedBorderColorToken ?? 'transparent')
                  : isToday && !isActive
                    ? '$myLessonsPrimaryButton'
                    : 'transparent'
              }
              minWidth={weekDayConfig.minWidth}
              maxWidth={weekDayConfig.maxWidth}
              width={weekDayConfig.width}
              flexDirection="column"
              alignItems="center"
              gap={weekDayConfig.contentGap}
              flexShrink={0}
            >
              <Text
                color={
                  isActive
                    ? (variantStyle?.selectedDayTextToken ?? '$myLessonsPrimaryButtonText')
                    : isToday
                      ? '$myLessonsPrimaryButton'
                      : (variantStyle?.inactiveDayTextToken ?? '$myLessonsLessonsSecondaryText')
                }
                fontSize={dayFontSize}
                lineHeight={weekDayConfig.dayLineHeight}
                fontWeight="600"
                textTransform="uppercase"
              >
                {day.shortLabel}
              </Text>
              <Text
                color={
                  isActive
                    ? (variantStyle?.selectedDateTextToken ?? '$myLessonsPrimaryButtonText')
                    : isToday
                      ? '$myLessonsPrimaryButton'
                      : (variantStyle?.inactiveDateTextToken ?? '$myLessonsLessonsPrimaryText')
                }
                fontSize={dateFontSize}
                fontWeight="700"
                lineHeight={weekDayConfig.dateLineHeight}
              >
                {day.dateLabel}
              </Text>
            </Button>
          );
        })}
      </XStack>
    </YStack>
  );
}
