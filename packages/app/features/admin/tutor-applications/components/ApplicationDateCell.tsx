import { Text } from '@mezon-tutors/app/ui'

export type ApplicationDateCellProps = {
  date: string
}

export function ApplicationDateCell({ date }: ApplicationDateCellProps) {
  return (
    <Text size="sm" variant="muted">
      {date}
    </Text>
  )
}
