'use client';

import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Button, Container, Paragraph, Screen, Text, XStack, YStack, ScrollView, Input, Label } from '@mezon-tutors/app/ui';
import { WalletIcon, CalendarIcon, TrashIcon, PlusCircleIcon, ArrowRightIcon } from '@mezon-tutors/app/ui/icons';
import {
  selectedDayIndexAtom,
  hourlyRateAtom,
  slotsByDayAtom,
  getDayKey,
  defaultSlot,
  type TimeSlot,
  submitTutorProfileAtom,
} from '@mezon-tutors/app/store/tutor-profile.atom';
import { TutorProfileProgress } from './components/tutor-profile-progress';
import { TutorProfileHeader } from './components/tutor-profile-header';
import { TutorProfileStickyActions } from './components/tutor-profile-sticky-actions';
import { tutorProfileLastSavedAtAtom } from '@mezon-tutors/app/store/tutor-profile.atom';

const ICON_COLOR = '#1253D5';
const CURRENT_STEP = 5;
const PROGRESS_PERCENT = (CURRENT_STEP - 1) * 20;

type AvailabilityFormValues = {
  hourlyRate: string;
};

function formatLastSavedTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function TutorProfileAvailabilityScreen() {
  const t = useTranslations('TutorProfile.Availability');
  const router = useRouter();
  const selectedDayIndex = useAtomValue(selectedDayIndexAtom);
  const setSelectedDayIndex = useSetAtom(selectedDayIndexAtom);
  const hourlyRate = useAtomValue(hourlyRateAtom);
  const setHourlyRate = useSetAtom(hourlyRateAtom);
  const slotsByDay = useAtomValue(slotsByDayAtom);
  const setSlotsByDay = useSetAtom(slotsByDayAtom);
  const submitProfile = useSetAtom(submitTutorProfileAtom);
  const lastSavedAt = useAtomValue(tutorProfileLastSavedAtAtom);
  const setLastSavedAt = useSetAtom(tutorProfileLastSavedAtAtom);

  const form = useForm<AvailabilityFormValues>({
    defaultValues: {
      hourlyRate: hourlyRate ?? '',
    },
    mode: 'onChange',
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    reset({ hourlyRate: hourlyRate ?? '' });
  }, [hourlyRate, reset]);

  const draftSavedLabel =
    lastSavedAt && formatLastSavedTime(lastSavedAt)
      ? t('draftSaved', { time: formatLastSavedTime(lastSavedAt) })
      : '';

  const dayTabs = t.raw('availability.tabs') as string[];
  const dayKey = getDayKey(selectedDayIndex);
  const slots = slotsByDay[dayKey] ?? [];

  const addSlot = () => {
    setSlotsByDay((prev) => ({
      ...prev,
      [dayKey]: [...(prev[dayKey] ?? []), { ...defaultSlot }],
    }));
    setLastSavedAt(new Date().toISOString());
  };

  const removeSlot = (index: number) => {
    setSlotsByDay((prev) => ({
      ...prev,
      [dayKey]: (prev[dayKey] ?? []).filter((_, i) => i !== index),
    }));
    setLastSavedAt(new Date().toISOString());
  };

  const updateSlot = (index: number, patch: Partial<TimeSlot>) => {
    setSlotsByDay((prev) => {
      const list = [...(prev[dayKey] ?? [])];
      list[index] = { ...list[index], ...patch };
      return { ...prev, [dayKey]: list };
    });
    setLastSavedAt(new Date().toISOString());
  };

  const setHourlyRateValue = (value: string) => {
    setHourlyRate(value);
    setLastSavedAt(new Date().toISOString());
  };

  return (
    <Screen backgroundColor="$background">
      <YStack flex={1}>
        <ScrollView
          flex={1}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 100,
          }}
        >
        <YStack
          flex={1}
          paddingVertical="$5"
          paddingHorizontal="$0"
          $xs={{ paddingVertical: '$4', paddingHorizontal: '$3' }}
          backgroundColor="$background"
        >
          <Container padded maxWidth={960} width="100%" gap="$5" $xs={{ gap: '$4' }}>
            <TutorProfileHeader
              draftSavedLabel={draftSavedLabel}
              saveExitLabel={t('saveExit')}
            />

            <TutorProfileProgress
              currentStepIndex={CURRENT_STEP}
              stepLabel={t('stepLabel')}
              rightLabel={t('progressPercentLabel', { percent: PROGRESS_PERCENT })}
            />

            <YStack gap="$2">
              <Paragraph
                fontSize={24}
                fontWeight="700"
              >
                {t('title')}
              </Paragraph>
              <Text variant="muted">{t('subtitle')}</Text>
            </YStack>

            <YStack
              backgroundColor="$backgroundCard"
              borderRadius="$4"
              padding="$6"
              gap="$4"
              borderWidth={1}
              borderColor="$borderSubtle"
              $xs={{ padding: '$4' }}
            >
              <XStack
                alignItems="center"
                gap="$2"
              >
                <WalletIcon
                  size={24}
                  color={ICON_COLOR}
                />
                <Paragraph
                  fontWeight="700"
                  fontSize={18}
                >
                  {t('rateCardTitle')}
                </Paragraph>
              </XStack>
              <Text
                size="sm"
                variant="muted"
              >
                {t('rate.question')}
              </Text>
              <YStack gap="$2">
                <XStack
                  alignItems="stretch"
                  gap="$2"
                >
                  <XStack
                    flex={1}
                    alignItems="center"
                    height={48}
                    borderRadius="$5"
                    borderWidth={1}
                    borderColor="$borderSubtle"
                    backgroundColor="$fieldBackground"
                    paddingLeft="$4"
                  >
                    <Text
                      color="$colorMuted"
                      marginRight="$2"
                    >
                      $
                    </Text>
                    <Controller
                      control={control}
                      name="hourlyRate"
                      render={({ field: { value, onChange } }) => (
                        <Input
                          flex={1}
                          placeholder="0.00"
                          value={value}
                          onChangeText={(v) => {
                            onChange(v);
                            setHourlyRateValue(v);
                          }}
                          backgroundColor="transparent"
                          borderWidth={0}
                          color="$color"
                          paddingHorizontal="$2"
                          height={48}
                        />
                      )}
                    />
                  </XStack>
                  <YStack
                    paddingHorizontal="$4"
                    height={48}
                    borderRadius="$5"
                    borderWidth={1}
                    borderColor="$borderSubtle"
                    backgroundColor="$fieldBackground"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      size="sm"
                      variant="muted"
                    >
                      {t('rate.currencyLabel')}
                    </Text>
                  </YStack>
                </XStack>
                <Text
                  size="sm"
                  variant="muted"
                >
                  {t('rate.recommended')}
                </Text>
              </YStack>
            </YStack>

            <YStack
              backgroundColor="$backgroundCard"
              borderRadius="$4"
              padding="$6"
              gap="$4"
              borderWidth={1}
              borderColor="$borderSubtle"
              $xs={{ padding: '$4' }}
            >
              <XStack
                alignItems="center"
                gap="$2"
              >
                <CalendarIcon
                  size={24}
                  color={ICON_COLOR}
                />
                <Paragraph
                  fontWeight="700"
                  fontSize={18}
                >
                  {t('availabilityCardTitle')}
                </Paragraph>
              </XStack>

              <XStack
                gap="$2"
                flexWrap="wrap"
              >
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
                {slots.map((slot, index) => (
                  <XStack
                    key={index}
                    gap="$2"
                    alignItems="flex-end"
                    flexWrap="wrap"
                    $xs={{ flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    <YStack
                      gap="$1"
                      flex={1}
                      minWidth={120}
                    >
                      <Label
                        color="$colorMuted"
                        fontSize={13}
                      >
                        {t('availability.from')}
                      </Label>
                      <XStack
                        gap="$1"
                        alignItems="center"
                      >
                        <Input
                          flex={1}
                          value={slot.startTime}
                          onChangeText={(v) => updateSlot(index, { startTime: v })}
                          placeholder="09:00"
                          backgroundColor="$fieldBackground"
                          borderColor="$borderSubtle"
                          color="$color"
                          paddingHorizontal="$3"
                          height={44}
                          borderRadius="$3"
                        />
                        <AmPmButtons
                          value={slot.startAmPm}
                          onChange={(v) => updateSlot(index, { startAmPm: v })}
                        />
                      </XStack>
                    </YStack>
                    <Text>
                      <ArrowRightIcon size={25} />
                    </Text>

                    <YStack
                      gap="$1"
                      flex={1}
                      minWidth={120}
                    >
                      <Label
                        color="$colorMuted"
                        fontSize={13}
                      >
                        {t('availability.to')}
                      </Label>
                      <XStack
                        gap="$1"
                        alignItems="center"
                      >
                        <Input
                          flex={1}
                          value={slot.endTime}
                          onChangeText={(v) => updateSlot(index, { endTime: v })}
                          placeholder="12:00"
                          backgroundColor="$fieldBackground"
                          borderColor="$borderSubtle"
                          color="$color"
                          paddingHorizontal="$3"
                          height={44}
                          borderRadius="$3"
                        />
                        <AmPmButtons
                          value={slot.endAmPm}
                          onChange={(v) => updateSlot(index, { endAmPm: v })}
                        />
                      </XStack>
                    </YStack>
                    <Button
                      variant="ghost"
                      size="$2"
                      padding="$2"
                      onPress={() => removeSlot(index)}
                    >
                      <TrashIcon
                        size={18}
                        color="#EF4444"
                      />
                    </Button>
                  </XStack>
                ))}

                <Button
                  variant="ghost"
                  borderWidth={1}
                  borderColor="$borderSubtle"
                  borderStyle="dashed"
                  padding="$3"
                  onPress={addSlot}
                >
                  <XStack
                    alignItems="center"
                    gap="$2"
                  >
                    <PlusCircleIcon
                      size={20}
                      color={ICON_COLOR}
                    />
                    <Text
                      size="sm"
                      variant="muted"
                    >
                      {t('availability.addSlot')}
                    </Text>
                  </XStack>
                </Button>
              </YStack>
            </YStack>

            {/* Navigation - moved to sticky bar */}
          </Container>
        </YStack>
      </ScrollView>
      <TutorProfileStickyActions>
        <Button
          variant="outline"
          onPress={() => router.push('/become-tutor/video')}
        >
          {t('back')}
        </Button>
        <Button
          variant="primary"
          onPress={handleSubmit(() => {
            submitProfile();
            router.push('/become-tutor/final');
          })}
        >
          {t('continue')}
        </Button>
      </TutorProfileStickyActions>
      </YStack>
    </Screen>
  );
}

function AmPmButtons({
  value,
  onChange,
}: {
  value: 'AM' | 'PM';
  onChange: (v: 'AM' | 'PM') => void;
}) {
  return (
    <XStack gap="$1">
      <Button
        size="$2"
        variant={value === 'AM' ? 'primary' : 'ghost'}
        onPress={() => onChange('AM')}
      >
        AM
      </Button>
      <Button
        size="$2"
        variant={value === 'PM' ? 'primary' : 'ghost'}
        onPress={() => onChange('PM')}
      >
        PM
      </Button>
    </XStack>
  );
}
