'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Text, XStack, YStack, ScrollView } from '@mezon-tutors/app/ui';
import { ChevronLeftIcon, ChevronRightIcon, ClockCircleIcon } from '@mezon-tutors/app/ui/icons';
import { useLocale } from 'next-intl';
import { Image, useTheme } from 'tamagui';
import { formatWeekDays, formatCalendarTitle } from '../utils/format-locale';
import type { MobileCalendarItem, MobileCalendarMeta, MobileCalendarConfig } from '../types';
import type { ReactNode } from 'react';

type PersonBadgeProps = {
  name: string;
  avatar?: string;
  defaultAvatarUrl: string;
  config: MobileCalendarConfig['card']['avatar'];
};

function PersonBadge({ name, avatar, defaultAvatarUrl, config }: PersonBadgeProps) {
  const avatarUri = avatar?.trim() || defaultAvatarUrl;

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
  config: MobileCalendarConfig['weekDay'];
};

function WeekDayButton({ day, date, isActive, isToday, onPress, config }: WeekDayButtonProps) {
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

type MobileCalendarCardProps = {
  item: MobileCalendarItem;
  defaultAvatarUrl: string;
  config: MobileCalendarConfig;
};

function MobileCalendarCard({ item, defaultAvatarUrl, config }: MobileCalendarCardProps) {
  const theme = useTheme();
  const clockIconColor = theme.myLessonsLessonsSecondaryText?.val;

  return (
    <YStack
      width="100%"
      borderWidth={1}
      borderColor="$myLessonsLessonsCardBorder"
      borderRadius={config.card.borderRadius}
      backgroundColor="$myLessonsLessonsCardBackground"
      padding={config.card.padding}
      gap={config.card.gap}
    >
      <XStack
        alignItems="center"
        gap={10}
        flex={1}
      >
        <PersonBadge
          name={item.person.name}
          avatar={item.person.avatar}
          defaultAvatarUrl={defaultAvatarUrl}
          config={config.card.avatar}
        />
        <YStack
          gap={3}
          flex={1}
        >
          <Text
            color="$myLessonsPrimaryButton"
            fontSize={config.card.title.fontSize}
            lineHeight={config.card.title.lineHeight}
            fontWeight="800"
            textTransform="uppercase"
          >
            {item.title}
          </Text>
          <Text
            color="$myLessonsLessonsPrimaryText"
            fontSize={config.card.subtitle.fontSize}
            lineHeight={config.card.subtitle.lineHeight}
          >
            {item.person.name}
          </Text>
          <XStack
            alignItems="center"
            gap={4}
          >
            <ClockCircleIcon
              size={config.card.time.iconSize}
              color={clockIconColor}
            />
            <Text
              color="$myLessonsLessonsSecondaryText"
              fontSize={config.card.time.fontSize}
              lineHeight={config.card.time.lineHeight}
            >
              {item.timeLabel}
            </Text>
          </XStack>
        </YStack>
        {item.actionLabel && item.onAction && (
          <Button
            variant="primary"
            backgroundColor="$myLessonsPrimaryButton"
            borderColor="$myLessonsPrimaryButton"
            color="$myLessonsPrimaryButtonText"
            borderRadius={config.card.button.borderRadius}
            paddingVertical={config.card.button.padding.vertical}
            paddingHorizontal={config.card.button.padding.horizontal}
            fontSize={config.card.button.fontSize}
            fontWeight="700"
            onPress={item.onAction}
          >
            {item.actionLabel}
          </Button>
        )}
      </XStack>
    </YStack>
  );
}

type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string | 'all';
  onSelectCategory: (category: string | 'all') => void;
  allLabel: string;
  categoryLabel: string;
  config: MobileCalendarConfig;
};

function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  allLabel,
  categoryLabel,
  config,
}: CategoryFilterProps) {
  const renderCategoryButton = (category: string | 'all', label: string) => {
    const isSelected = selectedCategory === category;

    return (
      <Button
        key={category}
        chromeless
        onPress={() => onSelectCategory(category)}
        paddingHorizontal={config.category.padding.horizontal}
        paddingVertical={config.category.padding.vertical}
        borderRadius={config.category.borderRadius}
        backgroundColor="transparent"
        borderWidth={0}
        flexShrink={0}
      >
        <XStack
          alignItems="center"
          gap="$1"
        >
          <YStack
            width={config.category.dotSize}
            height={config.category.dotSize}
            borderRadius={999}
            backgroundColor={
              isSelected ? '$myLessonsPrimaryButton' : '$myLessonsLessonsSecondaryText'
            }
          />
          <Text
            color={isSelected ? '$myLessonsLessonsPrimaryText' : '$myLessonsLessonsSecondaryText'}
            fontSize={config.category.fontSize}
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
          renderCategoryButton(category, `${category} ${categoryLabel}`)
        )}
      </XStack>
    </ScrollView>
  );
}

export type MobileCalendarProps = {
  config: MobileCalendarConfig;
  calendar: MobileCalendarMeta;
  items: MobileCalendarItem[];
  defaultAvatarUrl: string;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
  enableCategoryFilter?: boolean;
  categoryAllLabel?: string;
  categoryLabel?: string;
  emptyMessage?: string;
  renderContent?: (items: MobileCalendarItem[]) => ReactNode;
};

export function MobileCalendar({
  config,
  calendar,
  items,
  defaultAvatarUrl,
  onPrevWeek,
  onNextWeek,
  enableCategoryFilter = false,
  categoryAllLabel = 'All',
  categoryLabel = 'Items',
  emptyMessage = 'No items for this day',
  renderContent,
}: MobileCalendarProps) {
  const locale = useLocale();
  const theme = useTheme();
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => calendar.currentDayIndex ?? 0);
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');

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

  const selectedDayItems = useMemo(
    () => items.filter((item) => item.dayIndex === selectedDayIndex),
    [items, selectedDayIndex]
  );

  const categories = useMemo(
    () =>
      Array.from(new Set(selectedDayItems.map((item) => item.category).filter(Boolean))) as string[],
    [selectedDayItems]
  );

  useEffect(() => {
    if (selectedCategory !== 'all' && !categories.includes(selectedCategory)) {
      setSelectedCategory('all');
    }
  }, [categories, selectedCategory]);

  const filteredItems = useMemo(
    () =>
      selectedCategory === 'all'
        ? selectedDayItems
        : selectedDayItems.filter((item) => item.category === selectedCategory),
    [selectedCategory, selectedDayItems]
  );

  const chevronColor = theme.myLessonsMonthNav?.val;
  const currentDayIndex = calendar.currentDayIndex;

  const defaultRenderContent = (itemsToRender: MobileCalendarItem[]) => (
    <YStack
      gap={10}
      width="100%"
    >
      {itemsToRender.length > 0 ? (
        itemsToRender.map((item) => (
          <MobileCalendarCard
            key={item.id}
            item={item}
            defaultAvatarUrl={defaultAvatarUrl}
            config={config}
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
            {emptyMessage}
          </Text>
        </YStack>
      )}
    </YStack>
  );

  const finalRenderContent = renderContent ?? defaultRenderContent;

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
        {localizedWeekDays.map((day, index) => {
          const isActive = selectedDayIndex === index;
          const isToday = currentDayIndex === index;
          
          return (
            <WeekDayButton
              key={`${day.shortLabel}-${day.dateLabel}-${index}`}
              day={day.shortLabel}
              date={day.dateLabel}
              isActive={isActive}
              isToday={isToday}
              onPress={() => setSelectedDayIndex(index)}
              config={config.weekDay}
            />
          );
        })}
      </XStack>

      {enableCategoryFilter && categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          allLabel={categoryAllLabel}
          categoryLabel={categoryLabel}
          config={config}
        />
      )}

      {finalRenderContent(filteredItems)}
    </YStack>
  );
}
