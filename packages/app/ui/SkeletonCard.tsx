import { XStack, YStack } from 'tamagui';

export function SkeletonCard() {
  return (
    <YStack
      width="100%"
      height={200}
      paddingLeft={'$7'}
      paddingRight={'$7'}
      borderRadius="$appCard"
      borderWidth={3}
      borderStyle="dashed"
      borderColor="$borderSubtle"
      backgroundColor="$backgroundMuted"
    >
      <XStack
        gap="$4"
        padding="$4"
        height={'100%'}
        borderRadius="$appCard"
        backgroundColor="$skeletonBg"
        alignItems="center"
      >
        {/* Avatar skeleton */}
        <YStack
          width={80}
          height={80}
          borderRadius="$4"
          backgroundColor="#95A3B8"
        />

        {/* Text skeleton */}
        <YStack
          flex={1}
          gap="$2"
        >
          <YStack
            height={12}
            width="90%"
            borderRadius="$2"
            backgroundColor="#95A3B8"
          />
          <YStack
            height={12}
            width="65%"
            borderRadius="$2"
            backgroundColor="#95A3B8"
          />
          <YStack
            height={12}
            width="50%"
            borderRadius="$2"
            backgroundColor="#95A3B8"
          />
        </YStack>
      </XStack>
    </YStack>
  );
}
