import { useEffect, useMemo, useState } from 'react';
import { Button, Text, XStack, YStack, ScrollView } from '@mezon-tutors/app/ui';
import { ChevronLeftIcon, ChevronRightIcon, ClockCircleIcon } from '@mezon-tutors/app/ui/icons';
import { useTranslations, useLocale } from 'next-intl';
import { Image, useTheme } from 'tamagui';
import {
  DEFAULT_AVATAR_URL,
  MY_LESSONS_MOBILE_CONFIG,
} from '@mezon-tutors/shared/src/constants/my-lesson';
import { formatWeekDays, formatCalendarTitle } from '../../../calendar/utils/format-locale';
import type { LessonCategory, LessonItem, MyLessonsCalendarMeta } from '../types';

function LessonPersonBadge({ name, avatar }: { name: string; avatar?: string }) {
  const avatarUri = avatar?.trim() || DEFAULT_AVATAR_URL;
  const config = MY_LESSONS_MOBILE_CONFIG.card.avatar;

  return (
    <YStack
      width={config.size}
      height={config.size}
      borderRadius={config.borderRadius}
      alignItems="center"
      justifyContent="center"
      backgroundColor="$myLessonsAvatarBackground"
      borderWidth={1}
      borderColor="$myLessonsAvatarBorder"
      overflow="hidden"
    >
      <Image
        source={{ uri: avatarUri }}
        width={config.size}
        height={config.size}
        borderRadius={config.borderRadius}
        accessibilityLabel={name}
      />
    </YStack>
  );
}

type WeekDayButtonProps = {
  day: string;
  date: string;
  isActive: boolean;
  isToday: boolean;
  onPress: () => void;
};

function WeekDayButton({ day, date, isActive, isToday, onPress }: WeekDayButtonProps) {
  const config = MY_LESSONS_MOBILE_CONFIG.weekDay;

  return (
    <Button
      chromeless
      onPress={onPress}
      paddingVertical={config.padding.vertical}
      paddingHorizontal={config.padding.horizontal}
      borderRadius={config.borderRadius}
      backgroundColor={isActive ? '$myLessonsPrimaryButton' : 'transparent'}
      borderWidth={isToday && !isActive ? 1 : 0}
      borderColor={isToday && !isActive ? '$myLessonsPrimaryButton' : 'transparent'}
      minWidth={config.minWidth}
      maxWidth={config.maxWidth}
      width={config.width}
      flexDirection="column"
      alignItems="center"
      gap={config.contentGap}
      position="relative"
      flexShrink={0}
      className="week-day-button"
    >
      <Text
        color={
          isActive
            ? '$myLessonsPrimaryButtonText'
            : isToday
              ? '$myLessonsPrimaryButton'
              : '$myLessonsLessonsSecondaryText'
        }
        fontSize={config.dayFontSize}
        lineHeight={config.dayLineHeight}
        fontWeight="600"
        textTransform="uppercase"
        className="week-day-label"
      >
        {day}
      </Text>
      <Text
        color={
          isActive
            ? '$myLessonsPrimaryButtonText'
            : isToday
              ? '$myLessonsPrimaryButton'
              : '$myLessonsLessonsPrimaryText'
        }
        fontSize={config.dateFontSize}
        fontWeight="700"
        lineHeight={config.dateLineHeight}
        className="week-day-date"
      >
        {date}
      </Text>
    </Button>
  );
}

type MobileLessonCardProps = {
  lesson: LessonItem;
  joinLabel: string;
};

function MobileLessonCard({ lesson, joinLabel }: MobileLessonCardProps) {
  const theme = useTheme();
  const clockIconColor = theme.myLessonsLessonsSecondaryText?.val;
  const config = MY_LESSONS_MOBILE_CONFIG.card;

  return (
    <YStack
      width="100%"
      borderWidth={1}
      borderColor="$myLessonsLessonsCardBorder"
      borderRadius={config.borderRadius}
      backgroundColor="$myLessonsLessonsCardBackground"
      padding={config.padding}
      gap={config.gap}
    >
      <XStack
        alignItems="center"
        gap={10}
        flex={1}
      >
        <LessonPersonBadge
          name={lesson.tutor}
          avatar={lesson.tutorAvatar}
        />
        <YStack
          gap={3}
          flex={1}
        >
          <Text
            color="$myLessonsPrimaryButton"
            fontSize={config.subject.fontSize}
            lineHeight={config.subject.lineHeight}
            fontWeight="800"
            textTransform="uppercase"
          >
            {lesson.subject}
          </Text>
          <Text
            color="$myLessonsLessonsPrimaryText"
            fontSize={config.tutor.fontSize}
            lineHeight={config.tutor.lineHeight}
          >
            {lesson.tutor}
          </Text>
          <XStack
            alignItems="center"
            gap={4}
          >
            <ClockCircleIcon
              size={config.time.iconSize}
              color={clockIconColor}
            />
            <Text
              color="$myLessonsLessonsSecondaryText"
              fontSize={config.time.fontSize}
              lineHeight={config.time.lineHeight}
            >
              {lesson.timeLabel}
            </Text>
          </XStack>
        </YStack>
        <Button
          variant="primary"
          backgroundColor="$myLessonsPrimaryButton"
          borderColor="$myLessonsPrimaryButton"
          color="$myLessonsPrimaryButtonText"
          borderRadius={config.button.borderRadius}
          paddingVertical={config.button.padding.vertical}
          paddingHorizontal={config.button.padding.horizontal}
          fontSize={config.button.fontSize}
          fontWeight="700"
        >
          {joinLabel}
        </Button>
      </XStack>
    </YStack>
  );
}

type CategoryFilterProps = {
  categories: LessonCategory[];
  selectedCategory: LessonCategory | 'all';
  onSelectCategory: (category: LessonCategory | 'all') => void;
  allLabel: string;
  lessonsLabel: string;
};

function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  allLabel,
  lessonsLabel,
}: CategoryFilterProps) {
  const config = MY_LESSONS_MOBILE_CONFIG.category;

  const renderCategoryButton = (category: LessonCategory | 'all', label: string) => {
    const isSelected = selectedCategory === category;

    return (
      <Button
        key={category}
        chromeless
        onPress={() => onSelectCategory(category)}
        paddingHorizontal={config.padding.horizontal}
        paddingVertical={config.padding.vertical}
        borderRadius={config.borderRadius}
        backgroundColor="transparent"
        borderWidth={0}
        flexShrink={0}
      >
        <XStack
          alignItems="center"
          gap="$1"
        >
          <YStack
            width={config.dotSize}
            height={config.dotSize}
            borderRadius={999}
            backgroundColor={
              isSelected ? '$myLessonsPrimaryButton' : '$myLessonsLessonsSecondaryText'
            }
          />
          <Text
            color={isSelected ? '$myLessonsLessonsPrimaryText' : '$myLessonsLessonsSecondaryText'}
            fontSize={config.fontSize}
            fontWeight={isSelected ? '700' : '500'}
            textTransform="uppercase"
          >
            {label}
          </Text>
        </XStack>
      </Button>
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      width="100%"
    >
      <XStack
        gap="$2.5"
        paddingRight="$4"
      >
        {renderCategoryButton('all', allLabel)}
        {categories.map((category) =>
          renderCategoryButton(category, `${category} ${lessonsLabel}`)
        )}
      </XStack>
    </ScrollView>
  );
}

type MyLessonsMobileCalendarProps = {
  calendar: MyLessonsCalendarMeta;
  lessons: LessonItem[];
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
};

export function MyLessonsMobileCalendar({
  calendar,
  lessons,
  onPrevWeek,
  onNextWeek,
}: MyLessonsMobileCalendarProps) {
  const t = useTranslations('MyLessons');
  const locale = useLocale();
  const theme = useTheme();
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => calendar.currentDayIndex ?? 0);
  const [selectedCategory, setSelectedCategory] = useState<LessonCategory | 'all'>('all');
  const config = MY_LESSONS_MOBILE_CONFIG;

  const localizedWeekDays = useMemo(
    () => formatWeekDays(calendar.weekDays, locale),
    [calendar.weekDays, locale]
  );

  const localizedTitle = useMemo(
    () => formatCalendarTitle(calendar.title, locale),
    [calendar.title, locale]
  );

  useEffect(() => {
    setSelectedDayIndex(calendar.currentDayIndex ?? 0);
  }, [calendar.currentDayIndex, calendar.title]);

  const selectedDayLessons = useMemo(
    () => lessons.filter((lesson) => lesson.dayIndex === selectedDayIndex),
    [lessons, selectedDayIndex]
  );

  const categories = useMemo(
    () => Array.from(new Set(selectedDayLessons.map((lesson) => lesson.category))),
    [selectedDayLessons]
  );

  useEffect(() => {
    if (selectedCategory !== 'all' && !categories.includes(selectedCategory)) {
      setSelectedCategory('all');
    }
  }, [categories, selectedCategory]);

  const filteredLessons = useMemo(
    () =>
      selectedCategory === 'all'
        ? selectedDayLessons
        : selectedDayLessons.filter((lesson) => lesson.category === selectedCategory),
    [selectedCategory, selectedDayLessons]
  );

  const chevronColor = theme.myLessonsMonthNav?.val;
  const currentDayIndex = calendar.currentDayIndex;

  return (
    <YStack
      gap={12}
      width="100%"
      paddingHorizontal={0}
      className="mobile-calendar-container"
    >
      <XStack
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        paddingHorizontal={0}
      >
        <Button
          chromeless
          onPress={onPrevWeek}
          padding={config.navigation.buttonPadding}
          borderRadius={config.navigation.buttonBorderRadius}
          disabled={!onPrevWeek}
        >
          <ChevronLeftIcon
            size={config.navigation.iconSize}
            color={chevronColor}
          />
        </Button>

        <Text
          color="$myLessonsCalendarTitle"
          fontSize={config.navigation.titleFontSize}
          fontWeight="700"
          textAlign="center"
          className="month-title"
        >
          {localizedTitle}
        </Text>

        <Button
          chromeless
          onPress={onNextWeek}
          padding={config.navigation.buttonPadding}
          borderRadius={config.navigation.buttonBorderRadius}
          disabled={!onNextWeek}
        >
          <ChevronRightIcon
            size={config.navigation.iconSize}
            color={chevronColor}
          />
        </Button>
      </XStack>

      <XStack
        gap={6}
        width="100%"
        className="week-days-container"
        flexWrap="nowrap"
        overflow="visible"
      >
        {localizedWeekDays.map((day, index) => (
          <WeekDayButton
            key={`${day.shortLabel}-${day.dateLabel}-${index}`}
            day={day.shortLabel}
            date={day.dateLabel}
            isActive={selectedDayIndex === index}
            isToday={currentDayIndex === index}
            onPress={() => setSelectedDayIndex(index)}
          />
        ))}
      </XStack>

      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          allLabel={t('mobile.allLessons')}
          lessonsLabel={t('mobile.lessons')}
        />
      )}

      <YStack
        gap={10}
        width="100%"
      >
        {filteredLessons.length > 0 ? (
          filteredLessons.map((lesson) => (
            <MobileLessonCard
              key={lesson.id}
              lesson={lesson}
              joinLabel={t('panels.lessons.upcoming.joinLesson')}
            />
          ))
        ) : (
          <YStack
            width="100%"
            minHeight={config.empty.minHeight}
            borderWidth={1}
            borderColor="$myLessonsLessonsEmptyBorder"
            borderRadius={config.empty.borderRadius}
            backgroundColor="$myLessonsLessonsEmptyBackground"
            alignItems="center"
            justifyContent="center"
            padding={config.empty.padding}
          >
            <Text
              color="$myLessonsLessonsEmptyDescription"
              fontSize={config.empty.fontSize}
              textAlign="center"
            >
              {t('mobile.noLessonsForDay')}
            </Text>
          </YStack>
        )}
      </YStack>
    </YStack>
  );
}
