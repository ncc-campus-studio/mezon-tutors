'use client';

import { YStack } from 'tamagui';
import { CALENDAR_THEME_CONFIG, DEFAULT_THEME_CONFIG } from '@mezon-tutors/shared';
import type { ReactNode } from 'react';
import { Calendar } from './Calendar';
import { buildDefaultRenderSlot } from './CalendarCardEmptySlots';
import { resolveCardPresetRender } from './CalendarCardPresets';
import type { BaseCalendarProps, CalendarPresetData, CalendarType } from '../types';

type CalendarCardProps<TEvent> = BaseCalendarProps<TEvent> & {
  header?: ReactNode;
  footer?: ReactNode;
  presetData?: CalendarPresetData;
};

export function CalendarCard<TEvent = unknown>({
  header,
  footer,
  presetData,
  type,
  themePrefix = 'calendar',
  renderSlot,
  ...calendarProps
}: CalendarCardProps<TEvent>) {
  const resolvedThemePrefix = type ?? themePrefix;
  const themeConfig = CALENDAR_THEME_CONFIG[resolvedThemePrefix] ?? DEFAULT_THEME_CONFIG;
  const { cardBorder = true, cardBorderRadius = 16, cardPadding = 16 } = themeConfig;

  const defaultRenderSlot = buildDefaultRenderSlot(resolvedThemePrefix, themeConfig);
  const finalRenderSlot = renderSlot ?? defaultRenderSlot;

  const presetResult =
    !header && !footer && presetData
      ? resolveCardPresetRender(resolvedThemePrefix as CalendarType, {
          data: presetData,
          isCompact: Boolean(calendarProps.isCompact),
        })
      : undefined;

  return (
    <YStack
      width="100%"
      borderWidth={cardBorder ? 1 : 0}
      borderColor={cardBorder ? `$${resolvedThemePrefix}CardBorder` : 'transparent'}
      borderRadius={cardBorderRadius}
      backgroundColor={`$${resolvedThemePrefix}CardBackground`}
      padding={cardPadding}
      gap="$3"
    >
      {header ?? presetResult?.header}

      <Calendar
        {...calendarProps}
        type={type}
        themePrefix={resolvedThemePrefix}
        renderSlot={finalRenderSlot}
      />

      {footer ?? presetResult?.footer}
    </YStack>
  );
}
