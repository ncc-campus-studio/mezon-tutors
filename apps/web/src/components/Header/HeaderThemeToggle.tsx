import { Button } from '@mezon-tutors/app/ui'

type HeaderThemeToggleProps = {
  isDark: boolean
  onToggleAction: () => void
}

function ThemeIcon({ isDark }: { isDark: boolean }) {
  if (isDark) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2.5V5.2M12 18.8V21.5M21.5 12H18.8M5.2 12H2.5M18.7 5.3L16.8 7.2M7.2 16.8L5.3 18.7M18.7 18.7L16.8 16.8M7.2 7.2L5.3 5.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function HeaderThemeToggle({ isDark, onToggleAction }: HeaderThemeToggleProps) {
  return (
    <Button
      onPress={onToggleAction}
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
        scale: 1.02,
      }}
    >
      <ThemeIcon isDark={isDark} />
    </Button>
  )
}
