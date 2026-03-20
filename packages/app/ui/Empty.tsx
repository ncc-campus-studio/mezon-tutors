import { YStack, Text } from './index'
import { CircleAlert } from '@tamagui/lucide-icons'

type EmptyProps = {
  title?: string
  description?: string
}

export function Empty({ title = 'No data', description }: EmptyProps) {
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="$6"
      gap="$3"
    >
      <YStack
        width={72}
        height={72}
        borderRadius={999}
        alignItems="center"
        justifyContent="center"
        backgroundColor="$appBackgroundMuted"
      >
        <CircleAlert size={32} color="$appIconSubtle" />
      </YStack>
      <Text fontSize="$6" fontWeight="700">
        {title}
      </Text>
      {description ? (
        <Text variant="muted" textAlign="center">
          {description}
        </Text>
      ) : null}
    </YStack>
  )
}

