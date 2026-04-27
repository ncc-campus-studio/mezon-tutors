'use client'

import {
  useCreateTrialLessonBookingMutation,
  useGetCurrentTrialLessonBooking,
  useGetVerifiedTutorAbout,
} from '@mezon-tutors/app/services'
import { useAppToast } from '@mezon-tutors/app/hooks/useAppToast'
import { Screen, ScrollView, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import dayjs from 'dayjs'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMedia, useTheme } from 'tamagui'
import { PaymentMethodPanel } from './components/PaymentMethodPanel'
import { PaymentSummaryCard } from './components/PaymentSummaryCard'
import { TrialLessonDetailsCard } from './components/TrialLessonDetailsCard'
import { CalendarIcon } from '@mezon-tutors/app/ui/icons'
import { useTranslations } from 'next-intl'

const PAYMENT_RESULT_CHECK_INTERVAL = 5000
const PAYMENT_RESULT_CHECK_TIMEOUT = 5 * 60 * 1000

export function TrialLessonCheckoutScreen() {
  const t = useTranslations('TrialLessonCheckout.Screen')
  const media = useMedia()
  const theme = useTheme()
  const isCompact = media.md || media.sm || media.xs
  const searchParams = useSearchParams()
  const toast = useAppToast()
  const pageBg = theme.checkoutBg?.get() ?? '#071327'
  const headingColor = theme.checkoutHeadingText?.get() ?? '#F5F8FF'
  const mutedColor = theme.checkoutMutedText?.get() ?? '#92A3C8'
  const errorColor = theme.errorText?.get() ?? '#F87171'
  const infoColor = theme.appPrimaryLight?.get() ?? '#93C5FD'
  const warningColor = theme.warningText?.get() ?? '#F59E0B'

  const query = useMemo(() => {
    const tutorId = searchParams.get('tutorId')
    const startAt = searchParams.get('startAt')
    const durationRaw = searchParams.get('durationMinutes')
    const dayRaw = searchParams.get('dayOfWeek')
    if (!tutorId || !startAt || !durationRaw || dayRaw === null || dayRaw === '') {
      return null
    }
    const durationMinutes = Number.parseInt(durationRaw, 10)
    const dayOfWeek = Number.parseInt(dayRaw, 10)
    if (Number.isNaN(durationMinutes) || durationMinutes <= 0) {
      return null
    }
    if (Number.isNaN(dayOfWeek)) {
      return null
    }
    const resumePayment = searchParams.get('resumePayment') === '1'
    return { tutorId, startAt, durationMinutes, dayOfWeek, resumePayment }
  }, [searchParams])

  const tutorId = query?.tutorId ?? ''
  const [paymentLink, setPaymentLink] = useState<string | null>(null)
  const shouldLoadCurrentBooking = Boolean(tutorId)
  const {
    data: tutor,
    isPending: isTutorPending,
    isError: isTutorError,
  } = useGetVerifiedTutorAbout(tutorId)
  const {
    data: currentBooking,
    isPending: isCurrentBookingPending,
    refetch: refetchCurrentBooking,
  } = useGetCurrentTrialLessonBooking(tutorId, shouldLoadCurrentBooking)
  const isCurrentBookingLoading = shouldLoadCurrentBooking && isCurrentBookingPending
  const paymentMethods = useMemo(
    () => [
      {
        id: 'payos',
        title: t('paymentMethods.payos.title'),
        subtitle: t('paymentMethods.payos.subtitle'),
      },
    ],
    [t]
  )
  const [selectedMethodId, setSelectedMethodId] = useState<string>('payos')
  const createBooking = useCreateTrialLessonBookingMutation()
  const paymentWindowRef = useRef<Window | null>(null)
  const [isWaitingPaymentResult, setIsWaitingPaymentResult] = useState(false)

  const openPaymentWindow = useCallback(
    (url: string) => {
      if (typeof window === 'undefined') return
      if (paymentWindowRef.current && !paymentWindowRef.current.closed) {
        paymentWindowRef.current.location.href = url
        paymentWindowRef.current.focus()
        setIsWaitingPaymentResult(true)
        return
      }
      const paymentWindow = window.open(url, 'payos-checkout', 'width=1100,height=800')
      if (!paymentWindow) {
        toast.error(t('toast.popupBlockedTitle'), t('toast.popupBlockedDescription'))
        return
      }
      paymentWindowRef.current = paymentWindow
      setIsWaitingPaymentResult(true)
    },
    [t, toast]
  )

  useEffect(() => {
    if (
      currentBooking?.hasBooked &&
      currentBooking.status !== 'CANCELLED' &&
      currentBooking.paymentStatus === 'PENDING' &&
      currentBooking.payosPaymentLink
    ) {
      setPaymentLink(currentBooking.payosPaymentLink)
    }
  }, [currentBooking])

  useEffect(() => {
    if (!shouldLoadCurrentBooking || !paymentLink || !isWaitingPaymentResult) return
    const intervalId = window.setInterval(() => {
      void refetchCurrentBooking()
    }, PAYMENT_RESULT_CHECK_INTERVAL)
    return () => {
      window.clearInterval(intervalId)
    }
  }, [isWaitingPaymentResult, paymentLink, refetchCurrentBooking, shouldLoadCurrentBooking])

  useEffect(() => {
    if (!paymentLink || !isWaitingPaymentResult) return
    const timeoutId = window.setTimeout(() => {
      if (paymentWindowRef.current && !paymentWindowRef.current.closed) {
        paymentWindowRef.current.close()
      }
      paymentWindowRef.current = null
      setIsWaitingPaymentResult(false)
    }, PAYMENT_RESULT_CHECK_TIMEOUT)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isWaitingPaymentResult, paymentLink])

  useEffect(() => {
    if (!currentBooking?.hasBooked || !currentBooking.paymentStatus) return
    if (currentBooking.paymentStatus !== 'PENDING') {
      if (paymentWindowRef.current && !paymentWindowRef.current.closed) {
        paymentWindowRef.current.close()
      }
      paymentWindowRef.current = null
      setIsWaitingPaymentResult(false)
      if (currentBooking.paymentStatus === 'SUCCEEDED') {
        setPaymentLink(null)
      }
    }
  }, [currentBooking])

  const handlePay = useCallback(async () => {
    if (!query || !tutor) return
    if (currentBooking?.hasBooked && currentBooking.status !== 'CANCELLED') {
      if (currentBooking.paymentStatus === 'PENDING' && currentBooking.payosPaymentLink) {
        setPaymentLink(currentBooking.payosPaymentLink)
        openPaymentWindow(currentBooking.payosPaymentLink)
        return
      }
      toast.error(t('toast.alreadyBookedTitle'), t('toast.alreadyBookedDescription'))
      return
    }
    try {
      const booking = await createBooking.mutateAsync({
        tutorId: query.tutorId,
        startAt: query.startAt,
        dayOfWeek: query.dayOfWeek,
        durationMinutes: query.durationMinutes,
      })
      setPaymentLink(booking.payosPaymentLink)
      if (booking.payosPaymentLink) {
        openPaymentWindow(booking.payosPaymentLink)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t('toast.bookingFailedFallback')
      toast.error(t('toast.bookingFailedTitle'), message)
    }
  }, [createBooking, currentBooking, openPaymentWindow, query, t, toast, tutor])

  const handleContinuePayment = useCallback(() => {
    if (!paymentLink) return
    openPaymentWindow(paymentLink)
  }, [openPaymentWindow, paymentLink])

  if (!query) {
    return (
      <Screen backgroundColor={pageBg}>
        <YStack flex={1} padding="$5" justifyContent="center" alignItems="center" gap="$2">
          <Text color={headingColor} size="xl" fontWeight="700">
            {t('missingInfo.title')}
          </Text>
          <Text color={mutedColor} textAlign="center">
            {t('missingInfo.description')}
          </Text>
          <Text color={mutedColor} size="sm" textAlign="center">
            {t('missingInfo.expectedQuery')}
          </Text>
        </YStack>
      </Screen>
    )
  }

  const start = dayjs(query.startAt)
  const end = start.add(query.durationMinutes, 'minute')
  const dateLabel = start.format('MMM D, YYYY')
  const timeLabel = `${start.format('h:mm A')} - ${end.format('h:mm A')}`
  const durationLabel = t('durationLabel', { durationMinutes: query.durationMinutes })

  const pricePerHour = tutor?.pricePerHour ?? 0
  const total = Math.round((query.durationMinutes / 60) * pricePerHour * 100) / 100

  const tutorLastName = tutor?.lastName?.trim() || t('tutor.fallbackName')
  const tutorDisplayName = tutor ? `${tutor.firstName} ${tutor.lastName}` : t('tutor.loadingName')
  const tutorSubtitle = tutor
    ? `${tutor.isProfessional ? t('tutor.professionalPrefix') : ''}${tutor.subject} ${t('tutor.subjectSuffix')}${tutor.experience ? ` • ${tutor.experience}` : ''}`
    : ''

  const canPay = Boolean(tutor) && !isTutorError && pricePerHour > 0
  const hasActiveBooking = Boolean(
    currentBooking?.hasBooked && currentBooking.status !== 'CANCELLED'
  )
  const hasLocalPendingPayment = Boolean(paymentLink)
  const isPendingPayment = Boolean(
    hasLocalPendingPayment ||
      (hasActiveBooking &&
        currentBooking?.paymentStatus === 'PENDING' &&
        (currentBooking?.payosPaymentLink || paymentLink))
  )
  const isBookedAndLocked = Boolean(hasActiveBooking && currentBooking?.paymentStatus !== 'PENDING')

  return (
    <Screen backgroundColor={pageBg}>
      <ScrollView flex={1} contentContainerStyle={{ paddingBottom: 36 }}>
        <YStack
          width="100%"
          maxWidth={1240}
          marginHorizontal="auto"
          padding={isCompact ? '$3' : '$5'}
          gap="$4"
        >
          <YStack gap="$1">
            <Text color={headingColor} fontSize={44} lineHeight={48} fontWeight="800">
              {t('title')}
            </Text>
            <Text color={mutedColor} size="lg">
              {isTutorPending ? t('loadingBooking') : t('subtitle', { tutorName: tutorLastName })}
            </Text>
          </YStack>

          {isTutorError ? <Text color={errorColor}>{t('errors.loadTutor')}</Text> : null}

          {!isTutorPending && tutor && !pricePerHour ? (
            <Text color={errorColor}>{t('errors.missingRate')}</Text>
          ) : null}

          {!isCurrentBookingLoading && isPendingPayment ? (
            <Text color={infoColor}>{t('pendingPaymentNotice')}</Text>
          ) : null}

          {!isCurrentBookingLoading && isBookedAndLocked ? (
            <Text color={warningColor}>{t('bookedLockedNotice')}</Text>
          ) : null}

          <XStack gap="$4" flexDirection={isCompact ? 'column' : 'row'} alignItems="flex-start">
            <YStack flex={1.25} gap="$3.5">
              <XStack gap="$2" alignItems="center">
                <CalendarIcon size={20} color={headingColor} />
                <Text color={headingColor} size="xl" fontWeight="700">
                  {t('trialLessonDetails')}
                </Text>
              </XStack>
              <TrialLessonDetailsCard
                isCompact={isCompact}
                tutorName={tutorDisplayName}
                tutorSubtitle={tutorSubtitle || t('tutor.emptySubtitle')}
                avatarUrl={tutor?.avatar ?? ''}
                dateLabel={dateLabel}
                timeLabel={timeLabel}
                durationLabel={durationLabel}
              />
              {tutor && pricePerHour > 0 ? (
                <PaymentSummaryCard durationMinutes={query.durationMinutes} total={total} />
              ) : (
                <Text color={mutedColor}>{t('loadingPaymentSummary')}</Text>
              )}
            </YStack>

            <YStack
              flex={1}
              width={isCompact ? '100%' : 'auto'}
              maxWidth={isCompact ? '100%' : 460}
            >
              <PaymentMethodPanel
                total={tutor && pricePerHour > 0 ? total : 0}
                paymentMethods={paymentMethods}
                selectedMethodId={selectedMethodId}
                onSelectMethod={setSelectedMethodId}
                onPay={handlePay}
                onContinuePayment={handleContinuePayment}
                showContinuePayment={isPendingPayment && Boolean(paymentLink)}
                continuePaymentDisabled={isCurrentBookingLoading}
                payDisabled={
                  !canPay ||
                  selectedMethodId.length === 0 ||
                  isCurrentBookingLoading ||
                  isBookedAndLocked
                }
                isPayLoading={createBooking.isPending || isCurrentBookingLoading}
              />
            </YStack>
          </XStack>
        </YStack>
      </ScrollView>
    </Screen>
  )
}
