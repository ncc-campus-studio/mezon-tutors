import { YStack } from '@mezon-tutors/app/ui';

export function TutorScheduleEmptySlot() {
  return (
    <YStack
      width="100%"
      height="auto"
      maxWidth={110}
      maxHeight={60}
      borderRadius={12}
      backgroundColor="rgba(30, 58, 95, 0.3)"
      borderWidth={1}
      borderColor="rgba(45, 74, 124, 0.4)"
      alignSelf="center"
      minHeight={56}
    />
  );
}
