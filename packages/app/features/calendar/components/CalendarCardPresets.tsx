'use client';

import { Button } from '@mezon-tutors/app/ui';
import { Text, XStack, YStack } from 'tamagui';
import type {
  CalendarCardPresetRenderContext,
  CalendarCardPresetRenderResult,
  CalendarLegendItem,
  CalendarType,
} from '../types';

function MyLessonsPresetHeader({
  title,
  weekLabel,
  monthLabel,
  showMonthNav = true,
  isCompact,
  onPrevWeek,
  onNextWeek,
}: {
  title: string;
  weekLabel: string;
  monthLabel: string;
  showMonthNav?: boolean;
  isCompact: boolean;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
}) {
  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      gap="$3"
      flexWrap="wrap"
      paddingTop="$3"
      paddingBottom="$4"
    >
      <XStack
        alignItems="center"
        gap="$2.5"
      >
        <Text
        
          paddingLeft="$3"
          color="$myLessonsCalendarTitle"
          fontSize={isCompact ? 32 : 40}
          fontWeight="700"
          lineHeight={isCompact ? 34 : 42}
        >
          {title}
        </Text>

        {showMonthNav && (
          <XStack
            alignItems="center"
            gap="$2"
          >
            <Text
              color="$myLessonsMonthNav"
              fontSize={18}
              cursor={onPrevWeek ? 'pointer' : 'default'}
              onPress={onPrevWeek}
            >
              {'<'}
            </Text>
            <Text
              color="$myLessonsMonthNav"
              fontSize={18}
              cursor={onNextWeek ? 'pointer' : 'default'}
              onPress={onNextWeek}
            >
              {'>'}
            </Text>
          </XStack>
        )}
      </XStack>

      <XStack
        backgroundColor="$myLessonsSwitcherActiveBackground"
        borderRadius={999}
        paddingHorizontal="$3"
        paddingVertical="$1.5"
        marginRight="$3"
      >
        <Text
          color="$myLessonsSwitcherActiveText"
          fontSize={12}
          fontWeight="600"
        >
          {weekLabel}
        </Text>
      </XStack>
    </XStack>
  );
}

function MyLessonsPresetFooter({
  legendItems,
  companyLabel,
}: { legendItems: CalendarLegendItem[]; companyLabel?: string }) {
  return (
    <XStack
      paddingTop="$2"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap="$3"
      paddingHorizontal="$1"
    >
      <XStack
        gap="$3"
        flexWrap="wrap"
      >
        {legendItems.map((item) => (
          <XStack
            paddingBottom="$2"
            key={item.key}
            alignItems="center"
            gap="$2"
          >
            <YStack
              width={9}
              height={9}
              borderRadius={999}
              backgroundColor={item.color}
            />
            <Text
              color="$myLessonsLegendText"
              fontSize={12}
            >
              {item.label}
            </Text>
          </XStack>
        ))}
      </XStack>

      {companyLabel ? (
        <Text
          color="$myLessonsFooterText"
          fontSize={12}
        >
          {companyLabel}
        </Text>
      ) : null}
    </XStack>
  );
}

function MySchedulePresetHeader({
  title,
  weekLabel,
  monthLabel,
}: {
  title: string;
  weekLabel: string;
  monthLabel: string;
}) {
  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="$2"
    >
      <Text
        fontSize={16}
        fontWeight="700"
        color="$myScheduleHeaderTitle"
      >
        {title}
      </Text>
      <XStack gap="$2">
        <Button
          size="$3"
          variant="outlined"
        >
          {weekLabel}
        </Button>
        <Button
          size="$3"
          variant="outlined"
        >
          {monthLabel}
        </Button>
      </XStack>
    </XStack>
  );
}

function MySchedulePresetFooter({ legendItems }: { legendItems: CalendarLegendItem[] }) {
  return (
    <XStack
      marginTop="$3"
      gap="$3"
      flexWrap="wrap"
      paddingHorizontal="$1"
    >
      {legendItems.map((item) => (
        <XStack
          key={item.key}
          alignItems="center"
          gap="$2"
        >
          <YStack
            width={9}
            height={9}
            borderRadius={999}
            backgroundColor={item.color}
          />
          <Text
            color="$myScheduleLegendText"
            fontSize={12}
          >
            {item.label}
          </Text>
        </XStack>
      ))}
    </XStack>
  );
}

function TutorSchedulePresetHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <YStack gap="$3">
      <Text
        color="$tutorScheduleCalendarTitle"
        fontSize={20}
        fontWeight="800"
      >
        {title}
      </Text>
      {subtitle ? <Text color="$tutorScheduleCalendarSubtitle">{subtitle}</Text> : null}
    </YStack>
  );
}

function BookingPresetHeader({
  title,
  subtitle,
  primaryDurationLabel,
  secondaryDurationLabel,
}: {
  title: string;
  subtitle?: string;
  primaryDurationLabel?: string;
  secondaryDurationLabel?: string;
}) {
  return (
    <YStack gap="$3">
      <XStack
        justifyContent="space-between"
        alignItems="center"
        gap="$3"
        flexWrap="wrap"
      >
        <Text
          color="$myLessonsCalendarTitle"
          fontSize={42}
          fontWeight="700"
          lineHeight={44}
        >
          {title}
        </Text>
        {primaryDurationLabel || secondaryDurationLabel ? (
          <XStack
            backgroundColor="$myLessonsSwitcherBackground"
            borderWidth={1}
            borderColor="$myLessonsSwitcherBorder"
            borderRadius={999}
            padding={4}
            gap={4}
          >
            {primaryDurationLabel ? (
              <YStack
                backgroundColor="$myLessonsSwitcherActiveBackground"
                borderRadius={999}
                paddingHorizontal="$3"
                paddingVertical="$1.5"
              >
                <Text
                  color="$myLessonsSwitcherActiveText"
                  fontSize={12}
                  fontWeight="700"
                >
                  {primaryDurationLabel}
                </Text>
              </YStack>
            ) : null}
            {secondaryDurationLabel ? (
              <YStack
                paddingHorizontal="$3"
                paddingVertical="$1.5"
                borderRadius={999}
              >
                <Text
                  color="$myLessonsSwitcherInactiveText"
                  fontSize={12}
                  fontWeight="700"
                >
                  {secondaryDurationLabel}
                </Text>
              </YStack>
            ) : null}
          </XStack>
        ) : null}
      </XStack>
      {subtitle ? (
        <Text
          color="$myLessonsLegendText"
          fontSize={14}
        >
          {subtitle}
        </Text>
      ) : null}
    </YStack>
  );
}

const CALENDAR_CARD_PRESET_RENDERERS: Partial<
  Record<CalendarType, (context: CalendarCardPresetRenderContext) => CalendarCardPresetRenderResult>
> = {
  myLessons: ({ data, isCompact }) => ({
    header: data.title ? (
      <MyLessonsPresetHeader
        title={data.title}
        weekLabel={data.weekLabel ?? 'Week'}
        monthLabel={data.monthLabel ?? 'Month'}
        showMonthNav={data.showMonthNav}
        isCompact={isCompact}
        onPrevWeek={data.onPrevWeek}
        onNextWeek={data.onNextWeek}
      />
    ) : undefined,
    footer: (
      <MyLessonsPresetFooter
        legendItems={data.legendItems ?? []}
        companyLabel={data.companyLabel}
      />
    ),
  }),
  mySchedule: ({ data }) => ({
    header: data.title ? (
      <MySchedulePresetHeader
        title={data.title}
        weekLabel={data.weekLabel ?? 'Week'}
        monthLabel={data.monthLabel ?? 'Month'}
      />
    ) : undefined,
    footer: data.legendItems?.length ? (
      <MySchedulePresetFooter legendItems={data.legendItems} />
    ) : undefined,
  }),
  tutorSchedule: ({ data }) => ({
    header: data.title ? (
      <TutorSchedulePresetHeader
        title={data.title}
        subtitle={data.subtitle}
      />
    ) : undefined,
  }),
  booking: ({ data }) => ({
    header: data.title ? (
      <BookingPresetHeader
        title={data.title}
        subtitle={data.subtitle}
        primaryDurationLabel={data.primaryDurationLabel}
        secondaryDurationLabel={data.secondaryDurationLabel}
      />
    ) : undefined,
  }),
};

export function resolveCardPresetRender(
  calendarType: CalendarType,
  context: CalendarCardPresetRenderContext
) {
  const renderer = CALENDAR_CARD_PRESET_RENDERERS[calendarType];
  return renderer ? renderer(context) : undefined;
}
