import { Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { TUTOR_DETAIL_WEEKDAY_KEYS } from '@mezon-tutors/shared'
import { useTranslations } from 'next-intl'
import { TutorScheduleTabProps } from './types'

export function TutorScheduleTab({ tutor }: TutorScheduleTabProps) {
  const t = useTranslations('Tutors.Detail')

  const groupedByDay = TUTOR_DETAIL_WEEKDAY_KEYS.map((key, dayOfWeek) => {
    const slots = tutor.availability
      .filter((slot) => slot.isActive && slot.dayOfWeek === dayOfWeek)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))

    return { key, dayOfWeek, slots }
  })

  return (
    <YStack gap="$3">
      <Text color="$tutorsDetailPrimaryText" fontSize={20} fontWeight="800">
        {t('scheduleTitle')}
      </Text>
      <Text color="$tutorsDetailMutedText">{t('scheduleHint', { timezone: tutor.timezone })}</Text>

      <XStack gap="$2.5" flexWrap="wrap">
        {groupedByDay.map((day) => (
          <YStack
            key={day.key}
            minWidth={110}
            flex={1}
            maxWidth={130}
            backgroundColor="$tutorsDetailScheduleColumnBackground"
            borderWidth={1}
            borderColor="$tutorsDetailScheduleColumnBorder"
            borderRadius={12}
            padding="$2"
            gap="$1.5"
          >
            <Text color="$tutorsDetailSecondaryText" fontSize={12} fontWeight="700">
              {t(`weekdays.${day.key}`)}
            </Text>

            {day.slots.length === 0 ? (
              <YStack
                borderRadius={8}
                paddingVertical="$1.5"
                paddingHorizontal="$2"
                backgroundColor="$tutorsDetailScheduleSlotEmptyBackground"
              >
                <Text color="$tutorsDetailMutedText" fontSize={11}>
                  {t('scheduleUnavailable')}
                </Text>
              </YStack>
            ) : (
              day.slots.map((slot) => (
                <YStack
                  key={`${day.dayOfWeek}-${slot.startTime}-${slot.endTime}`}
                  borderRadius={8}
                  paddingVertical="$1.5"
                  paddingHorizontal="$2"
                  backgroundColor="$tutorsDetailScheduleSlotBackground"
                  borderWidth={1}
                  borderColor="$tutorsDetailScheduleSlotBorder"
                >
                  <Text color="$tutorsDetailPrimaryText" fontSize={11} fontWeight="700">
                    {slot.startTime}
                  </Text>
                  <Text color="$tutorsDetailSecondaryText" fontSize={11}>
                    {slot.endTime}
                  </Text>
                </YStack>
              ))
            )}
          </YStack>
        ))}
      </XStack>
    </YStack>
  )
}
