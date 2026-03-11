import { useTheme } from 'tamagui'
import { XStack, YStack } from '@mezon-tutors/app/ui'
import { EyeIcon } from '@mezon-tutors/app/ui/icons/EyeIcon'
import { CloseCircleIcon } from '@mezon-tutors/app/ui/icons/CloseCircle'
import { CircleCheckIcon } from '@mezon-tutors/app/ui/icons'

export type ApplicationActionsCellProps = {
  applicationId: string
  isSelected: boolean
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function ApplicationActionsCell({
  applicationId,
  isSelected,
  onApprove,
  onReject,
}: ApplicationActionsCellProps) {
  const theme = useTheme()
  const primaryColor = theme.appPrimary?.val
  const successColor = theme.green6?.val
  const dangerColor = theme.red6?.val
  const itemBackground = theme.itemBackground?.val
  const mutedColor = theme.colorMuted?.val

  const stopPropagation = (e: unknown) => {
    ;(e as { stopPropagation?: () => void })?.stopPropagation?.()
  }

  return (
    <XStack justifyContent="flex-end" gap={10}>
      <YStack
        width={32}
        height={32}
        borderRadius={999}
        alignItems="center"
        justifyContent="center"
        backgroundColor={isSelected ? primaryColor : itemBackground}
      >
        <EyeIcon size={16} color={isSelected ? '#FFFFFF' : mutedColor} />
      </YStack>
      <YStack
        width={32}
        height={32}
        borderRadius={999}
        alignItems="center"
        justifyContent="center"
        backgroundColor={itemBackground}
        cursor="pointer"
        onPress={(e) => {
          stopPropagation(e)
          onApprove(applicationId)
        }}
      >
        <CircleCheckIcon size={24} color={successColor} />
      </YStack>
      <YStack
        width={32}
        height={32}
        borderRadius={999}
        alignItems="center"
        justifyContent="center"
        backgroundColor={itemBackground}
        cursor="pointer"
        onPress={(e) => {
          stopPropagation(e)
          onReject(applicationId)
        }}
      >
        <CloseCircleIcon size={18} color={dangerColor} />
      </YStack>
    </XStack>
  )
}
