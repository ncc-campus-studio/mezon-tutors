import { Text, YStack } from '@mezon-tutors/app/ui'

export type ApplicationNameCellProps = {
  name: string
  subject?: string
  date?: string
  isSelected: boolean
  isNarrow: boolean
}

export function ApplicationNameCell({
  name,
  subject,
  date,
  isSelected,
  isNarrow,
}: ApplicationNameCellProps) {
  return (
    <YStack gap={2}>
      <Text fontWeight={isSelected ? '600' : '500'} variant="muted">
        {name}
      </Text>
      {isNarrow && subject != null && date != null && (
        <Text size="sm" variant="muted">
          {subject} · {date}
        </Text>
      )}
    </YStack>
  )
}
