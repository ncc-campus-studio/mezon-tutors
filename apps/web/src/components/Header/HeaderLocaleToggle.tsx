import { HEADER_LOCALES } from '@mezon-tutors/shared'
import { Button, Text, XStack } from '@mezon-tutors/app/ui'
import { WorldIcon } from '@mezon-tutors/app/ui/icons'

type HeaderLocaleToggleProps = {
  locale: string
  onToggle: () => void
  iconColor: string
}

export function HeaderLocaleToggle({ locale, onToggle, iconColor }: HeaderLocaleToggleProps) {
  return (
    <Button
      onPress={onToggle}
      borderWidth={1}
      borderColor="$myLessonsTopNavBorder"
      borderRadius={999}
      backgroundColor="$myLessonsCardBackground"
      color="$myLessonsHeaderTitle"
      paddingVertical={7}
      paddingHorizontal={12}
      style={{ cursor: 'pointer', transition: 'all 220ms cubic-bezier(0.22,1,0.36,1)' }}
      hoverStyle={{
        y: -1,
        borderColor: '$myLessonsPrimaryButton',
        backgroundColor: '$myLessonsSwitcherBackground',
      }}
    >
      <XStack alignItems="center" gap={8}>
        <WorldIcon size={14} color={iconColor} />
        <Text fontSize={13} fontWeight="700" color="$myLessonsHeaderTitle" lineHeight={18}>
          {HEADER_LOCALES.find((item) => item.code === locale)?.label ?? 'EN'}
        </Text>
      </XStack>
    </Button>
  )
}
