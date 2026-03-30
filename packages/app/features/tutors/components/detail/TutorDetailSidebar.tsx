import { Button, Card, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { CalendarIcon, CheckIcon, UsersIcon } from '@mezon-tutors/app/ui/icons'
import { useTranslations } from 'next-intl'
import { TutorAboutTabProps } from './types'

export function TutorDetailSidebar({ tutor }: TutorAboutTabProps) {
  const t = useTranslations('Tutors.Detail')

  return (
    <YStack gap="$3">
      <Card
        backgroundColor="$tutorsDetailSidebarBackground"
        borderWidth={1}
        borderColor="$tutorsDetailSidebarBorder"
        borderRadius={16}
        padding="$3.5"
        gap="$3"
      >
        <YStack gap="$1">
          <XStack alignItems="baseline" gap="$1.5">
            <Text color="$tutorsDetailPrimaryText" fontSize={32} fontWeight="900" lineHeight={34}>
              ${tutor.pricePerHour}
            </Text>
            <Text color="$tutorsDetailMutedText">{t('perLesson')}</Text>
          </XStack>
        </YStack>

        <Button variant="primary">{t('bookTrial')}</Button>
        <Button variant="outline">{t('sendMessage')}</Button>

        <YStack gap="$2" paddingTop="$1">
          <XStack gap="$2" alignItems="center">
            <CalendarIcon size={16} color="$tutorsDetailAccentText" />
            <Text color="$tutorsDetailSecondaryText">
              {t('bookedLast48h', { count: tutor.stats.bookedLessonsLast48h })}
            </Text>
          </XStack>
          <XStack gap="$2" alignItems="center">
            <UsersIcon size={16} color="$tutorsDetailAccentText" />
            <Text color="$tutorsDetailSecondaryText">
              {t('totalStudents', { count: tutor.stats.totalStudents })}
            </Text>
          </XStack>
          <XStack gap="$2" alignItems="center">
            <CheckIcon size={16} color="$tutorsDetailAccentText" />
            <Text color="$tutorsDetailSecondaryText">
              {t('totalLessons', { count: tutor.stats.totalLessonsTaught })}
            </Text>
          </XStack>
        </YStack>
      </Card>

      <Card
        backgroundColor="$tutorsDetailPromoBackground"
        borderWidth={1}
        borderColor="$tutorsDetailPromoBorder"
        borderRadius={16}
        padding="$3.5"
        gap="$2.5"
      >
        <Text color="$tutorsDetailPrimaryText" fontSize={18} fontWeight="800">
          {t('promoTitle')}
        </Text>
        <Text color="$tutorsDetailSecondaryText">{t('promoDescription')}</Text>
        <Button size="sm" variant="secondary">
          {t('promoAction')}
        </Button>
      </Card>
    </YStack>
  )
}
