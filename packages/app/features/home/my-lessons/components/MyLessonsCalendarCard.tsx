import { Text, XStack, YStack } from '@mezon-tutors/app/ui';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { useTranslations } from 'next-intl';
import { useMedia } from 'tamagui';
import { getCategoryKey, getCategoryLabel, getCategoryTheme } from '../category-theme';
import type { LessonItem, MyLessonsCalendarMeta } from '../types';
import { MyLessonsWeekGrid } from './MyLessonsWeekGrid';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

type MyLessonsCalendarCardProps = {
  lessons: LessonItem[];
  calendar: MyLessonsCalendarMeta;
};

export function MyLessonsCalendarCard({
  lessons,
  calendar,
}: MyLessonsCalendarCardProps) {
  const t = useTranslations('MyLessons');
  const media = useMedia();
  const isCompact = media.md || media.sm || media.xs;
  const calendarYear = dayjs.utc(calendar.title, 'MMMM YYYY', true);
  const yearLabel = calendarYear.isValid() ? calendarYear.format('YYYY') : dayjs.utc().format('YYYY');

  const legendItems = Array.from(new Map(lessons.map((lesson) => [getCategoryKey(lesson.category), lesson])).values())
    .map((lesson) => ({
      key: getCategoryKey(lesson.category),
      label: getCategoryLabel(lesson.category, t('calendar.legendSuffix')),
      color: getCategoryTheme(lesson.category).dot,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <YStack
      minWidth={isCompact ? 900 : 0}
      width="100%"
      borderWidth={1}
      borderColor="$myLessonsCardBorder"
      borderRadius={16}
      backgroundColor="$myLessonsCardBackground"
      padding={isCompact ? 12 : 16}
      gap="$3"
    >
      <XStack justifyContent="space-between" alignItems="center" gap="$3" flexWrap="wrap">
        <XStack alignItems="center" gap="$2.5">
          <Text
            color="$myLessonsCalendarTitle"
            fontSize={isCompact ? 32 : 40}
            fontWeight="700"
            lineHeight={isCompact ? 34 : 42}
          >
            {calendar.title}
          </Text>

          <XStack alignItems="center" gap="$2">
            <Text color="$myLessonsMonthNav" fontSize={18}>
              {'<'}
            </Text>
            <Text color="$myLessonsMonthNav" fontSize={18}>
              {'>'}
            </Text>
          </XStack>
        </XStack>

        <XStack
          backgroundColor="$myLessonsSwitcherBackground"
          borderWidth={1}
          borderColor="$myLessonsSwitcherBorder"
          borderRadius={999}
          padding={4}
          gap={4}
        >
          <YStack
            backgroundColor="$myLessonsSwitcherActiveBackground"
            borderRadius={999}
            paddingHorizontal="$3"
            paddingVertical="$1.5"
          >
            <Text color="$myLessonsSwitcherActiveText" fontSize={12} fontWeight="600">
              {t('calendar.switchWeek')}
            </Text>
          </YStack>
          <YStack paddingHorizontal="$3" paddingVertical="$1.5" borderRadius={999}>
            <Text color="$myLessonsSwitcherInactiveText" fontSize={12} fontWeight="600">
              {t('calendar.switchMonth')}
            </Text>
          </YStack>
        </XStack>
      </XStack>

      <MyLessonsWeekGrid lessons={lessons} calendar={calendar} />

      <XStack
        marginTop="$3"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap="$3"
        paddingHorizontal="$1"
      >
        <XStack gap="$3" flexWrap="wrap">
          {legendItems.map((item) => (
            <XStack key={item.key} alignItems="center" gap="$2">
              <YStack width={9} height={9} borderRadius={999} backgroundColor={item.color} />
              <Text color="$myLessonsLegendText" fontSize={12}>
                {item.label}
              </Text>
            </XStack>
          ))}
        </XStack>

        <Text color="$myLessonsFooterText" fontSize={12}>
          {t('calendar.company', { year: yearLabel })}
        </Text>
      </XStack>
    </YStack>
  );
}
