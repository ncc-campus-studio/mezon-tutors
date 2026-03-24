'use client';

import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';
import { Screen, ScrollView, Text, YStack } from '@mezon-tutors/app/ui';
import { isLoadingAtom, userAtom } from '@mezon-tutors/app/store/auth.atom';
import { useMedia } from 'tamagui';
import { MyLessonsCalendarSection } from './components/MyLessonsCalendarSection';
import { MyLessonsHeader } from './components/MyLessonsHeader';
import { MyLessonsLessonsPanel } from './components/MyLessonsLessonsPanel';
import { MyLessonsPromoCard } from './components/MyLessonsPromoCard';
import { MyLessonsTopNav } from './components/MyLessonsTopNav';
import { MyLessonsTutorsPanel } from './components/MyLessonsTutorsPanel';
import { getMyLessonsDataByMezonUserId } from './data-source';
import type { MyLessonsTab, MyLessonsViewData } from './types';

export function MyLessonsScreen() {
  const t = useTranslations('MyLessons');
  const [activeTab, setActiveTab] = useState<MyLessonsTab>('calendar');
  const [data, setData] = useState<MyLessonsViewData | null>(null);
  const user = useAtomValue(userAtom);
  const isAuthLoading = useAtomValue(isLoadingAtom);

  const media = useMedia();
  const isNarrow = media.md || media.sm || media.xs;

  useEffect(() => {
    let isMounted = true;

    if (isAuthLoading) {
      return () => {
        isMounted = false;
      };
    }

    const loadData = async () => {
      const payload = await getMyLessonsDataByMezonUserId(user?.mezonUserId);
      if (isMounted) {
        setData(payload);
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [isAuthLoading, user?.mezonUserId]);

  return (
    <Screen backgroundColor="$myLessonsPageBackground">
      <YStack minHeight="100vh" backgroundColor="$myLessonsPageBackground">
        <MyLessonsTopNav user={user} />

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

            {!data ? (
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
                  <MyLessonsCalendarSection calendar={data.calendar} lessons={data.calendarLessons} />
                </ScrollView>
              ) : (
                <MyLessonsCalendarSection calendar={data.calendar} lessons={data.calendarLessons} />
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

            <YStack width="100%" alignItems="flex-end" paddingVertical="$2">
              <Text color="$myLessonsFooterText" fontSize={12}>
                {t('previewFooter')}
              </Text>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </Screen>
  );
}
