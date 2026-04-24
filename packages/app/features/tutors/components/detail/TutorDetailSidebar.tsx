import { Button, Card, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { CalendarIcon, CheckIcon, UsersIcon } from '@mezon-tutors/app/ui/icons'
import { useTranslations } from 'next-intl'
import { useMedia } from 'tamagui'
import { TutorAboutTabProps } from './types'
import { useState } from 'react'
import {
  TrialBookingModal,
  type TrialBookingPayload,
  type TrialResumePaymentPayload,
} from '@mezon-tutors/app/features/tutors/components/TrialBookingModal'
import { useRouter } from 'solito/navigation'
import { ROUTES } from '@mezon-tutors/shared'

export function TutorDetailSidebar({ tutor }: TutorAboutTabProps) {
  const t = useTranslations('Tutors.Detail')
  const media = useMedia()
  const router = useRouter()
  const isMobile = media.sm || media.xs
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)

  const handleBookTrialClick = () => {
    setIsTrialModalOpen(true)
  }

  const handleConfirmBooking = (payload: TrialBookingPayload) => {
    const sp = new URLSearchParams()
    sp.set('tutorId', tutor.id)
    sp.set('startAt', payload.startAt)
    sp.set('durationMinutes', String(payload.duration))
    sp.set('dayOfWeek', String(payload.dayOfWeek))
    setIsTrialModalOpen(false)
    router.push(`${ROUTES.CHECKOUT.TRIAL_LESSON}?${sp.toString()}`)
  }

  const handleResumePayment = (payload: TrialResumePaymentPayload) => {
    const sp = new URLSearchParams()
    sp.set('tutorId', payload.tutorId)
    sp.set('startAt', payload.startAt)
    sp.set('durationMinutes', String(payload.durationMinutes))
    sp.set('dayOfWeek', String(payload.dayOfWeek))
    if (payload.resumePayment) {
      sp.set('resumePayment', '1')
    }
    setIsTrialModalOpen(false)
    router.push(`${ROUTES.CHECKOUT.TRIAL_LESSON}?${sp.toString()}`)
  }

  return (
    <YStack gap="$3">
      <Card
        backgroundColor="$tutorsDetailSidebarBackground"
        borderWidth={1}
        borderColor="$tutorsDetailSidebarBorder"
        borderRadius={isMobile ? 12 : 16}
        padding={isMobile ? '$3' : '$3.5'}
        gap={isMobile ? '$2.5' : '$3'}
      >
        <YStack gap="$1">
          <XStack alignItems="baseline" gap="$1.5">
            <Text 
              color="$tutorsDetailPrimaryText" 
              fontSize={isMobile ? 28 : 32} 
              fontWeight="900" 
              lineHeight={isMobile ? 30 : 34}
            >
              ${tutor.pricePerHour}
            </Text>
            <Text 
              color="$tutorsDetailMutedText"
              fontSize={isMobile ? 13 : undefined}
            >
              {t('perLesson')}
            </Text>
          </XStack>
        </YStack>

        <Button 
          variant="primary"
          size="sm"
          paddingVertical={isMobile ? 10 : undefined}
          onPress={handleBookTrialClick}
        >
          {t('bookTrial')}
        </Button>
        <Button 
          variant="outline"
          size="sm"
          paddingVertical={isMobile ? 10 : undefined}
        >
          {t('sendMessage')}
        </Button>

        <YStack gap={isMobile ? '$1.5' : '$2'} paddingTop="$1">
          <XStack gap="$2" alignItems="center">
            <CalendarIcon size={isMobile ? 14 : 16} color="$tutorsDetailAccentText" />
            <Text 
              color="$tutorsDetailSecondaryText"
              fontSize={isMobile ? 12 : undefined}
              lineHeight={isMobile ? 16 : undefined}
            >
              {t('bookedLast48h', { count: tutor.stats.bookedLessonsLast48h })}
            </Text>
          </XStack>
          <XStack gap="$2" alignItems="center">
            <UsersIcon size={isMobile ? 14 : 16} color="$tutorsDetailAccentText" />
            <Text 
              color="$tutorsDetailSecondaryText"
              fontSize={isMobile ? 12 : undefined}
              lineHeight={isMobile ? 16 : undefined}
            >
              {t('totalStudents', { count: tutor.stats.totalStudents })}
            </Text>
          </XStack>
          <XStack gap="$2" alignItems="center">
            <CheckIcon size={isMobile ? 14 : 16} color="$tutorsDetailAccentText" />
            <Text 
              color="$tutorsDetailSecondaryText"
              fontSize={isMobile ? 12 : undefined}
              lineHeight={isMobile ? 16 : undefined}
            >
              {t('totalLessons', { count: tutor.stats.totalLessonsTaught })}
            </Text>
          </XStack>
        </YStack>
      </Card>

      <Card
        backgroundColor="$tutorsDetailPromoBackground"
        borderWidth={1}
        borderColor="$tutorsDetailPromoBorder"
        borderRadius={isMobile ? 12 : 16}
        padding={isMobile ? '$3' : '$3.5'}
        gap={isMobile ? '$2' : '$2.5'}
      >
        <Text 
          color="$tutorsDetailPrimaryText" 
          fontSize={isMobile ? 16 : 18} 
          fontWeight="800"
          lineHeight={isMobile ? 20 : undefined}
        >
          {t('promoTitle')}
        </Text>
        <Text 
          color="$tutorsDetailSecondaryText"
          fontSize={isMobile ? 13 : undefined}
          lineHeight={isMobile ? 18 : undefined}
        >
          {t('promoDescription')}
        </Text>
        <Button 
          size="sm"
          backgroundColor="$tutorsDetailPromoButtonBg"
          color="$tutorsDetailPromoButtonText"
          hoverStyle={{
            backgroundColor: '$tutorsDetailPromoButtonHover',
            opacity: 1,
          }}
          pressStyle={{
            backgroundColor: '$tutorsDetailPromoButtonHover',
            opacity: 1,
          }}
        >
          {t('promoAction')}
        </Button>
      </Card>

      <TrialBookingModal
        open={isTrialModalOpen}
        onOpenChange={setIsTrialModalOpen}
        tutor={{
          id: tutor.id,
          name: `${tutor.firstName} ${tutor.lastName}`,
          title: tutor.subject,
          pricePerHour: tutor.pricePerHour,
          avatar: tutor.avatar,
        }}
        onConfirm={handleConfirmBooking}
        onResumePayment={handleResumePayment}
      />
    </YStack>
  )
}
