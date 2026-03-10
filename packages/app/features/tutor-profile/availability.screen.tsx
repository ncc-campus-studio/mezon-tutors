'use client'

import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
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
  Label,
} from '@mezon-tutors/app/ui'
import {
  WalletIcon,
  CalendarIcon,
  TrashIcon,
  PlusCircleIcon,
  ArrowRightIcon,
} from '@mezon-tutors/app/ui/icons'
import {
  selectedDayIndexAtom,
  hourlyRateAtom,
  slotsByDayAtom,
  defaultSlot,
  type TimeSlot,
  submitTutorProfileAtom,
  buildSubmitTutorProfilePayload,
  tutorProfileAboutAtom,
  tutorProfilePhotoAtom,
  tutorProfileCertificationAtom,
  tutorProfileVideoAtom,
} from '@mezon-tutors/app/store/tutor-profile.atom'
import { TutorProfileProgress } from './components/tutor-profile-progress'
import { TutorProfileHeader } from './components/tutor-profile-header'
import { tutorProfileLastSavedAtAtom } from '@mezon-tutors/app/store/tutor-profile.atom'
import { DAY_KEYS, getDayKey } from '@mezon-tutors/shared'
import { TutorProfileStickyActions } from '@mezon-tutors/app/features/tutor-profile/components/tutor-profile-sticky-actions'

const ICON_COLOR = '#1253D5'
const CURRENT_STEP = 5
const PROGRESS_PERCENT = (CURRENT_STEP - 1) * 20

type AvailabilityFormValues = {
  hourlyRate: string
  slotsByDay: Record<string, TimeSlot[]>
}

function formatLastSavedTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export function TutorProfileAvailabilityScreen() {
  const t = useTranslations('TutorProfile.Availability')
  const router = useRouter()
  const about = useAtomValue(tutorProfileAboutAtom)
  const photo = useAtomValue(tutorProfilePhotoAtom)
  const certification = useAtomValue(tutorProfileCertificationAtom)
  const video = useAtomValue(tutorProfileVideoAtom)
  const selectedDayIndex = useAtomValue(selectedDayIndexAtom)
  const setSelectedDayIndex = useSetAtom(selectedDayIndexAtom)
  const initialHourlyRate = useAtomValue(hourlyRateAtom)
  const initialSlotsByDay = useAtomValue(slotsByDayAtom)
  const setHourlyRate = useSetAtom(hourlyRateAtom)
  const setSlotsByDay = useSetAtom(slotsByDayAtom)
  const submitProfile = useSetAtom(submitTutorProfileAtom)
  const lastSavedAt = useAtomValue(tutorProfileLastSavedAtAtom)
  const setLastSavedAt = useSetAtom(tutorProfileLastSavedAtAtom)

  const form = useForm<AvailabilityFormValues>({
    defaultValues: {
      hourlyRate: initialHourlyRate ?? '',
      slotsByDay: initialSlotsByDay ?? Object.fromEntries(DAY_KEYS.map((d) => [d, []])),
    },
    mode: 'onChange',
  })

  const { control, handleSubmit, reset, watch, setValue } = form

  useEffect(() => {
    reset({
      hourlyRate: initialHourlyRate ?? '',
      slotsByDay:
        initialSlotsByDay ?? Object.fromEntries(DAY_KEYS.map((d) => [d, []])),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dayKey = getDayKey(selectedDayIndex)
  const slotsByDayForm = watch('slotsByDay')
  const slots = slotsByDayForm?.[dayKey] ?? []

  const onSaveExit = () => {
    form.handleSubmit((values) => {
      const payload = buildSubmitTutorProfilePayload({
        ...about,
        ...photo,
        ...certification,
        videoUrl: video.videoLink,
        hourlyRate: values.hourlyRate,
        slotsByDay: values.slotsByDay,
      })
      submitProfile(payload)
      router.push('/')
    })()
  }

  const addSlot = () => {
    const current = form.getValues('slotsByDay') ?? {}
    const daySlots = current[dayKey] ?? []
    setValue('slotsByDay', {
      ...current,
      [dayKey]: [...daySlots, { ...defaultSlot }],
    })
    setSlotsByDay((prev) => ({
      ...prev,
      [dayKey]: [...(prev[dayKey] ?? []), { ...defaultSlot }],
    }))
    setLastSavedAt(new Date().toISOString())
  }

  const removeSlot = (index: number) => {
    const current = form.getValues('slotsByDay') ?? {}
    const daySlots = (current[dayKey] ?? []).filter((_, i) => i !== index)
    setValue('slotsByDay', { ...current, [dayKey]: daySlots })
    setSlotsByDay((prev) => ({
      ...prev,
      [dayKey]: (prev[dayKey] ?? []).filter((_, i) => i !== index),
    }))
    setLastSavedAt(new Date().toISOString())
  }

  const updateSlot = (index: number, patch: Partial<TimeSlot>) => {
    const current = form.getValues('slotsByDay') ?? {}
    const list = [...(current[dayKey] ?? [])]
    list[index] = { ...list[index], ...patch }
    setValue('slotsByDay', { ...current, [dayKey]: list })
    setSlotsByDay((prev) => {
      const nextList = [...(prev[dayKey] ?? [])]
      nextList[index] = { ...nextList[index], ...patch }
      return { ...prev, [dayKey]: nextList }
    })
    setLastSavedAt(new Date().toISOString())
  }

  const handleHourlyRateChange = (value: string) => {
    setValue('hourlyRate', value)
    setHourlyRate(value)
    setLastSavedAt(new Date().toISOString())
  }

  const draftSavedLabel =
    lastSavedAt && formatLastSavedTime(lastSavedAt)
      ? t('draftSaved', { time: formatLastSavedTime(lastSavedAt) })
      : ''

  const dayTabs = t.raw('availability.tabs') as string[]

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
                      render={({ field: { value, onChange } }) => (
                        <Input
                          flex={1}
                          placeholder="0.00"
                          value={value}
                          onChangeText={(v) => {
                            onChange(v)
                            handleHourlyRateChange(v)
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
              <XStack alignItems="center" gap="$2">
                <CalendarIcon size={24} color={ICON_COLOR} />
                <Paragraph fontWeight="700" fontSize={18}>
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
                {slots.map((slot, index) => (
                  <XStack
                    key={index}
                    gap="$2"
                    alignItems="flex-end"
                    flexWrap="wrap"
                    $xs={{ flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    <YStack gap="$1" flex={1} minWidth={120}>
                      <Label color="$colorMuted" fontSize={13}>
                        {t('availability.from')}
                      </Label>
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
                    </YStack>
                    <Text>
                      <ArrowRightIcon size={25} />
                    </Text>

                    <YStack gap="$1" flex={1} minWidth={120}>
                      <Label color="$colorMuted" fontSize={13}>
                        {t('availability.to')}
                      </Label>
                      <Input
                        flex={1}
                        value={slot.endTime}
                        onChangeText={(v) => updateSlot(index, { endTime: v })}
                        placeholder="17:00"
                        backgroundColor="$fieldBackground"
                        borderColor="$borderSubtle"
                        color="$color"
                        paddingHorizontal="$3"
                        height={44}
                        borderRadius="$3"
                      />
                    </YStack>
                    <Button
                      variant="ghost"
                      size="$2"
                      padding="$2"
                      onPress={() => removeSlot(index)}
                    >
                      <TrashIcon size={18} color="#EF4444" />
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
                  <XStack alignItems="center" gap="$2">
                    <PlusCircleIcon size={20} color={ICON_COLOR} />
                    <Text size="sm" variant="muted">
                      {t('availability.addSlot')}
                    </Text>
                  </XStack>
                </Button>
              </YStack>
            </YStack>

            <XStack
              justifyContent="space-between"
              alignItems="center"
              marginTop="$4"
              $xs={{
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: '$3',
              }}
            >
              <Button variant="outline" onPress={() => router.push('/become-tutor/video')}>
                {t('back')}
              </Button>
              <Button
                variant="primary"
                onPress={handleSubmit((values) => {
                  const payload = buildSubmitTutorProfilePayload({
                    ...about,
                    ...photo,
                    ...certification,
                    videoUrl: video.videoLink,
                    hourlyRate: values.hourlyRate,
                    slotsByDay: values.slotsByDay,
                  })

                  submitProfile(payload)
                  router.push('/become-tutor/final')
                })}
              >
                {t('continue')}
              </Button>
            </XStack>
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
          onPress={handleSubmit((values) => {
            const payload = buildSubmitTutorProfilePayload({
              ...about,
              ...photo,
              ...certification,
              videoUrl: video.videoLink,
              hourlyRate: values.hourlyRate,
              slotsByDay: values.slotsByDay,
            })

            submitProfile(payload);
            router.push('/become-tutor/final');
          })}
        >
          {t('continue')}
        </Button>
      </TutorProfileStickyActions>
      </YStack>
    </Screen>
  )
}
