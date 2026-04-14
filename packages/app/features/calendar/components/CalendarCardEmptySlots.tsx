'use client';

import { Text, YStack } from 'tamagui';
import type { CalendarThemeConfig } from '@mezon-tutors/shared';

function DefaultEmptySlot({ text }: { text?: string }) {
  if (!text) return null;

  return (
    <YStack
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
      opacity={0.5}
    >
      <Text
        fontSize={11}
        fontWeight="600"
        color="$myScheduleDayLabel"
        textTransform="uppercase"
        letterSpacing={0.5}
      >
        {text}
      </Text>
    </YStack>
  );
}

function OutlinedEmptySlot({
  themePrefix,
  text,
  maxWidth,
  minHeight,
  borderRadius = 12,
  borderStyle = 'dashed',
}: {
  themePrefix: string;
  text?: string;
  maxWidth?: number;
  minHeight?: number;
  borderRadius?: number;
  borderStyle?: 'solid' | 'dashed';
}) {
  return (
    <YStack
      width="100%"
      height="100%"
      maxWidth={maxWidth}
      borderRadius={borderRadius}
      backgroundColor={`$${themePrefix}SlotEmptyBackground`}
      borderWidth={1}
      borderStyle={borderStyle}
      borderColor={`$${themePrefix}SlotEmptyBorder`}
      alignSelf="center"
      justifyContent="center"
      alignItems="center"
      minHeight={minHeight}
    >
      {text ? (
        <Text
          fontSize={10}
          fontWeight="700"
          color={`$${themePrefix}SlotEmptyText`}
          letterSpacing={0.6}
        >
          {text}
        </Text>
      ) : null}
    </YStack>
  );
}

function TutorScheduleEmptySlot({ themePrefix }: { themePrefix: string }) {
  return (
    <YStack
      width="100%"
      height="auto"
      maxWidth={110}
      maxHeight={60}
      borderRadius={12}
      backgroundColor={`$${themePrefix}SlotEmptyBackground`}
      borderWidth={1}
      borderColor={`$${themePrefix}SlotEmptyBorder`}
      alignSelf="center"
      minHeight={56}
    />
  );
}

export function buildDefaultRenderSlot(themePrefix: string, themeConfig: CalendarThemeConfig) {
  if (!themeConfig.showEmptySlots) return undefined;

  if (themePrefix === 'tutorSchedule') {
    return () => <TutorScheduleEmptySlot themePrefix={themePrefix} />;
  }

  if (themePrefix === 'mySchedule' || themeConfig.emptySlotStyle === 'outlinedCard') {
    return () => (
      <OutlinedEmptySlot
        themePrefix={themePrefix}
        text={themeConfig.emptySlotText}
        maxWidth={themeConfig.emptySlotMaxWidth}
        minHeight={themeConfig.emptySlotMinHeight}
        borderRadius={themeConfig.emptySlotBorderRadius}
        borderStyle={themeConfig.emptySlotBorderStyle}
      />
    );
  }

  return () => <DefaultEmptySlot text={themeConfig.emptySlotText} />;
}
