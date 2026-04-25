import type { TutorDetailAvailabilitySlotDto } from '@mezon-tutors/shared';
import { parseTimeToHour } from './schedule-time';

export function mergeConsecutiveSlotsInSameHour(
  slots: TutorDetailAvailabilitySlotDto[]
): TutorDetailAvailabilitySlotDto[] {
  if (slots.length === 0) return [];

  const sortedSlots = [...slots].sort((a, b) => {
    if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
    return parseTimeToHour(a.startTime) - parseTimeToHour(b.startTime);
  });

  const merged: TutorDetailAvailabilitySlotDto[] = [];
  let current = { ...sortedSlots[0] };

  for (let i = 1; i < sortedSlots.length; i++) {
    const slot = sortedSlots[i];
    const currentStartHour = Math.floor(parseTimeToHour(current.startTime));
    const slotStartHour = Math.floor(parseTimeToHour(slot.startTime));
    const slotEndHour = Math.floor(parseTimeToHour(slot.endTime));
    
    if (
      slot.dayOfWeek === current.dayOfWeek &&
      slot.startTime === current.endTime &&
      currentStartHour === slotStartHour &&
      slotEndHour <= currentStartHour + 1
    ) {
      current.endTime = slot.endTime;
    } else {
      merged.push(current);
      current = { ...slot };
    }
  }
  
  merged.push(current);
  return merged;
}

export function getWeekHoursFromSlots(slots: TutorDetailAvailabilitySlotDto[]): number[] {
  if (slots.length === 0) return [];

  const hours = new Set<number>();
  slots.forEach((slot) => {
    const startHour = Math.floor(parseTimeToHour(slot.startTime));
    const endHour = Math.floor(parseTimeToHour(slot.endTime));
    
    for (let h = startHour; h <= endHour; h++) {
      hours.add(h);
    }
  });

  if (hours.size === 0) return [];

  const sortedHours = Array.from(hours).sort((a, b) => a - b);
  return sortedHours;
}
