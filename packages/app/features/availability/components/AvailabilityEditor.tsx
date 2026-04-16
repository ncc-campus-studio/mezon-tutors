'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import {
  Button,
  Paragraph,
  Text,
  XStack,
  YStack,
  Label,
} from '@mezon-tutors/app/ui';
import {
  CalendarIcon,
  TrashIcon,
  PlusCircleIcon,
  ArrowRightIcon,
} from '@mezon-tutors/app/ui/icons';
import { DAY_KEYS, getDayKey, DEFAULT_AVAILABILITY_SLOT, AVAILABILITY_EDITOR_CONFIG, timeToMinutes } from '@mezon-tutors/shared';
import { TimePicker } from './TimePicker';
import type { TimeSlot, AvailabilityData, AvailabilityEditorMode } from '../types';
import { useTheme } from 'tamagui';

type AvailabilityEditorProps = {
  initialData?: AvailabilityData;
  onSave: (data: AvailabilityData) => Promise<void> | void;
  onCancel?: () => void;
  showActions?: boolean;
  isSaving?: boolean;
  onSubmitReady?: (submitFn: () => void) => void;
};

export function AvailabilityEditor({
  initialData,
  onSave,
  onCancel,
  showActions = false,
  isSaving = false,
  onSubmitReady,
}: AvailabilityEditorProps) {
  const t = useTranslations('TutorProfile.Availability');
  const theme = useTheme();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const availabilityCardRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<AvailabilityData>({
    defaultValues: initialData ?? {
      slotsByDay: Object.fromEntries(DAY_KEYS.map((d) => [d, []])),
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  const validateWeeklySlots = (values: AvailabilityData): boolean => {
    const slotsByDay = values.slotsByDay ?? {};
    const hasAnySlot = DAY_KEYS.some((day) => (slotsByDay[day] ?? []).length > 0);

    if (!hasAnySlot) {
      setError('slotsByDay', { type: 'manual', message: t('validation.weeklySlotsRequired') });
      availabilityCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }

    for (const day of DAY_KEYS) {
      const daySlots = slotsByDay[day] ?? [];
      for (const slot of daySlots) {
        if (!slot.startTime || !slot.endTime) {
          setError('slotsByDay', { type: 'manual', message: t('validation.timeRequired') });
          availabilityCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return false;
        }

        const startMinutes = timeToMinutes(slot.startTime);
        const endMinutes = timeToMinutes(slot.endTime);

        if (startMinutes >= endMinutes) {
          setError('slotsByDay', { 
            type: 'manual', 
            message: t('validation.endTimeMustBeAfterStartTime') 
          });
          availabilityCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return false;
        }
      }
    }

    clearErrors('slotsByDay');
    return true;
  };

  const handleSaveClick = async (values: AvailabilityData) => {
    if (!validateWeeklySlots(values)) return;
    await onSave(values);
  };

  useEffect(() => {
    if (onSubmitReady) {
      const submitFn = () => {
        handleSubmit(handleSaveClick)();
      };
      onSubmitReady(submitFn);
    }
  }, []);

  const dayKey = getDayKey(selectedDayIndex);
  const slotsByDayForm = watch('slotsByDay');
  const unsortedSlots = slotsByDayForm?.[dayKey] ?? [];
  
  const slotsWithIndex = useMemo(() => {
    return unsortedSlots.map((slot, originalIndex) => ({
      slot,
      originalIndex,
    })).sort((a, b) => {
      const aMinutes = timeToMinutes(a.slot.startTime);
      const bMinutes = timeToMinutes(b.slot.startTime);
      return aMinutes - bMinutes;
    });
  }, [unsortedSlots]);

  const addSlot = () => {
    const current = form.getValues('slotsByDay') ?? {};
    const daySlots = current[dayKey] ?? [];
    setValue('slotsByDay', {
      ...current,
      [dayKey]: [...daySlots, { ...DEFAULT_AVAILABILITY_SLOT }],
    });
    clearErrors('slotsByDay');
  };

  const removeSlot = (index: number) => {
    const current = form.getValues('slotsByDay') ?? {};
    const daySlots = (current[dayKey] ?? []).filter((_, i) => i !== index);
    setValue('slotsByDay', { ...current, [dayKey]: daySlots });
  };

  const updateSlot = (index: number, patch: Partial<TimeSlot>) => {
    const current = form.getValues('slotsByDay') ?? {};
    const list = [...(current[dayKey] ?? [])];
    list[index] = { ...list[index], ...patch };
    setValue('slotsByDay', { ...current, [dayKey]: list });
  };

  const dayTabs = t.raw('availability.tabs') as string[];

  return (
    <YStack gap="$4">
      <YStack
        ref={availabilityCardRef}
        backgroundColor="$backgroundCard"
        borderRadius="$4"
        padding="$6"
        gap="$4"
        borderWidth={1}
        borderColor="$borderSubtle"
        $xs={{ padding: '$4' }}
      >
        <XStack alignItems="center" gap="$2">
          <CalendarIcon size={AVAILABILITY_EDITOR_CONFIG.iconSize} color={theme.blue10?.val || '$blue10'} />
          <Paragraph fontWeight="700" fontSize={AVAILABILITY_EDITOR_CONFIG.titleFontSize}>
            {t('availabilityCardTitle')}
          </Paragraph>
        </XStack>

        <XStack gap="$2" flexWrap="wrap">
          {dayTabs.map((label, index) => (
            <Button
              key={label}
              variant={selectedDayIndex === index ? 'primary' : 'ghost'}
              size="$3"
              onPress={() => setSelectedDayIndex(index)}
            >
              {label}
            </Button>
          ))}
        </XStack>

        <YStack gap="$3">
          {slotsWithIndex.map(({ slot, originalIndex }) => (
            <XStack
              key={originalIndex}
              gap="$2"
              alignItems="flex-end"
              flexWrap="wrap"
              $xs={{ flexDirection: 'column', alignItems: 'stretch' }}
            >
              <YStack gap="$1" flex={1} minWidth={AVAILABILITY_EDITOR_CONFIG.timePickerMinWidth}>
                <Label color="$colorMuted" fontSize={AVAILABILITY_EDITOR_CONFIG.labelFontSize}>
                  {t('availability.from')}
                </Label>
                <TimePicker
                  value={slot.startTime}
                  onChange={(v) => updateSlot(originalIndex, { startTime: v })}
                  placeholder={DEFAULT_AVAILABILITY_SLOT.startTime}
                />
              </YStack>
              <Text>
                <ArrowRightIcon size={AVAILABILITY_EDITOR_CONFIG.arrowIconSize} />
              </Text>

              <YStack gap="$1" flex={1} minWidth={AVAILABILITY_EDITOR_CONFIG.timePickerMinWidth}>
                <Label color="$colorMuted" fontSize={AVAILABILITY_EDITOR_CONFIG.labelFontSize}>
                  {t('availability.to')}
                </Label>
                <TimePicker
                  value={slot.endTime}
                  onChange={(v) => updateSlot(originalIndex, { endTime: v })}
                  placeholder={DEFAULT_AVAILABILITY_SLOT.endTime}
                />
              </YStack>
              <Button variant="ghost" size="$2" padding="$2" onPress={() => removeSlot(originalIndex)}>
                <TrashIcon size={AVAILABILITY_EDITOR_CONFIG.trashIconSize} color={theme.red10?.val || '$red10'} />
              </Button>
            </XStack>
          ))}

          <Button
            backgroundColor="$myScheduleAddButtonBg"
            borderRadius="$3"
            padding="$3"
            marginTop="$2"
            onPress={addSlot}
            hoverStyle={{
              backgroundColor: '$blue11',
            }}
          >
            <XStack alignItems="center" gap="$2">
              <PlusCircleIcon size={AVAILABILITY_EDITOR_CONFIG.plusIconSize} color={theme.myScheduleAddButtonIcon?.val || 'white'} />
              <Text size="sm" color="$myScheduleAddButtonText" fontWeight="600">
                {t('availability.addSlot')}
              </Text>
            </XStack>
          </Button>
          {errors.slotsByDay?.message && (
            <Text size="md" color="$red10">
              {errors.slotsByDay?.message}
            </Text>
          )}
        </YStack>
      </YStack>

      {showActions && (
        <XStack gap="$3" justifyContent="flex-end">
          {onCancel && (
            <Button variant="outline" onPress={onCancel} disabled={isSaving}>
              {t('cancel')}
            </Button>
          )}
          <Button variant="primary" onPress={handleSubmit(handleSaveClick)} disabled={isSaving}>
            {isSaving ? t('saving') : t('save')}
          </Button>
        </XStack>
      )}
    </YStack>
  );
}
