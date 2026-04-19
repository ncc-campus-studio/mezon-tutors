import { Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons';
import dayjs from 'dayjs';
import { useLocale } from 'next-intl';
import { useState, useMemo, useCallback } from 'react';

type MiniCalendarProps = {
  selectedDate: dayjs.Dayjs;
  onDateSelect: (date: dayjs.Dayjs) => void;
};

export function MiniCalendar({ selectedDate, onDateSelect }: MiniCalendarProps) {
  const locale = useLocale();
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const now = dayjs();

  const weeks = useMemo(() => {
    const monthStart = currentDate.startOf('month');
    const monthEnd = currentDate.endOf('month');
    const startDate = monthStart.startOf('week');
    const endDate = monthEnd.endOf('week');

    const result: dayjs.Dayjs[][] = [];
    let currentWeek: dayjs.Dayjs[] = [];
    let day = startDate;

    while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
      day = day.add(1, 'day');
    }

    return result;
  }, [currentDate]);

  const getWeekStart = useCallback((date: dayjs.Dayjs) => {
    const dayOfWeek = date.day();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    return date.subtract(mondayOffset, 'day').startOf('day');
  }, []);

  const selectedWeekStart = useMemo(() => getWeekStart(selectedDate), [selectedDate, getWeekStart]);

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = dayjs().day(i).locale(locale);
      days.push(day.format('dd').charAt(0).toUpperCase());
    }
    return days;
  }, [locale]);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prev => prev.subtract(1, 'month'));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => prev.add(1, 'month'));
  }, []);

  const handleDayClick = useCallback((day: dayjs.Dayjs) => {
    onDateSelect(day);
  }, [onDateSelect]);

  return (
    <YStack
      backgroundColor="$dashboardTutorCardBackground"
      borderRadius={12}
      borderWidth={1}
      borderColor="$dashboardTutorCardBorder"
      padding="$3"
      gap="$2"
    >
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={20} lineHeight={24} fontWeight="700" color="$dashboardTutorTextPrimary">
          {currentDate.locale(locale).format('MMMM YYYY')}
        </Text>
        <XStack gap="$1">
          <YStack
            width={28}
            height={28}
            justifyContent="center"
            alignItems="center"
            borderRadius={6}
            cursor="pointer"
            hoverStyle={{ backgroundColor: '$dashboardTutorSidebarItemHover' }}
            onPress={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePrevMonth();
            }}
          >
            <ChevronLeft size={16} color="$dashboardTutorTextSecondary" />
          </YStack>
          <YStack
            width={28}
            height={28}
            justifyContent="center"
            alignItems="center"
            borderRadius={6}
            cursor="pointer"
            hoverStyle={{ backgroundColor: '$dashboardTutorSidebarItemHover' }}
            onPress={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleNextMonth();
            }}
          >
            <ChevronRight size={16} color="$dashboardTutorTextSecondary" />
          </YStack>
        </XStack>
      </XStack>

      <YStack gap="$1">
        <XStack justifyContent="space-between">
          {weekDays.map((day, i) => (
            <Text
              key={i}
              width={24}
              textAlign="center"
              fontSize={10}
              color="$dashboardTutorTextSecondary"
              fontWeight="600"
              opacity={0.8}
            >
              {day}
            </Text>
          ))}
        </XStack>

        {weeks.map((week, weekIndex) => (
          <XStack key={weekIndex} justifyContent="space-between">
            {week.map((day, dayIndex) => {
              const isCurrentMonth = day.month() === currentDate.month();
              const isToday = day.isSame(now, 'day');
              const dayWeekStart = getWeekStart(day);
              const isSelectedWeek = dayWeekStart.isSame(selectedWeekStart, 'day');

              return (
                <YStack
                  key={dayIndex}
                  width={24}
                  height={24}
                  justifyContent="center"
                  alignItems="center"
                  borderRadius={4}
                  backgroundColor={isToday ? '$dashboardTutorFilterActiveBg' : isSelectedWeek ? '$dashboardTutorSidebarItemHover' : 'transparent'}
                  cursor="pointer"
                  hoverStyle={{ backgroundColor: '$dashboardTutorSidebarItemHover' }}
                  onPress={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDayClick(day);
                  }}
                >
                  <Text
                    fontSize={11}
                    color={isCurrentMonth ? '$dashboardTutorTextPrimary' : '$dashboardTutorTextSecondary'}
                    fontWeight={isToday ? '700' : '500'}
                    opacity={isCurrentMonth ? 1 : 0.4}
                  >
                    {day.date()}
                  </Text>
                </YStack>
              );
            })}
          </XStack>
        ))}
      </YStack>
    </YStack>
  );
}
