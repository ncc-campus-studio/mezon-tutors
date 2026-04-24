import { Button, Dialog, Separator, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { CloseIcon, GraduationCapIcon, SunIcon, MoonIcon } from '@mezon-tutors/app/ui/icons'
import {
  useGetAlreadyBookedTrialLesson,
  useGetOccupiedTrialLessonSlots,
  useGetTutorAvailability,
} from '@mezon-tutors/app/services'
import {
  buildTimeSlotsForDay,
  ETrialLessonBookingPaymentStatus,
  ETrialLessonBookingStatus,
  jsDayToDbDayOfWeek,
  parseYyyyMmDdToLocalDate,
  timeToMinutes,
  type TrialTimeSlot,
} from '@mezon-tutors/shared'
import { Image, useMedia, useTheme } from 'tamagui'
import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { EDayOfWeek, EPeriod } from '@mezon-tutors/shared'
import { useAtomValue } from 'jotai'
import { isAuthenticatedAtom } from '@mezon-tutors/app/store/auth.atom'

export type TrialBookingPayload = {
  duration: number
  startAt: string
  dayOfWeek: number
  time: TrialTimeSlot
}

export type TrialResumePaymentPayload = {
  tutorId: string
  startAt: string
  durationMinutes: number
  dayOfWeek: number
  resumePayment: true
}

export interface TrialBookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: (payload: TrialBookingPayload) => void | Promise<void>
  onResumePayment?: (payload: TrialResumePaymentPayload) => void | Promise<void>
  tutor: {
    id: string
    name: string
    title: string
    pricePerHour: number
    avatar: string
  }
}

const DURATION_OPTIONS = [30, 60]
const DATE_COLUMNS = 7
const DATE_CELL_WIDTH = `${100 / DATE_COLUMNS}%`
const CALENDAR_DAYS = 14
const SLOT_INTERVAL_MINUTES = 30
const PERIODS = Object.values(EPeriod)
const WEEKDAYS = Object.values(EDayOfWeek)

export function TrialBookingModal({
  open,
  onOpenChange,
  onConfirm,
  onResumePayment,
  tutor,
}: TrialBookingModalProps) {
  const t = useTranslations('Tutors.TrialBookingModal')
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const media = useMedia()
  const isMobile = media.sm || media.xs
  const [duration, setDuration] = useState<number>(DURATION_OPTIONS[0])
  const [timeId, setTimeId] = useState<string>('')
  const [nowTs, setNowTs] = useState<number>(Date.now())

  const { data: schedule, isPending: isAvailabilityPending } = useGetTutorAvailability(
    tutor.id,
    open && Boolean(tutor.id)
  )

  const theme = useTheme()
  const primaryColor = theme.appPrimary?.get() ?? '#1253D5'
  const periodIconColors = useMemo(
    () => ({
      [EPeriod.MORNING]: theme.trialBookingIconMorning?.get() ?? '#F59E0B',
      [EPeriod.NOON]: theme.trialBookingIconNoon?.get() ?? '#fdfb01',
      [EPeriod.AFTERNOON]: theme.trialBookingIconAfternoon?.get() ?? '#F97316',
      [EPeriod.EVENING]: theme.trialBookingIconEvening?.get() ?? '#8FA6D7',
    }),
    [theme]
  )

  const periodLabelKeyByPeriod: Record<
    EPeriod,
    'period.morning' | 'period.noon' | 'period.afternoon' | 'period.evening'
  > = {
    [EPeriod.MORNING]: 'period.morning',
    [EPeriod.NOON]: 'period.noon',
    [EPeriod.AFTERNOON]: 'period.afternoon',
    [EPeriod.EVENING]: 'period.evening',
  }

  const weekdayLabelKeyByWeekday: Record<
    EDayOfWeek,
    | 'weekday.mon'
    | 'weekday.tue'
    | 'weekday.wed'
    | 'weekday.thu'
    | 'weekday.fri'
    | 'weekday.sat'
    | 'weekday.sun'
  > = {
    [EDayOfWeek.MON]: 'weekday.mon',
    [EDayOfWeek.TUE]: 'weekday.tue',
    [EDayOfWeek.WED]: 'weekday.wed',
    [EDayOfWeek.THU]: 'weekday.thu',
    [EDayOfWeek.FRI]: 'weekday.fri',
    [EDayOfWeek.SAT]: 'weekday.sat',
    [EDayOfWeek.SUN]: 'weekday.sun',
  }

  const calendarDates = useMemo(() => {
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const jsWeekDay = todayStart.getDay()
    const distanceToMonday = jsWeekDay === 0 ? 6 : jsWeekDay - 1
    const startOfCurrentWeek = new Date(todayStart)
    startOfCurrentWeek.setDate(todayStart.getDate() - distanceToMonday)

    return Array.from({ length: CALENDAR_DAYS }).map((_, index) => {
      const date = new Date(startOfCurrentWeek)
      date.setDate(startOfCurrentWeek.getDate() + index)

      const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const isPastDate = normalized.getTime() < todayStart.getTime()

      return {
        id: `${normalized.getFullYear()}-${normalized.getMonth() + 1}-${normalized.getDate()}`,
        day: normalized.getDate(),
        disabled: isPastDate,
        muted: isPastDate,
      }
    })
  }, [])

  const [dateId, setDateId] = useState<string>(() => {
    const firstAvailableDate = calendarDates.find((option) => !option.disabled)
    return firstAvailableDate?.id ?? calendarDates[0]?.id ?? ''
  })

  const selectedDate = useMemo(
    () => calendarDates.find((option) => option.id === dateId) ?? calendarDates[0],
    [calendarDates, dateId]
  )
  const selectedDateString = useMemo(() => {
    const fullDate = parseYyyyMmDdToLocalDate(selectedDate.id)
    const y = fullDate.getFullYear()
    const m = String(fullDate.getMonth() + 1).padStart(2, '0')
    const d = String(fullDate.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }, [selectedDate])

  const dbDayOfWeek = useMemo(() => {
    const fullDate = parseYyyyMmDdToLocalDate(selectedDate.id)
    return jsDayToDbDayOfWeek(fullDate.getDay())
  }, [selectedDate])

  const timeSlots = useMemo(() => {
    const rows = schedule?.availability ?? []
    return buildTimeSlotsForDay(rows, dbDayOfWeek, SLOT_INTERVAL_MINUTES)
  }, [schedule?.availability, dbDayOfWeek])

  const { data: occupiedSlotsResponse } = useGetOccupiedTrialLessonSlots(
    tutor.id,
    selectedDateString,
    open && Boolean(tutor.id)
  )
  const { data: alreadyBookedResponse, isPending: isAlreadyBookedPending } =
    useGetAlreadyBookedTrialLesson(tutor.id, open && Boolean(tutor.id) && isAuthenticated)
  const alreadyBookedStatus = alreadyBookedResponse?.status ?? null
  const paymentStatus = alreadyBookedResponse?.paymentStatus ?? null
  const isAlreadyBooked = Boolean(alreadyBookedResponse?.hasBooked)

  const canResumePendingPayment = useMemo(
    () =>
      isAlreadyBooked &&
      paymentStatus === ETrialLessonBookingPaymentStatus.PENDING &&
      Boolean(alreadyBookedResponse?.startAt) &&
      typeof alreadyBookedResponse?.durationMinutes === 'number',
    [
      alreadyBookedResponse?.durationMinutes,
      alreadyBookedResponse?.startAt,
      isAlreadyBooked,
      paymentStatus,
    ]
  )

  const confirmButtonLabel = useMemo(() => {
    if (!isAlreadyBooked) {
      return t('confirmBooking')
    }
    if (canResumePendingPayment) {
      return t('continueToPayment')
    }
    if (alreadyBookedStatus === ETrialLessonBookingStatus.PENDING) {
      return t('requestSentWait')
    }
    return t('alreadyBooked')
  }, [alreadyBookedStatus, canResumePendingPayment, isAlreadyBooked, t])

  const selectedTime = useMemo(
    () => timeSlots.find((slot) => slot.id === timeId),
    [timeSlots, timeId]
  )

  const pastSlotIds = useMemo(() => {
    const now = new Date(nowTs)
    const fullDate = parseYyyyMmDdToLocalDate(selectedDate.id)
    const isToday =
      fullDate.getFullYear() === now.getFullYear() &&
      fullDate.getMonth() === now.getMonth() &&
      fullDate.getDate() === now.getDate()

    if (!isToday) return new Set<string>()

    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const ids = new Set<string>()

    for (const slot of timeSlots) {
      const [hourText, minuteText] = slot.startTime.split(':')
      const hour = Number.parseInt(hourText ?? '0', 10)
      const minute = Number.parseInt(minuteText ?? '0', 10)
      const slotMinutes = hour * 60 + minute
      if (slotMinutes <= currentMinutes) {
        ids.add(slot.id)
      }
    }

    return ids
  }, [nowTs, selectedDate.id, timeSlots])

  const occupiedSlotIds = useMemo(() => {
    const occupied = occupiedSlotsResponse?.items ?? []
    if (!occupied.length || !timeSlots.length) return new Set<string>()

    const ids = new Set<string>()
    for (const slot of timeSlots) {
      const slotStart = timeToMinutes(slot.startTime)
      const slotEnd = slotStart + duration

      const overlapsBooked = occupied.some((booked) => {
        const bookedStart = timeToMinutes(booked.startTime)
        const bookedEnd = bookedStart + booked.durationMinutes
        return slotStart < bookedEnd && slotEnd > bookedStart
      })

      if (overlapsBooked) {
        ids.add(slot.id)
      }
    }

    return ids
  }, [occupiedSlotsResponse?.items, timeSlots, duration])

  useEffect(() => {
    if (!timeSlots.length) {
      setTimeId('')
      return
    }
    setTimeId((current) => {
      if (!current) return ''
      const exists = timeSlots.some((s) => s.id === current)
      const isPast = pastSlotIds.has(current)
      const isOccupied = occupiedSlotIds.has(current)
      return exists && !isPast && !isOccupied ? current : ''
    })
  }, [timeSlots, pastSlotIds, occupiedSlotIds])

  useEffect(() => {
    if (!open) return
    setNowTs(Date.now())
    const timer = setInterval(() => setNowTs(Date.now()), 30_000)
    return () => clearInterval(timer)
  }, [open])

  const totalPrice = useMemo(
    () => (duration / 60) * tutor.pricePerHour,
    [duration, tutor.pricePerHour]
  )

  const slotsByPeriod = useMemo(() => {
    const grouped: Record<EPeriod, TrialTimeSlot[]> = {
      [EPeriod.MORNING]: [],
      [EPeriod.NOON]: [],
      [EPeriod.AFTERNOON]: [],
      [EPeriod.EVENING]: [],
    }
    for (const slot of timeSlots) {
      grouped[slot.period].push(slot)
    }
    return grouped
  }, [timeSlots])

  const dateRows = useMemo(() => {
    const rows: ((typeof calendarDates)[number] | null)[][] = []
    for (let i = 0; i < calendarDates.length; i += DATE_COLUMNS) {
      const row: ((typeof calendarDates)[number] | null)[] = calendarDates.slice(
        i,
        i + DATE_COLUMNS
      )
      while (row.length < DATE_COLUMNS) row.push(null)
      rows.push(row)
    }
    return rows
  }, [calendarDates])

  useEffect(() => {
    const currentOption = calendarDates.find((option) => option.id === dateId)
    if (!currentOption || currentOption.disabled) {
      const firstAvailableDate = calendarDates.find((option) => !option.disabled)
      if (firstAvailableDate) {
        setDateId(firstAvailableDate.id)
      }
    }
  }, [calendarDates, dateId])

  const handleConfirm = async () => {
    if (
      canResumePendingPayment &&
      alreadyBookedResponse?.startAt &&
      alreadyBookedResponse.durationMinutes != null
    ) {
      if (!onResumePayment) return
      const datePart = alreadyBookedResponse.startAt.includes('T')
        ? (alreadyBookedResponse.startAt.split('T')[0] ?? '')
        : alreadyBookedResponse.startAt.slice(0, 10)
      const fullDate = parseYyyyMmDdToLocalDate(datePart)
      const dayOfWeekForResume = jsDayToDbDayOfWeek(fullDate.getDay())
      await Promise.resolve(
        onResumePayment({
          tutorId: tutor.id,
          startAt: alreadyBookedResponse.startAt,
          durationMinutes: alreadyBookedResponse.durationMinutes,
          dayOfWeek: dayOfWeekForResume,
          resumePayment: true,
        })
      )
      onOpenChange(false)
      return
    }
    if (!onConfirm || !selectedTime) return
    const startAt = `${selectedDateString}T${selectedTime.startTime}:00Z`
    await onConfirm({
      duration,
      startAt,
      dayOfWeek: dbDayOfWeek,
      time: selectedTime as TrialTimeSlot,
    })
  }

  const renderPeriodIcon = (period: EPeriod) => {
    const c = periodIconColors[period]
    if (period === EPeriod.EVENING) {
      return <MoonIcon color={c} size={26} />
    }
    return <SunIcon color={c} />
  }

  const isConfirmDisabled =
    isAvailabilityPending ||
    isAlreadyBookedPending ||
    (canResumePendingPayment && !onResumePayment) ||
    (!canResumePendingPayment && (isAlreadyBooked || !selectedTime))

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.7}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="$trialBookingOverlay"
        />

        <Dialog.Content
          key="content"
          animation="100ms"
          enterStyle={{ y: isMobile ? '100%' : 0, scale: isMobile ? 1 : 0.95, opacity: 0 }}
          exitStyle={{ y: isMobile ? '100%' : 0, scale: isMobile ? 1 : 0.95, opacity: 0 }}
          animateOnly={isMobile ? ['transform'] : ['transform', 'opacity']}
          borderRadius={isMobile ? 0 : 16}
          width={isMobile ? '100%' : '95%'}
          maxWidth={isMobile ? '100%' : 720}
          maxHeight="100%"
          position={isMobile ? 'absolute' : undefined}
          top={isMobile ? 0 : undefined}
          left={isMobile ? 0 : undefined}
          right={isMobile ? 0 : undefined}
          bottom={isMobile ? 0 : undefined}
          backgroundColor="$trialBookingSurface"
          borderColor="$trialBookingBorder"
          borderWidth={isMobile ? 0 : 1}
          overflow="hidden"
          padding={0}
        >
          <YStack flex={1} maxHeight="100%">
            <XStack
              alignItems="center"
              justifyContent="space-between"
              padding={isMobile ? '$3' : '$4'}
              borderBottomWidth={1}
              borderBottomColor="rgba(46, 74, 126, 0.45)"
            >
              <XStack alignItems="center" gap={isMobile ? '$2' : '$4'}>
                <GraduationCapIcon size={isMobile ? 28 : 36} color={primaryColor} />
                <Dialog.Title 
                  color="$trialBookingBodyText" 
                  fontSize={isMobile ? 20 : 28} 
                  fontWeight="700"
                >
                  {t('title')}
                </Dialog.Title>
              </XStack>
              <Dialog.Close asChild>
                <Button
                  variant="ghost"
                  minWidth={isMobile ? 32 : 36}
                  height={isMobile ? 32 : 36}
                  borderRadius={6}
                  backgroundColor="transparent"
                  borderWidth={0}
                  padding={isMobile ? 6 : 8}
                >
                  <CloseIcon size={isMobile ? 20 : 22} color={primaryColor} />
                </Button>
              </Dialog.Close>
            </XStack>

            <YStack 
              flex={1}
              minHeight={0}
              maxHeight="100%"
              overflow="scroll"
              padding={isMobile ? '$3' : '$4'} 
              gap="$4"
            >
              <XStack gap="$3" alignItems="center">
                <Image
                  src={tutor.avatar}
                  width={isMobile ? 56 : 64}
                  height={isMobile ? 56 : 64}
                  borderRadius={999}
                  objectFit="cover"
                />
                <YStack flex={1}>
                  <Text 
                    size={isMobile ? 'lg' : 'xl'} 
                    fontWeight="700" 
                    color="$trialBookingBodyText"
                  >
                    {tutor.name}
                  </Text>
                  <Text 
                    color="$trialBookingMetaText"
                    fontSize={isMobile ? 13 : undefined}
                  >
                    {t('expertTutorTitle', { subject: tutor.title })} - ${tutor.pricePerHour}
                    {t('perHour')}
                  </Text>
                </YStack>
              </XStack>

              {canResumePendingPayment ? (
                <Text size="sm" color="#FBBF24" fontWeight="600">
                  {t('paymentPendingNotice')}
                </Text>
              ) : null}

              <YStack gap="$2">
                <Text 
                  fontWeight="700" 
                  letterSpacing={1} 
                  color="$trialBookingSectionLabel"
                  fontSize={isMobile ? 12 : undefined}
                >
                  {t('selectLessonDuration')}
                </Text>
                <XStack
                  width={isMobile ? '100%' : 260}
                  maxWidth={260}
                  borderRadius={14}
                  backgroundColor="$trialBookingControlWellBg"
                  padding={4}
                  gap="$2"
                >
                  {DURATION_OPTIONS.map((option) => {
                    const selected = duration === option
                    return (
                      <Button
                        key={option}
                        flex={1}
                        height={38}
                        borderRadius={10}
                        borderWidth={0}
                        backgroundColor={selected ? '$appPrimary' : 'transparent'}
                        color={
                          selected
                            ? '$trialBookingOnPrimaryText'
                            : '$trialBookingControlInactiveText'
                        }
                        onPress={() => setDuration(option)}
                        fontWeight="700"
                      >
                        {t('durationMins', { value: option })}
                      </Button>
                    )
                  })}
                </XStack>
              </YStack>

              <YStack gap="$2">
                <Text 
                  fontWeight="700" 
                  letterSpacing={1} 
                  color="$trialBookingBodyText"
                  fontSize={isMobile ? 12 : undefined}
                >
                  {t('selectDate')}
                </Text>
                <YStack
                  borderRadius={20}
                  borderWidth={1}
                  borderColor="rgba(67, 96, 148, 0.55)"
                  padding="$3"
                  gap="$4"
                >
                  <XStack alignItems="center">
                    {WEEKDAYS.map((weekday) => (
                      <YStack
                        key={weekday}
                        width={DATE_CELL_WIDTH}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text color="$trialBookingBodyText" fontSize={13} textAlign="center">
                          {t(weekdayLabelKeyByWeekday[weekday as EDayOfWeek])}
                        </Text>
                      </YStack>
                    ))}
                  </XStack>

                  {dateRows.map((row, rowIndex) => (
                    <XStack key={`date-row-${rowIndex}`} alignItems="flex-start">
                      {Array.from({ length: DATE_COLUMNS }).map((_, colIndex) => {
                        const option = row[colIndex]
                        if (!option) {
                          return (
                            <YStack
                              key={`date-empty-${rowIndex}-${colIndex}`}
                              width={DATE_CELL_WIDTH}
                              alignItems="center"
                              justifyContent="center"
                            >
                              <YStack width="100%" height={38} />
                            </YStack>
                          )
                        }

                        const selected = dateId === option.id
                        return (
                          <YStack key={option.id} width={DATE_CELL_WIDTH} alignItems="center">
                            <Button
                              width="92%"
                              height={38}
                              borderRadius={14}
                              borderWidth={selected ? 0 : 1}
                              backgroundColor={selected ? '$appPrimary' : 'transparent'}
                              color={
                                selected
                                  ? '$trialBookingOnPrimaryText'
                                  : option.disabled
                                    ? '$trialBookingDateDisabled'
                                    : '$trialBookingDateDefault'
                              }
                              fontWeight="700"
                              disabled={option.disabled}
                              opacity={option.disabled ? 0.55 : 1}
                              onPress={() => {
                                if (!option.disabled) {
                                  setDateId(option.id)
                                }
                              }}
                            >
                              {option.day}
                            </Button>
                          </YStack>
                        )
                      })}
                    </XStack>
                  ))}
                </YStack>
              </YStack>

              <YStack gap="$2">
                <Text 
                  fontWeight="700" 
                  letterSpacing={1} 
                  color="$trialBookingSectionLabel"
                  fontSize={isMobile ? 12 : undefined}
                >
                  {t('availableTimes')}
                </Text>
                {isAvailabilityPending ? (
                  <Text color="$trialBookingMetaText">{t('loadingAvailableTimes')}</Text>
                ) : timeSlots.length === 0 ? (
                  <Text color="$trialBookingMetaText">{t('noAvailableTimes')}</Text>
                ) : (
                  PERIODS.map((period) => {
                    const slotsInPeriod = slotsByPeriod[period]
                    if (!slotsInPeriod.length) return null
                    return (
                      <YStack key={period} gap="$2">
                        <XStack alignItems="center" gap="$2">
                          {renderPeriodIcon(period)}
                          <Text color="$trialBookingPeriodHeading" fontWeight="600">
                            {t(periodLabelKeyByPeriod[period])}
                          </Text>
                        </XStack>
                        <XStack flexWrap="wrap" gap="$3">
                          {slotsInPeriod.map((slot) => {
                            const selected = timeId === slot.id
                            const isPast = pastSlotIds.has(slot.id)
                            const isOccupied = occupiedSlotIds.has(slot.id)
                            return (
                              <Button
                                key={slot.id}
                                minWidth={120}
                                height={40}
                                borderRadius={14}
                                backgroundColor={
                                  selected ? '$trialBookingSlotSelectedBg' : 'transparent'
                                }
                                borderColor={selected ? '$appPrimary' : '$trialBookingSlotBorder'}
                                borderWidth={1}
                                color={
                                  selected
                                    ? '$appPrimary'
                                    : isPast || isOccupied
                                      ? '$trialBookingSlotMutedText'
                                      : '$trialBookingSlotDefaultText'
                                }
                                fontWeight={selected ? '700' : '500'}
                                disabled={isPast || isOccupied}
                                opacity={isPast || isOccupied ? 0.45 : 1}
                                onPress={() => {
                                  if (!isPast && !isOccupied) {
                                    setTimeId(slot.id)
                                  }
                                }}
                              >
                                {slot.label}
                              </Button>
                            )
                          })}
                        </XStack>
                      </YStack>
                    )
                  })
                )}
              </YStack>
            </YStack>

            {!isMobile && <Separator borderColor="$trialBookingHairline" />}

            <XStack
              padding={isMobile ? '$3' : '$4'}
              alignItems="center"
              justifyContent="space-between"
              gap="$3"
              flexWrap="wrap"
              backgroundColor="$trialBookingSurface"
              borderTopWidth={isMobile ? 1 : 0}
              borderTopColor={isMobile ? '$trialBookingHairline' : undefined}
              flexShrink={0}
            >
              <YStack gap="$2">
                <Text 
                  color="$trialBookingSectionLabel" 
                  fontWeight="700" 
                  letterSpacing={1}
                  fontSize={isMobile ? 11 : undefined}
                >
                  {t('totalPrice')}
                </Text>
                <XStack alignItems="flex-end" gap="$2">
                  <Text 
                    color="$appPrimary" 
                    fontSize={isMobile ? 28 : 36} 
                    fontWeight="800"
                  >
                    ${totalPrice.toFixed(2)}
                  </Text>
                </XStack>
              </YStack>
              <Button
                variant="primary"
                minWidth={isMobile ? 140 : 200}
                size={isMobile ? 'sm' : undefined}
                disabled={isConfirmDisabled}
                onPress={handleConfirm}
              >
                {confirmButtonLabel}
              </Button>
            </XStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
