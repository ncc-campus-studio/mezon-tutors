import { YStack, XStack, Button } from '@mezon-tutors/app/ui'
import { Select } from '@mezon-tutors/app/ui/Select'
import { ABOUT_COUNTRIES, ABOUT_LANGUAGES } from '@mezon-tutors/shared'

export function TutorsFilter() {
  return (
    <YStack gap="$3">
      <XStack gap="$4">
        <Select
          label="I want to learn"
          value="Any language"
          options={['Any language', ...ABOUT_LANGUAGES].map((language) => ({
            label: language,
            value: language,
          }))}
        />
        <Select
          label="Price per Lesson"
          value="all"
          options={[
            { label: 'Any price', value: 'all' },
            { label: 'Price per Lesson', value: 'price_per_lesson' },
            { label: 'Price per Hour', value: 'price_per_hour' },
            { label: 'Price per Session', value: 'price_per_session' },
          ]}
        />
        <Select
          label="Country"
          value="Any country"
          options={['Any country', ...ABOUT_COUNTRIES].map((country) => ({
            label: country,
            value: country,
          }))}
        />
        <Select
          label="Availability"
          value="all"
          options={[
            { label: 'Any availability', value: 'all' },
            { label: 'Morning', value: 'morning' },
            { label: 'Afternoon', value: 'afternoon' },
            { label: 'Evening', value: 'evening' },
            { label: 'Night', value: 'night' },
          ]}
        />
        <Select
          label="Specialties"
          value="all"
          options={[
            { label: 'Any specialties', value: 'all' },
            { label: 'Math', value: 'math' },
            { label: 'Science', value: 'science' },
            { label: 'History', value: 'history' },
            { label: 'English', value: 'english' },
            { label: 'Spanish', value: 'spanish' },
            { label: 'French', value: 'french' },
          ]}
        />
      </XStack>
    </YStack>
  )
}
