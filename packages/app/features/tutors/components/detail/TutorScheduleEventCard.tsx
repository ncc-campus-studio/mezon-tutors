import { Text, YStack } from '@mezon-tutors/app/ui';
import type { TutorDetailAvailabilitySlotDto } from '@mezon-tutors/shared';

type TutorScheduleEventCardProps = {
  slot: TutorDetailAvailabilitySlotDto;
  isCompact: boolean;
};

export function TutorScheduleEventCard({ slot, isCompact }: TutorScheduleEventCardProps) {
  return (
    <YStack
      width="100%"
      height="auto"
      maxWidth={isCompact ? 110 : 120}
      maxHeight={isCompact ? 60 : 68}
      minWidth={0}
      borderRadius={12}
      backgroundColor="$tutorScheduleSlotBackground"
      borderWidth={1}
      borderColor="$tutorScheduleSlotBorder"
      paddingVertical={isCompact ? '$1.5' : '$2'}
      paddingHorizontal={isCompact ? '$2' : '$2.5'}
      gap={2}
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      alignSelf="center"
    >
      <Text
        color="$tutorScheduleSlotText"
        fontSize={isCompact ? 12 : 13}
        fontWeight="600"
        textAlign="center"
        numberOfLines={1}
      >
        {slot.startTime}
      </Text>
      <Text
        color="$tutorScheduleSlotSubtext"
        fontSize={isCompact ? 10 : 11}
        fontWeight="500"
        textAlign="center"
        numberOfLines={1}
      >
        {slot.endTime}
      </Text>
    </YStack>
  );
}
