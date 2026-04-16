'use client';

import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';
import { Screen, ScrollView, Text, YStack } from '@mezon-tutors/app/ui';
import { isLoadingAtom, userAtom } from '@mezon-tutors/app/store/auth.atom';
import { useMedia } from 'tamagui';
import dayjs from 'dayjs';
import { MyLessonsCalendarSection } from './components/MyLessonsCalendarSection';
import { MyLessonsHeader } from './components/MyLessonsHeader';
import { MyLessonsLessonsPanel } from './components/MyLessonsLessonsPanel';
import { MyLessonsPromoCard } from './components/MyLessonsPromoCard';
import { MyLessonsTutorsPanel } from './components/MyLessonsTutorsPanel';
import { getMyLessonsDataByMezonUserId } from './data-source';
import { useMyLessons } from './hooks/useMyLessons';
import type { MyLessonsTab, MyLessonsViewData } from './types';

export function MyLessonsScreen() {
  const t = useTranslations('MyLessons');
  const [activeTab, setActiveTab] = useState<MyLessonsTab>('calendar');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const user = useAtomValue(userAtom);
  const isAuthLoading = useAtomValue(isLoadingAtom);

  const { data, isLoading } = useMyLessons(user?.mezonUserId, selectedDate);

  const media = useMedia();
  const isNarrow = media.md || media.sm || media.xs;

  const handlePrevWeek = () => {
    setSelectedDate((prev) => prev.subtract(7, 'day'));
  };

  const handleNextWeek = () => {
    setSelectedDate((prev) => prev.add(7, 'day'));
  };

  const isDataLoading = isAuthLoading || isLoading;

  return (
    <Screen backgroundColor="$myLessonsPageBackground">
      <YStack minHeight="100vh" backgroundColor="$myLessonsPageBackground">
        <ScrollView flex={1} contentContainerStyle={{ paddingBottom: 16 }}>
          <YStack
            width="100%"
            maxWidth={1320}
            marginHorizontal="auto"
            paddingHorizontal={isNarrow ? 12 : 28}
            paddingVertical={isNarrow ? 12 : 24}
            gap="$5"
          >
            <MyLessonsHeader activeTab={activeTab} onTabChange={setActiveTab} />

            {isDataLoading ? (
              <YStack
                width="100%"
                minHeight={220}
                borderWidth={1}
                borderColor="$myLessonsCardBorder"
                borderRadius={16}
                backgroundColor="$myLessonsCardBackground"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="$myLessonsLessonsSecondaryText" fontSize={14}>
                  {t('screen.loading')}
                </Text>
              </YStack>
            ) : null}

            {data && activeTab === 'calendar' ? (
              isNarrow ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <MyLessonsCalendarSection 
                    calendar={data.calendar} 
                    lessons={data.calendarLessons}
                    onPrevWeek={handlePrevWeek}
                    onNextWeek={handleNextWeek}
                  />
                </ScrollView>
              ) : (
                <MyLessonsCalendarSection 
                  calendar={data.calendar} 
                  lessons={data.calendarLessons}
                  onPrevWeek={handlePrevWeek}
                  onNextWeek={handleNextWeek}
                />
              )
            ) : null}

            {data && activeTab === 'lessons' ? (
              <YStack gap="$5" width="100%" maxWidth={1032} alignSelf="center">
                <MyLessonsPromoCard />
                <MyLessonsLessonsPanel
                  upcomingLessons={data.upcomingLessons}
                  previousLessons={data.previousLessons}
                />
              </YStack>
            ) : null}

            {data && activeTab === 'tutors' ? <MyLessonsTutorsPanel tutors={data.tutors} /> : null}
          </YStack>
        </ScrollView>
      </YStack>
    </Screen>
  );
}
