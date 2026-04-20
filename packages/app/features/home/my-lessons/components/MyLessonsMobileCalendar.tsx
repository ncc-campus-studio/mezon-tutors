import { useState, useMemo } from 'react';
import { Button, Text, XStack, YStack, ScrollView } from '@mezon-tutors/app/ui';
import { ChevronLeftIcon, ChevronRightIcon, ClockCircleIcon } from '@mezon-tutors/app/ui/icons';
import { useTranslations, useLocale } from 'next-intl';
import { Image, useTheme } from 'tamagui';
import { DEFAULT_AVATAR_URL } from '@mezon-tutors/shared/src/constants/my-lesson';
import { formatWeekDays, formatCalendarTitle } from '../../../calendar/utils/format-locale';
import type { LessonCategory, LessonItem, MyLessonsCalendarMeta } from '../types';

function LessonPersonBadge({ name, avatar }: { name: string; avatar?: string }) {
  const avatarUri = avatar?.trim() || DEFAULT_AVATAR_URL;

  return (
    <YStack
      width={40}
      height={40}
      borderRadius={999}
      alignItems="center"
      justifyContent="center"
      backgroundColor="$myLessonsAvatarBackground"
      borderWidth={1}
      borderColor="$myLessonsAvatarBorder"
      overflow="hidden"
    >
      <Image 
        source={{ uri: avatarUri }} 
        width={40} 
        height={40} 
        borderRadius={999} 
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
  return (
    <Button
      chromeless
      onPress={onPress}
      paddingVertical={8}
      paddingHorizontal={4}
      borderRadius={12}
      backgroundColor={isActive ? '$myLessonsPrimaryButton' : 'transparent'}
      borderWidth={isToday && !isActive ? 1 : 0}
      borderColor={isToday && !isActive ? '$myLessonsPrimaryButton' : 'transparent'}
      minWidth={44}
      maxWidth={44}
      width={44}
      flexDirection="column"
      alignItems="center"
      gap={2}
      position="relative"
      flexShrink={0}
      className="week-day-button"
    >
      <Text
        color={isActive ? '$white' : isToday ? '$myLessonsPrimaryButton' : '$myLessonsLessonsSecondaryText'}
        fontSize={9}
        fontWeight="600"
        textTransform="uppercase"
        className="week-day-label"
      >
        {day}
      </Text>
      <Text
        color={isActive ? '$white' : isToday ? '$myLessonsPrimaryButton' : '$myLessonsLessonsPrimaryText'}
        fontSize={15}
        fontWeight="700"
        lineHeight={18}
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

  return (
    <YStack
      width="100%"
      borderWidth={1}
      borderColor="$myLessonsLessonsCardBorder"
      borderRadius={10}
      backgroundColor="$myLessonsLessonsCardBackground"
      padding={10}
      gap={8}
    >
      <XStack alignItems="center" gap={10} flex={1}>
        <LessonPersonBadge name={lesson.tutor} avatar={lesson.tutorAvatar} />
        <YStack gap={3} flex={1}>
          <Text 
            color="$myLessonsPrimaryButton" 
            fontSize={13} 
            lineHeight={16} 
            fontWeight="800" 
            textTransform="uppercase"
          >
            {lesson.subject}
          </Text>
          <Text color="$myLessonsLessonsPrimaryText" fontSize={11} lineHeight={14}>
            {lesson.tutor}
          </Text>
          <XStack alignItems="center" gap={4}>
            <ClockCircleIcon size={11} color={clockIconColor} />
            <Text color="$myLessonsLessonsSecondaryText" fontSize={10} lineHeight={14}>
              {lesson.timeLabel}
            </Text>
          </XStack>
        </YStack>
        <Button
          variant="primary"
          backgroundColor="$myLessonsPrimaryButton"
          borderColor="$myLessonsPrimaryButton"
          color="$white"
          borderRadius={7}
          paddingVertical={7}
          paddingHorizontal={12}
          fontSize={11}
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
  lessonsLabel 
}: CategoryFilterProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} width="100%">
      <XStack gap="$2.5" paddingRight="$4">
        <Button
          chromeless
          onPress={() => onSelectCategory('all')}
          paddingHorizontal="$2.5"
          paddingVertical="$1"
          borderRadius={16}
          backgroundColor="transparent"
          borderWidth={0}
          flexShrink={0}
        >
          <XStack alignItems="center" gap="$1">
            <YStack
              width={6}
              height={6}
              borderRadius={999}
              backgroundColor={
                selectedCategory === 'all' 
                  ? '$myLessonsPrimaryButton' 
                  : '$myLessonsLessonsSecondaryText'
              }
            />
            <Text
              color={
                selectedCategory === 'all' 
                  ? '$myLessonsLessonsPrimaryText' 
                  : '$myLessonsLessonsSecondaryText'
              }
              fontSize={11}
              fontWeight={selectedCategory === 'all' ? '700' : '500'}
              textTransform="uppercase"
            >
              {allLabel}
            </Text>
          </XStack>
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            chromeless
            onPress={() => onSelectCategory(category)}
            paddingHorizontal="$2.5"
            paddingVertical="$1"
            borderRadius={16}
            backgroundColor="transparent"
            borderWidth={0}
            flexShrink={0}
          >
            <XStack alignItems="center" gap="$1">
              <YStack
                width={6}
                height={6}
                borderRadius={999}
                backgroundColor={
                  selectedCategory === category 
                    ? '$myLessonsPrimaryButton' 
                    : '$myLessonsLessonsSecondaryText'
                }
              />
              <Text
                color={
                  selectedCategory === category 
                    ? '$myLessonsLessonsPrimaryText' 
                    : '$myLessonsLessonsSecondaryText'
                }
                fontSize={11}
                fontWeight={selectedCategory === category ? '700' : '500'}
                textTransform="uppercase"
              >
                {category} {lessonsLabel}
              </Text>
            </XStack>
          </Button>
        ))}
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
  const [selectedDayIndex, setSelectedDayIndex] = useState(calendar.currentDayIndex ?? 0);
  const [selectedCategory, setSelectedCategory] = useState<LessonCategory | 'all'>('all');

  const localizedWeekDays = useMemo(
    () => formatWeekDays(calendar.weekDays, locale),
    [calendar.weekDays, locale]
  );

  const localizedTitle = useMemo(
    () => formatCalendarTitle(calendar.title, locale),
    [calendar.title, locale]
  );

  const selectedDayLessons = lessons.filter((lesson) => lesson.dayIndex === selectedDayIndex);
  const categories = Array.from(new Set(lessons.map((lesson) => lesson.category)));
  const filteredLessons =
    selectedCategory === 'all'
      ? selectedDayLessons
      : selectedDayLessons.filter((lesson) => lesson.category === selectedCategory);

  const chevronColor = theme.myLessonsMonthNav?.val;
  const currentDayIndex = calendar.currentDayIndex;

  return (
    <YStack gap={12} width="100%" paddingHorizontal={0} className="mobile-calendar-container">
      <XStack alignItems="center" justifyContent="space-between" width="100%" paddingHorizontal={0}>
        <Button
          chromeless
          onPress={onPrevWeek}
          padding={4}
          borderRadius={6}
          disabled={!onPrevWeek}
        >
          <ChevronLeftIcon size={16} color={chevronColor} />
        </Button>
        
        <Text 
          color="$myLessonsCalendarTitle" 
          fontSize={13} 
          fontWeight="700"
          textAlign="center"
          className="month-title"
        >
          {localizedTitle}
        </Text>
        
        <Button
          chromeless
          onPress={onNextWeek}
          padding={4}
          borderRadius={6}
          disabled={!onNextWeek}
        >
          <ChevronRightIcon size={16} color={chevronColor} />
        </Button>
      </XStack>

      <XStack gap={6} width="100%" className="week-days-container" flexWrap="nowrap" overflow="visible">
        {localizedWeekDays.map((day, index) => (
          <WeekDayButton
            key={index}
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

      <YStack gap={10} width="100%">
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
            minHeight={120}
            borderWidth={1}
            borderColor="$myLessonsLessonsEmptyBorder"
            borderRadius={10}
            backgroundColor="$myLessonsLessonsEmptyBackground"
            alignItems="center"
            justifyContent="center"
            padding={12}
          >
            <Text color="$myLessonsLessonsEmptyDescription" fontSize={11} textAlign="center">
              {t('mobile.noLessonsForDay')}
            </Text>
          </YStack>
        )}
      </YStack>
    </YStack>
  );
}
