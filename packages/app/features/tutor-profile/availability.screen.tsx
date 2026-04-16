'use client';

import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Container,
  Paragraph,
  Screen,
  Text,
  XStack,
  YStack,
  ScrollView,
  Input,
} from '@mezon-tutors/app/ui';
import { WalletIcon } from '@mezon-tutors/app/ui/icons';
import {
  hourlyRateAtom,
  slotsByDayAtom,
  buildSubmitTutorProfilePayload,
  resetTutorProfileAfterSubmitAtom,
  tutorProfileAboutAtom,
  tutorProfilePhotoAtom,
  tutorProfileCertificationAtom,
  tutorProfileVideoAtom,
  tutorProfileIdentityAtom,
} from '@mezon-tutors/app/store/tutor-profile.atom';
import { TutorProfileProgress } from './components/tutor-profile-progress';
import { TutorProfileHeader } from './components/tutor-profile-header';
import { tutorProfileLastSavedAtAtom } from '@mezon-tutors/app/store/tutor-profile.atom';
import { formatLastSavedTime, HOURLY_RATE_REGEX } from '@mezon-tutors/shared';
import { TutorProfileStickyActions } from '@mezon-tutors/app/features/tutor-profile/components/tutor-profile-sticky-actions';
import { useSubmitTutorProfileMutation } from '@mezon-tutors/app/services';
import { AvailabilityEditor } from '@mezon-tutors/app/features/availability';
import type { AvailabilityData } from '@mezon-tutors/app/features/availability';

const ICON_COLOR = '#1253D5';
const CURRENT_STEP = 5;
const PROGRESS_PERCENT = (CURRENT_STEP - 1) * 20;

type AvailabilityFormValues = {
  hourlyRate: string;
};

export function TutorProfileAvailabilityScreen() {
  const t = useTranslations('TutorProfile.Availability');
  const router = useRouter();
  const about = useAtomValue(tutorProfileAboutAtom);
  const photo = useAtomValue(tutorProfilePhotoAtom);
  const identity = useAtomValue(tutorProfileIdentityAtom);
  const certification = useAtomValue(tutorProfileCertificationAtom);
  const video = useAtomValue(tutorProfileVideoAtom);
  const initialHourlyRate = useAtomValue(hourlyRateAtom);
  const initialSlotsByDay = useAtomValue(slotsByDayAtom);
  const setHourlyRate = useSetAtom(hourlyRateAtom);
  const setSlotsByDay = useSetAtom(slotsByDayAtom);
  const submitMutation = useSubmitTutorProfileMutation();
  const resetAfterSubmit = useSetAtom(resetTutorProfileAfterSubmitAtom);
  const lastSavedAt = useAtomValue(tutorProfileLastSavedAtAtom);
  const setLastSavedAt = useSetAtom(tutorProfileLastSavedAtAtom);

  const form = useForm<AvailabilityFormValues>({
    defaultValues: {
      hourlyRate: initialHourlyRate ?? '',
    },
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    reset({
      hourlyRate: initialHourlyRate ?? '',
    });
  }, []);

  const onSaveExit = () => {
    if (submitMutation.isPending) return;
    form.handleSubmit((values) => {
      setHourlyRate(values.hourlyRate);
      setLastSavedAt(new Date().toISOString());
      router.push('/');
    })();
  };

  const handleHourlyRateChange = (value: string) => {
    setValue('hourlyRate', value);
    setHourlyRate(value);
    setLastSavedAt(new Date().toISOString());
  };

  const handleAvailabilitySave = (data: AvailabilityData) => {
    setSlotsByDay(data.slotsByDay);
    setLastSavedAt(new Date().toISOString());
  };

  const draftSavedLabel =
    lastSavedAt && formatLastSavedTime(lastSavedAt)
      ? t('draftSaved', { time: formatLastSavedTime(lastSavedAt) })
      : '';

  const handleContinue = async () => {
    const hourlyRate = form.getValues('hourlyRate');
    
    if (!hourlyRate || !HOURLY_RATE_REGEX.test(hourlyRate.trim()) || Number(hourlyRate) <= 0) {
      return;
    }

    const payload = buildSubmitTutorProfilePayload({
      ...about,
      ...photo,
      ...identity,
      ...certification,
      videoUrl: video.videoLink,
      hourlyRate,
      slotsByDay: initialSlotsByDay,
    });

    await submitMutation.mutateAsync(payload);
    resetAfterSubmit();
    router.push('/become-tutor/final');
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
            <Container
              padded
              maxWidth={960}
              width="100%"
              gap="$5"
              $xs={{ gap: '$4' }}
            >
              <TutorProfileHeader
                draftSavedLabel={draftSavedLabel}
                saveExitLabel={t('saveExit')}
                onSaveExit={onSaveExit}
              />

              <TutorProfileProgress
                currentStepIndex={CURRENT_STEP}
                stepLabel={t('stepLabel')}
                rightLabel={t('progressPercentLabel', { percent: PROGRESS_PERCENT })}
              />

              <YStack gap="$2">
                <Paragraph fontSize={24} fontWeight="700">
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
                <XStack alignItems="center" gap="$2">
                  <WalletIcon size={24} color={ICON_COLOR} />
                  <Paragraph fontWeight="700" fontSize={18}>
                    {t('rateCardTitle')}
                  </Paragraph>
                </XStack>
                <Text size="sm" variant="muted">
                  {t('rate.question')}
                </Text>
                <YStack gap="$2">
                  <XStack alignItems="stretch" gap="$2">
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
                      <Text color="$colorMuted" marginRight="$2">
                        $
                      </Text>
                      <Controller
                        control={control}
                        name="hourlyRate"
                        rules={{
                          validate: (value) => {
                            const trimmed = value.trim();

                            if (!trimmed) {
                              return t('validation.hourlyRateRequired');
                            }

                            if (!HOURLY_RATE_REGEX.test(trimmed)) {
                              return t('validation.hourlyRateInvalidFormat');
                            }

                            if (Number(trimmed) <= 0) {
                              return t('validation.hourlyRateGreaterThanZero');
                            }

                            return true;
                          },
                        }}
                        render={({ field: { value, onChange } }) => (
                          <Input
                            flex={1}
                            placeholder="0.00"
                            value={value}
                            onChangeText={(v) => {
                              onChange(v);
                              handleHourlyRateChange(v);
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
                      <Text size="sm" variant="muted">
                        {t('rate.currencyLabel')}
                      </Text>
                    </YStack>
                  </XStack>
                  <Text size="sm" variant="muted">
                    {t('rate.recommended')}
                  </Text>
                  {errors.hourlyRate?.message && (
                    <Text size="md" color="#EF4444">
                      {errors.hourlyRate?.message}
                    </Text>
                  )}
                </YStack>
              </YStack>

              <AvailabilityEditor
                mode="create"
                initialData={{ slotsByDay: initialSlotsByDay }}
                onSave={handleAvailabilitySave}
                showActions={false}
              />
            </Container>
          </YStack>
        </ScrollView>
        <TutorProfileStickyActions>
          <Button variant="outline" onPress={() => router.push('/become-tutor/video')}>
            {t('back')}
          </Button>
          <Button
            variant="primary"
            disabled={submitMutation.isPending}
            onPress={handleSubmit(handleContinue)}
          >
            {t('continue')}
          </Button>
        </TutorProfileStickyActions>
      </YStack>
    </Screen>
  );
}
