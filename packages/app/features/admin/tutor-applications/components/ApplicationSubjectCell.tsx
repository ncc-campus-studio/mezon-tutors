import { Text, YStack } from '@mezon-tutors/app/ui'

export type ApplicationSubjectCellProps = {
  subject: string
}

export function ApplicationSubjectCell({ subject }: ApplicationSubjectCellProps) {
  return (
    <YStack alignItems="flex-start">
      <YStack
        paddingVertical={4}
        paddingHorizontal={10}
        borderRadius={999}
        backgroundColor="$itemBackground"
      >
        <Text size="sm" color="$appPrimary" fontWeight="700">
          {subject}
        </Text>
      </YStack>
    </YStack>
  )
}
