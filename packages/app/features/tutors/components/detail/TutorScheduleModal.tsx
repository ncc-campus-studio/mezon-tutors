'use client';

import { Button, Dialog, ScrollView, Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { AfternoonIcon, ArrowLeftIcon, MoonIcon, SunIcon } from '@mezon-tutors/app/ui/icons';
import type { TutorDetailAvailabilitySlotDto } from '@mezon-tutors/shared';
import {
  MOBILE_CALENDAR_CONFIGS,
  TUTOR_SCHEDULE_SLOT_CONTAINER_PROPS,
} from '@mezon-tutors/shared/src/constants/calendar';
import { useTranslations } from 'next-intl';
import { useMemo, type ReactNode } from 'react';
import type { CalendarWeekDay, MobileCalendarItem, MobileCalendarMeta } from '@mezon-tutors/app';
import { MobileCalendar } from '@mezon-tutors/app';
import dayjs from 'dayjs';
import { useTheme } from 'tamagui';
import {
  getPeriodByTime,
  isRoundHour,
  parseTimeToHour,
  type SchedulePeriod,
} from './utils/schedule-time';
import type { TutorSchedulePeriodSectionProps } from './types';

type TutorScheduleItem = MobileCalendarItem & {
  slot: TutorDetailAvailabilitySlotDto;
};

function SlotColumn({ slots }: { slots: TutorDetailAvailabilitySlotDto[] }) {
  if (!slots.length) {
    return <YStack />;
  }

  return (
    <>
      {slots.map((slot) => (
        <YStack
          key={`${slot.dayOfWeek}-${slot.startTime}-${slot.endTime}`}
          {...TUTOR_SCHEDULE_SLOT_CONTAINER_PROPS}
        >
          <Text
            color="$tutorsDetailPrimaryText"
            fontWeight="600"
            textAlign="center"
            fontSize={13}
          >
            {slot.startTime}
          </Text>
        </YStack>
      ))}
    </>
  );
}

function PeriodSection({ icon, title, slots, emptyText }: TutorSchedulePeriodSectionProps) {
  const roundHourSlots = slots.filter((slot) => isRoundHour(slot.startTime));
  const halfHourSlots = slots.filter((slot) => !isRoundHour(slot.startTime));

  return (
    <YStack gap={12}>
      <XStack
        alignItems="center"
        gap="$2"
      >
        {icon}
        <Text
          fontWeight="700"
          color="$tutorsDetailPrimaryText"
          fontSize={14}
        >
          {title}
        </Text>
      </XStack>

      {slots.length > 0 ? (
        <XStack
          gap="$2"
          width="100%"
        >
          <YStack
            flex={1}
            flexBasis={0}
            gap="$2"
          >
            <SlotColumn slots={roundHourSlots} />
          </YStack>

          <YStack
            flex={1}
            flexBasis={0}
            gap="$2"
          >
            <SlotColumn slots={halfHourSlots} />
          </YStack>
        </XStack>
      ) : (
        <Text
          color="$tutorsDetailSecondaryText"
          fontSize={12}
        >
          {emptyText}
        </Text>
      )}
    </YStack>
  );
}

type TutorScheduleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  weekDays: CalendarWeekDay[];
  availability: TutorDetailAvailabilitySlotDto[];
  timezone: string;
};

export function TutorScheduleModal({
  isOpen,
  onClose,
  weekDays,
  availability,
  timezone,
}: TutorScheduleModalProps) {
  const t = useTranslations('Tutors.Detail');
  const theme = useTheme();
  const config = MOBILE_CALENDAR_CONFIGS.tutorSchedule;

  const currentDayIndex = useMemo(() => {
    const dayOfWeek = dayjs().day();
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  }, []);

  const calendarItems: TutorScheduleItem[] = useMemo(
    () =>
      availability
        .filter((slot) => slot.isActive)
        .map((slot) => ({
          id: `${slot.dayOfWeek}-${slot.startTime}-${slot.endTime}`,
          dayIndex: slot.dayOfWeek,
          timeLabel: slot.startTime,
          title: slot.startTime,
          person: { name: '', avatar: '' },
          slot,
        })),
    [availability]
  );

  const calendar: MobileCalendarMeta = useMemo(
    () => ({
      title: dayjs(weekDays[0]?.fullDate ?? new Date()).format('MMMM YYYY'),
      weekDays,
      currentDayIndex,
    }),
    [weekDays, currentDayIndex]
  );

  const renderScheduleContent = (items: MobileCalendarItem[]) => {
    const slots = (items as TutorScheduleItem[]).map((item) => item.slot);
    const sortedSlots = [...slots].sort(
      (a, b) => parseTimeToHour(a.startTime) - parseTimeToHour(b.startTime)
    );

    const slotsByPeriod: Record<SchedulePeriod, TutorDetailAvailabilitySlotDto[]> = {
      morning: sortedSlots.filter((slot) => getPeriodByTime(slot.startTime) === 'morning'),
      afternoon: sortedSlots.filter((slot) => getPeriodByTime(slot.startTime) === 'afternoon'),
      evening: sortedSlots.filter((slot) => getPeriodByTime(slot.startTime) === 'evening'),
    };

    const periodSections: Array<{
      key: SchedulePeriod;
      title: string;
      icon: ReactNode;
    }> = [
      {
        key: 'morning',
        title: t('mobileSchedule.periods.morning'),
        icon: (
          <SunIcon
            size={20}
            color={theme.tutorsDetailScheduleMorningIcon?.get()}
          />
        ),
      },
      {
        key: 'afternoon',
        title: t('mobileSchedule.periods.afternoon'),
        icon: (
          <AfternoonIcon
            size={20}
            color={theme.tutorsDetailScheduleAfternoonIcon?.get()}
          />
        ),
      },
      {
        key: 'evening',
        title: t('mobileSchedule.periods.evening'),
        icon: (
          <MoonIcon
            size={20}
            color={theme.tutorsDetailScheduleEveningIcon?.get()}
          />
        ),
      },
    ];

    return (
      <YStack gap={16}>
        <Text
          color="$tutorsDetailSecondaryText"
          fontSize={13}
        >
          {t('scheduleHint', { timezone })}
        </Text>

        {periodSections.map(({ key, title, icon }) =>
          slotsByPeriod[key].length > 0 ? (
            <PeriodSection
              key={key}
              icon={icon}
              title={title}
              slots={slotsByPeriod[key]}
              emptyText={t('scheduleEmpty')}
            />
          ) : null
        )}
      </YStack>
    );
  };

  return (
    <Dialog modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="black"
        />
        <Dialog.Content
          key="content"
          animateOnly={['transform']}
          animation="100ms"
          enterStyle={{ y: '100%' }}
          exitStyle={{ y: '100%' }}
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          width="100%"
          height="100%"
          maxWidth="100%"
          maxHeight="100%"
          backgroundColor="$tutorsDetailCardBackground"
          padding={0}
          margin={0}
          borderRadius={0}
          minHeight={0}
        >
          <Dialog.Title
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: 'hidden',
              opacity: 0,
            }}
          >
            {t('scheduleTitle')}
          </Dialog.Title>

          <YStack
            position="absolute"
            top={0}
            left={0}
            right={0}
            zIndex={10}
            backgroundColor="$tutorsDetailCardBackground"
            paddingHorizontal={20}
            borderBottomWidth={2}
            borderBottomColor="$borderColor"
          >
            <Button
              chromeless
              onPress={onClose}
              padding={0}
              alignSelf="flex-start"
            >
              <ArrowLeftIcon
                size={24}
                color={theme.tutorsDetailScheduleBackButton?.get()}
              />
            </Button>
          </YStack>

          <ScrollView
            flex={1}
            minHeight={0}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 40,
              paddingHorizontal: 20,
              paddingBottom: 120,
            }}
          >
            <YStack
              paddingHorizontal="$1"
              paddingBottom="$4"
            >
              <MobileCalendar
                config={config}
                calendar={calendar}
                items={calendarItems}
                defaultAvatarUrl=""
                renderContent={renderScheduleContent}
              />
            </YStack>
          </ScrollView>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
