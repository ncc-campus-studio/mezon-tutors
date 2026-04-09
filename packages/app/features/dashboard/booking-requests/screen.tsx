'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';
import { Button, Pagination, Screen, ScrollView, Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { BOOKING_REQUEST_FILTERS } from '@mezon-tutors/shared';
import { useMedia } from 'tamagui';
import { isLoadingAtom, userAtom } from '@mezon-tutors/app/store/auth.atom';
import { getTutorBookingRequestsByMezonUserId } from './data-source';
import type { BookingRequestFilter, BookingRequestsViewData } from './types';
import { BookingRequestTable } from './components/BookingRequestTable';
import { BookingRequestSummaryCards } from './components/BookingRequestSummaryCards';

export function TutorBookingRequestsScreen() {
  const t = useTranslations('Dashboard.bookingRequests');
  const media = useMedia();
  const isCompact = media.md || media.sm || media.xs;

  const user = useAtomValue(userAtom);
  const isAuthLoading = useAtomValue(isLoadingAtom);

  const pageSize = 5;
  const [activeFilter, setActiveFilter] = useState<BookingRequestFilter>('all');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<BookingRequestsViewData | null>(null);

  useEffect(() => {
    let active = true;

    if (isAuthLoading) {
      return () => {
        active = false;
      };
    }

    const loadData = async () => {
      const payload = await getTutorBookingRequestsByMezonUserId(user?.mezonUserId, {
        filter: activeFilter,
        page,
        pageSize,
      });
      if (active) {
        setData(payload);
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [activeFilter, isAuthLoading, page, pageSize, user?.mezonUserId]);

  const pendingCount = useMemo(
    () => (activeFilter === 'pending' ? data?.total ?? 0 : data?.requests.filter((item) => item.status === 'pending').length ?? 0),
    [data]
  );

  const handleFilterChange = (filter: BookingRequestFilter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleApprove = (requestId: string) => {
    console.info('Approve booking request', requestId);
  };

  const handleDecline = (requestId: string) => {
    console.info('Decline booking request', requestId);
  };

  const handleMessage = (requestId: string) => {
    console.info('Message booking request', requestId);
  };

  const handleFeedback = (requestId: string) => {
    console.info('Feedback booking request', requestId);
  };

  const actions = {
    onApprove: handleApprove,
    onDecline: handleDecline,
    onMessage: handleMessage,
    onFeedback: handleFeedback,
  };

  return (
    <Screen backgroundColor="$dashboardTutorPageBackground">
      <ScrollView flex={1} contentContainerStyle={{ paddingBottom: 24 }}>
        <YStack width="100%" maxWidth={1220} marginHorizontal="auto" padding={isCompact ? '$3' : '$5'} gap="$4">
          <YStack
            position="relative"
            borderWidth={1}
            borderColor="$dashboardTutorCardBorder"
            borderRadius={20}
            backgroundColor="$dashboardTutorCardBackground"
            padding={isCompact ? '$3' : '$5'}
            gap="$4"
            overflow="hidden"
            style={{ boxShadow: '0 20px 42px rgba(3,10,26,0.36)' }}
          >
            <YStack gap="$1.5" position="relative">
              <Text
                color="$dashboardTutorTextPrimary"
                fontSize={isCompact ? 40 : 52}
                lineHeight={isCompact ? 44 : 56}
                fontWeight="800"
                letterSpacing={-1.5}
              >
                {t('title')}
              </Text>
              <Text color="$dashboardTutorTextSecondary" fontSize={isCompact ? 14 : 16} lineHeight={isCompact ? 20 : 24} opacity={0.85}>
                {t('subtitle', { count: pendingCount })}
              </Text>
            </YStack>

            <XStack gap="$2" flexWrap="wrap">
              {BOOKING_REQUEST_FILTERS.map((filter) => {
                const active = activeFilter === filter;
                return (
                  <Button
                    key={filter}
                    height={38}
                    paddingHorizontal="$4"
                    borderRadius={10}
                    borderWidth={1}
                    borderColor={active ? '$dashboardTutorFilterActiveBg' : '$dashboardTutorFilterInactiveBorder'}
                    backgroundColor={active ? '$dashboardTutorFilterActiveBg' : '$dashboardTutorFilterInactiveBg'}
                    onPress={() => handleFilterChange(filter)}
                    style={{ cursor: 'pointer' }}
                    hoverStyle={{
                      borderColor: '$dashboardTutorFilterActiveBg',
                      opacity: 0.9,
                    }}
                  >
                    <Text
                      color={active ? '$dashboardTutorFilterActiveText' : '$dashboardTutorFilterInactiveText'}
                      fontSize={11}
                      lineHeight={14}
                      fontWeight="800"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                    >
                      {t(`filters.${filter}`)}
                    </Text>
                  </Button>
                );
              })}
            </XStack>

            <BookingRequestTable
              requests={data?.requests ?? []}
              isCompact={isCompact}
              actions={actions}
            />

            <Pagination
              page={data?.page ?? page}
              totalPages={data?.totalPages ?? 1}
              onPageChange={setPage}
              disabled={!data || data.total === 0}
            />

            <BookingRequestSummaryCards metrics={data?.metrics ?? []} isCompact={isCompact} />
          </YStack>
        </YStack>
      </ScrollView>
    </Screen>
  );
}
