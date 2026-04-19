import { Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { useTranslations } from 'next-intl';
import type { CalendarRowModel } from '../types';
import type { CalendarLayoutEngine } from './utils';

type CalendarGridLayerTokens = {
  gridBorder: string;
  gapCellBg: string;
  gapLabel: string;
  gapHint: string;
  timeLabel: string;
};

export type CalendarGridLayerProps = {
  rowModels: CalendarRowModel[];
  layoutEngine: CalendarLayoutEngine;
  showTimeline: boolean;
  showGridLines: boolean;
  showTimelineGrid?: boolean;
  showDayColumnGridLines?: boolean;
  timeColumnWidth: number;
  rowHeight: number;
  gapRowHeight: number;
  formatHour: (hour: number) => string;
  formatRangeLabel: (start: number, end: number) => string;
  themeTokens: CalendarGridLayerTokens;
  translationNamespace?: string;
};

type GridGapItemProps = {
  row: Extract<CalendarRowModel, { type: 'gap' }>;
  layoutEngine: CalendarLayoutEngine;
  showTimeline: boolean;
  showGridLines: boolean;
  showTimelineGrid?: boolean;
  showDayColumnGridLines?: boolean;
  timeColumnWidth: number;
  gapRowHeight: number;
  formatRangeLabel: (start: number, end: number) => string;
  themeTokens: CalendarGridLayerTokens;
  translationNamespace?: string;
};

function GridGapItem({
  row,
  layoutEngine,
  showTimeline,
  showGridLines,
  showTimelineGrid = true,
  showDayColumnGridLines = true,
  timeColumnWidth,
  gapRowHeight,
  formatRangeLabel,
  themeTokens,
  translationNamespace = 'MySchedule',
}: GridGapItemProps) {
  const t = useTranslations(translationNamespace);
  const top = layoutEngine.getY(row.startHour);

  return (
    <>
      {showDayColumnGridLines && (
        <XStack
          position="absolute"
          top={top}
          height={gapRowHeight}
          width="100%"
          backgroundColor={themeTokens.gapCellBg}
          borderTopWidth={1}
          borderTopColor={themeTokens.gridBorder}
          pointerEvents="none"
        />
      )}
      {showTimeline && (
        <YStack
          position="absolute"
          top={top}
          width={timeColumnWidth}
          height={gapRowHeight}
          borderRightWidth={showTimelineGrid ? 1 : 0}
          borderRightColor={themeTokens.gridBorder}
          borderTopWidth={showTimelineGrid ? 1 : 0}
          borderTopColor={themeTokens.gridBorder}
          backgroundColor={themeTokens.gapCellBg}
          alignItems="center"
          justifyContent="center"
          paddingHorizontal={4}
          gap={2}
        >
          <Text
            color={themeTokens.gapLabel}
            fontSize={10}
            fontWeight="500"
            textAlign="center"
            numberOfLines={1}
          >
            {formatRangeLabel(row.startHour, row.endHour)}
          </Text>
          <Text
            color={themeTokens.gapHint}
            fontSize={9}
            fontWeight="500"
          >
            {t('weekGrid.emptyHours', { hours: row.hourCount })}
          </Text>
        </YStack>
      )}
    </>
  );
}

type GridHourItemProps = {
  row: Extract<CalendarRowModel, { type: 'hour' }>;
  layoutEngine: CalendarLayoutEngine;
  showTimeline: boolean;
  showGridLines: boolean;
  showTimelineGrid?: boolean;
  showDayColumnGridLines?: boolean;
  timeColumnWidth: number;
  rowHeight: number;
  formatHour: (hour: number) => string;
  themeTokens: CalendarGridLayerTokens;
};

function GridHourItem({
  row,
  layoutEngine,
  showTimeline,
  showGridLines,
  showTimelineGrid = true,
  showDayColumnGridLines = true,
  timeColumnWidth,
  rowHeight,
  formatHour,
  themeTokens,
}: GridHourItemProps) {
  const top = layoutEngine.getY(row.hour);

  return (
    <>
      {showDayColumnGridLines && (
        <XStack
          position="absolute"
          top={top}
          height={rowHeight}
          width="100%"
          borderTopWidth={1}
          borderTopColor={themeTokens.gridBorder}
          pointerEvents="none"
        />
      )}
      {showTimeline && (
        <YStack
          position="absolute"
          top={top}
          width={timeColumnWidth}
          height={rowHeight}
          borderRightWidth={showTimelineGrid ? 1 : 0}
          borderRightColor={themeTokens.gridBorder}
          borderTopWidth={showTimelineGrid ? 1 : 0}
          borderTopColor={themeTokens.gridBorder}
          alignItems="center"
          paddingTop={10}
        >
          <Text
            color={themeTokens.timeLabel}
            fontSize={11}
            fontWeight="500"
          >
            {formatHour(row.hour)}
          </Text>
        </YStack>
      )}
    </>
  );
}

export function CalendarGridLayer(props: CalendarGridLayerProps) {
  return (
    <>
      {props.rowModels.map((row) => {
        if (row.type === 'gap') {
          return (
            <GridGapItem
              key={`gap-${row.startHour}-${row.endHour}`}
              row={row}
              {...props}
            />
          );
        }
        return (
          <GridHourItem
            key={`hour-${row.hour}`}
            row={row}
            {...props}
          />
        );
      })}
    </>
  );
}
