import { CalendarCard } from '@mezon-tutors/app';
import type { CalendarEvent, CalendarWeekDay } from '@mezon-tutors/app';
import { Button, Text, YStack } from '@mezon-tutors/app/ui';
import type { TutorDetailAvailabilitySlotDto } from '@mezon-tutors/shared';
import { getFallbackWeekHours } from '@mezon-tutors/shared';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useMedia } from 'tamagui';
import { TutorScheduleEventCard } from './TutorScheduleEventCard';
import { TutorScheduleModal } from './TutorScheduleModal';
import { parseTimeToHour } from './utils/schedule-time';
import { mergeConsecutiveSlotsInSameHour, getWeekHoursFromSlots } from './utils/schedule-slots';
import type { TutorScheduleTabProps } from './types';

function buildTutorScheduleWeekDays(locale: string): CalendarWeekDay[] {
  const now = dayjs();
  const dayOfWeek = now.day();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = now.subtract(mondayOffset, 'day');

  return Array.from({ length: 7 }, (_, index) => {
    const date = monday.add(index, 'day').locale(locale);
    return {
      shortLabel: date.format('ddd').toUpperCase(),
      dateLabel: date.format('DD'),
      fullDate: date.toDate(),
    };
  });
}

function convertSlotsToEvents(
  slots: TutorDetailAvailabilitySlotDto[]
): CalendarEvent<TutorDetailAvailabilitySlotDto>[] {
  const activeSlots = slots.filter((slot) => slot.isActive);
  const mergedSlots = mergeConsecutiveSlotsInSameHour(activeSlots);
  
  return mergedSlots.map((slot) => {
    const startHour = parseTimeToHour(slot.startTime);
    const flooredStartHour = Math.floor(startHour);
    
    return {
      id: `${slot.dayOfWeek}-${slot.startTime}-${slot.endTime}`,
      dayIndex: slot.dayOfWeek,
      startHour: flooredStartHour,
      endHour: flooredStartHour + 1,
      data: slot,
    };
  });
}

export function TutorScheduleTab({ tutor }: TutorScheduleTabProps) {
  const t = useTranslations('Tutors.Detail');
  const locale = useLocale();
  const media = useMedia();
  const isCompact = media.md || media.sm || media.xs;
  const isMobile = media.sm || media.xs;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const weekDays = useMemo(() => buildTutorScheduleWeekDays(locale), [locale]);
  const weekHours = useMemo(() => {
    const hours = getWeekHoursFromSlots(tutor.availability);
    return hours.length > 0 ? hours : getFallbackWeekHours();
  }, [tutor.availability]);
  const events = useMemo(() => convertSlotsToEvents(tutor.availability), [tutor.availability]);

  if (isMobile) {
    return (
      <>
        <YStack gap="$3">
          <Text 
            color="$tutorsDetailSecondaryText" 
            fontSize={14}
            textAlign="center"
          >
            {t('scheduleDescription')}
          </Text>
          <Button
            variant="outline"
            onPress={() => setIsModalOpen(true)}
            size="large"
          >
            <Text fontWeight="600">{t('mobileSchedule.seeMySchedule')}</Text>
          </Button>
        </YStack>

        <TutorScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          weekDays={weekDays}
          availability={tutor.availability}
          timezone={tutor.timezone}
        />
      </>
    );
  }

  return (
    <CalendarCard
      type="tutorSchedule"
      weekDays={weekDays}
      weekHours={weekHours}
      events={events}
      enableGapCollapse
      readonly
      renderEvent={(event, compact) => (
        <TutorScheduleEventCard
          slot={event.data}
          isCompact={compact}
        />
      )}
      isCompact={isCompact}
      presetData={{
        title: t('scheduleTitle'),
        subtitle: t('scheduleHint', { timezone: tutor.timezone }),
      }}
    />
  );
}
