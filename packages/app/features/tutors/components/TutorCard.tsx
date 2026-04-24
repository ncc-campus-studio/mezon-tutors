import {
  ABOUT_PROFICIENCY_LEVELS,
  formatToVND,
  ROUTES,
  VerifiedTutorProfileDto,
} from '@mezon-tutors/shared';
import { Button, Card, Chip, ChipText, Paragraph, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import {
  GraduationCapIcon,
  LanguageIcon,
  StarOutlineIcon,
  WorldIcon,
} from '@mezon-tutors/app/ui/icons'
import {
  TrialBookingModal,
  type TrialBookingPayload,
  type TrialResumePaymentPayload,
} from '@mezon-tutors/app/features/tutors/components/TrialBookingModal'
import { H2, Image, Separator, useMedia, useTheme } from 'tamagui'
import { useTranslations } from 'next-intl'
import { useRouter } from 'solito/navigation'
import { useState } from 'react'

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <Chip size="md" tone="default" variant="solid" borderRadius={10}>
      <ChipText size="md" tone="default">
        {children}
      </ChipText>
    </Chip>
  )
}

export function TutorCard({
  tutor,
  onHover,
  isActive,
  disableNavigationUntil,
}: {
  tutor: VerifiedTutorProfileDto;
  onHover?: (tutor: VerifiedTutorProfileDto, el: HTMLElement) => void;
  isActive?: boolean;
  disableNavigationUntil?: number;
}) {
  const t = useTranslations('Tutors.TutorCard')
  const media = useMedia()
  const theme = useTheme()
  const router = useRouter()
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)

  const isCompact = media.md || media.sm || media.xs;
  const isMobile = media.sm || media.xs;
  const isVeryNarrow = media.xs;
  const mutedColor = theme.colorMuted?.get() ?? theme.appTextMuted?.get() ?? '#6B7280';

  const proficiencyTags = Array.from(
    new Set(tutor.languages.map((language) => language.proficiency).filter(Boolean))
  )

  const handleCardClick = () => {
    if (disableNavigationUntil && Date.now() < disableNavigationUntil) {
      return;
    }

    router.push(ROUTES.TUTOR.DETAIL(tutor.id));
  };

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
    <>
      <Card
        cursor="pointer"
        borderColor={isActive ? '$appPrimary' : '$cardBorder'}
        borderWidth={2}
        maxWidth="100%"
        overflow="hidden"
        onPress={handleCardClick}
        onMouseEnter={(e) => onHover?.(tutor, e.currentTarget as unknown as HTMLElement)}
        padding={isMobile ? '$3' : '$4'}
      >
        <YStack
          gap="$2"
          width="100%"
        >
          <XStack
            gap="$3"
            alignItems="flex-start"
            width="100%"
          >
            {isMobile ? (
              <>
                <Image
                  src={tutor.avatar}
                  width={85}
                  height={85}
                  objectFit="cover"
                  aspectRatio={1}
                  borderRadius={8}
                  flexShrink={0}
                />
                <YStack
                  flex={1}
                  gap="$1.5"
                  minWidth={0}
                >
                  <XStack
                    alignItems="center"
                    gap="$1.5"
                    flexWrap="wrap"
                    minWidth={0}
                  >
                    <H2
                      size="$4"
                      fontWeight="700"
                      numberOfLines={1}
                      lineHeight={20}
                    >
                      {tutor.firstName} {tutor.lastName}
                    </H2>
                    {tutor.isProfessional && (
                      <Chip
                        tone="primary"
                        size="sm"
                        paddingVertical={3}
                        paddingHorizontal={10}
                      >
                        <ChipText
                          tone="primary"
                          fontSize={11}
                        >
                          {t('professional')}
                        </ChipText>
                      </Chip>
                    )}
                  </XStack>

                  <XStack
                    alignItems="baseline"
                    gap="$1"
                  >
                    <Text
                      size="lg"
                      fontWeight="700"
                      lineHeight={18}
                    >
                      {formatToVND(tutor.pricePerHour)}
                    </Text>
                    <Text
                      variant="muted"
                      fontSize={11}
                      lineHeight={16}
                    >
                      {t('perLesson')}
                    </Text>
                  </XStack>

                  <XStack
                    alignItems="center"
                    gap="$1"
                    minWidth={0}
                  >
                    <StarOutlineIcon size={14} />
                    <Text
                      size="md"
                      fontWeight="700"
                      lineHeight={16}
                    >
                      {tutor.ratingAverage.toFixed(1)}
                    </Text>
                    <Text
                      variant="muted"
                      numberOfLines={1}
                      flexShrink={1}
                      fontSize={11}
                      lineHeight={16}
                    >
                      {t('reviews', { count: tutor.ratingCount })}
                    </Text>
                  </XStack>

                  <XStack
                    alignItems="center"
                    gap="$1.5"
                    minWidth={0}
                    flexShrink={1}
                  >
                    <YStack flexShrink={0}>
                      <GraduationCapIcon
                        color={mutedColor}
                        size={13}
                      />
                    </YStack>
                    <Text
                      variant="muted"
                      flexShrink={1}
                      fontSize={11}
                      numberOfLines={1}
                      lineHeight={16}
                    >
                      {tutor.subject}
                    </Text>
                  </XStack>
                </YStack>
              </>
            ) : (
              <>
                <XStack
                  gap="$4"
                  minWidth={0}
                  flexShrink={0}
                >
                  <Image
                    src={tutor.avatar}
                    width={isCompact ? 96 : 150}
                    height={isCompact ? 96 : 150}
                    objectFit="cover"
                    aspectRatio={1}
                    borderRadius={8}
                    maxWidth="100%"
                    flexShrink={0}
                  />
                </XStack>

              <YStack
                flex={1}
                gap="$4"
                minWidth={0}
                maxWidth="100%"
              >
                {!isCompact && (
                  <XStack
                    alignItems="center"
                    gap="$2"
                    flexWrap="wrap"
                    minWidth={0}
                  >
                    <H2
                      size="$5"
                      fontWeight="700"
                      maxWidth="100%"
                    >
                      {tutor.firstName} {tutor.lastName}
                    </H2>
                    {tutor.isProfessional && (
                      <Chip tone="primary">
                        <ChipText tone="primary">{t('professional')}</ChipText>
                      </Chip>
                    )}
                  </XStack>
                )}

                <XStack
                  alignItems="center"
                  gap="$6"
                  flexWrap="wrap"
                  minWidth={0}
                >
                  <XStack
                    alignItems="center"
                    gap="$2"
                    minWidth={0}
                    flexShrink={1}
                  >
                    <YStack flexShrink={0}>
                      <GraduationCapIcon color={mutedColor} />
                    </YStack>
                    <Text
                      variant="muted"
                      flexShrink={1}
                    >
                      {t('teaches', { subject: tutor.subject })}
                    </Text>
                  </XStack>
                  <XStack
                    alignItems="center"
                    gap="$2"
                    minWidth={0}
                    flexShrink={1}
                  >
                    <YStack flexShrink={0}>
                      <WorldIcon color={mutedColor} />
                    </YStack>
                    <Text
                      variant="muted"
                      flexShrink={1}
                    >
                      {t('country', { country: tutor.country })}
                    </Text>
                  </XStack>
                </XStack>
                <XStack
                  alignItems="flex-start"
                  gap="$2"
                  minWidth={0}
                >
                  <YStack
                    flexShrink={0}
                    paddingTop={2}
                  >
                    <LanguageIcon color={mutedColor} />
                  </YStack>
                  <Text
                    variant="muted"
                    flex={1}
                    minWidth={0}
                    style={{ wordBreak: 'break-word' }}
                  >
                    {t('speaks', {
                      languages: tutor.languages.map((language) => language.languageCode).join(', '),
                    })}
                  </Text>
                </XStack>
                <Paragraph
                  numberOfLines={isCompact ? 2 : 3}
                  maxWidth="100%"
                >
                  {tutor.introduce}
                </Paragraph>

                <XStack
                  gap="$2"
                  flexWrap="wrap"
                  minWidth={0}
                >
                  {proficiencyTags.map((proficiency) => {
                    const isKnownProficiency = (ABOUT_PROFICIENCY_LEVELS as readonly string[]).includes(
                      proficiency
                    );

                    return (
                      <Tag key={proficiency}>
                        {isKnownProficiency ? t(`proficiency.${proficiency}`) : proficiency}
                      </Tag>
                    );
                  })}
                </XStack>
              </YStack>

              {!isCompact && (
                <Separator
                  vertical
                  height="100%"
                  flexShrink={0}
                />
              )}

              <YStack
                gap="$3"
                alignItems="flex-end"
                justifyContent="flex-start"
                minWidth={200}
                flexShrink={0}
                width={isCompact ? '100%' : undefined}
              >
                {!isCompact && (
                  <>
                    <XStack
                      alignItems="center"
                      gap="$1"
                      flexShrink={0}
                      justifyContent="flex-end"
                    >
                      <StarOutlineIcon />
                      <Text
                        size="xl"
                        fontWeight="700"
                        flexShrink={0}
                      >
                        {tutor.ratingAverage.toFixed(2)}
                      </Text>
                      <Text
                        variant="muted"
                        flexShrink={0}
                        whiteSpace="nowrap"
                      >
                        {t('reviews', { count: tutor.ratingCount })}
                      </Text>
                    </XStack>
                    <XStack
                      alignItems="baseline"
                      gap="$1"
                      justifyContent="flex-end"
                    >
                      <Text
                        size="xl"
                        fontWeight="700"
                      >
                        {formatToVND(tutor.pricePerHour)}
                      </Text>
                      <Text variant="muted">{t('perLesson')}</Text>
                    </XStack>
                  </>
                )}

                {isCompact && !isVeryNarrow ? (
                  <XStack
                    gap="$2"
                    width="100%"
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      flex={1}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleBookTrialClick();
                      }}
                    >
                      {t('bookTrial')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      flex={1}
                    >
                      {t('sendMessage')}
                    </Button>
                  </XStack>
                ) : (
                  <YStack
                    gap="$3"
                    width="100%"
                    minWidth={200}
                  >
                    <Button
                      variant="primary"
                      width="100%"
                      onPress={(e) => {
                        e.stopPropagation();
                        handleBookTrialClick();
                      }}
                    >
                      {t('bookTrial')}
                    </Button>
                    <Button
                      variant="outline"
                      width="100%"
                      size="sm"
                    >
                      {t('sendMessage')}
                    </Button>
                  </YStack>
                )}
              </YStack>
            </>
          )}
          </XStack>

          {isMobile && (
            <YStack
              gap="$1.5"
              width="100%"
            >
              <Paragraph
                numberOfLines={2}
                maxWidth="100%"
                fontSize={12}
                lineHeight={17}
                color="$appText"
              >
                {tutor.introduce}
              </Paragraph>
            </YStack>
          )}
        </YStack>
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
    </>
  )
}
