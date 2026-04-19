import { Text, YStack } from '@mezon-tutors/app/ui';
import type { CalendarWeekDay } from '../types';

export type CalendarDayHeaderTokens = {
  gridBorder: string;
  activeDayColumn: string;
  dayLabel: string;
  activeDate: string;
  inactiveDate: string;
};

type CalendarDayHeaderProps = {
  day: CalendarWeekDay;
  dayIndex: number;
  isActive: boolean;
  isLast: boolean;
  showGridLines: boolean;
  tokens: CalendarDayHeaderTokens;
};

export function CalendarDayHeader({
  day,
  dayIndex,
  isActive,
  isLast,
  showGridLines,
  tokens,
}: CalendarDayHeaderProps) {
  return (
    <YStack
      flex={1}
      flexBasis={0}
      minWidth={0}
      borderRightWidth={showGridLines && !isLast ? 1 : 0}
      borderRightColor={tokens.gridBorder}
      alignItems="center"
      justifyContent="center"
      gap={4}
      paddingVertical={12}
      backgroundColor={isActive ? tokens.activeDayColumn : 'transparent'}
      borderRadius={isActive && !showGridLines ? 8 : 0}
      borderWidth={isActive && !showGridLines ? 1 : 0}
      borderColor={isActive && !showGridLines ? tokens.gridBorder : 'transparent'}
    >
      <Text
        color={isActive ? tokens.activeDate : tokens.dayLabel}
        fontSize={12}
        textTransform="uppercase"
        letterSpacing={1}
        fontWeight="600"
      >
        {day.shortLabel}
      </Text>
      <Text
        color={isActive ? tokens.activeDate : tokens.inactiveDate}
        fontSize={18}
        lineHeight={20}
        fontWeight="700"
      >
        {day.dateLabel}
      </Text>
    </YStack>
  );
}
