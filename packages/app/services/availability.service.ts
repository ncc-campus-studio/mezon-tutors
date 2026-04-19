import { apiClient } from './api-client';
import type { AvailabilityData } from '@mezon-tutors/app/features/availability';
import { DAY_KEYS } from '@mezon-tutors/shared';

type AvailabilitySlot = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

type GetAvailabilityResponse = {
  availability: AvailabilitySlot[];
};

export const availabilityService = {
  async getAvailability(): Promise<AvailabilityData> {
    const response = await apiClient.get<GetAvailabilityResponse>('/tutor-profiles/availability');
    
    const slotsByDay: Record<string, { startTime: string; endTime: string }[]> = {};
    DAY_KEYS.forEach(day => {
      slotsByDay[day] = [];
    });

    response.availability.forEach(slot => {
      const dayIndex = slot.dayOfWeek === 0 ? 6 : slot.dayOfWeek - 1;
      const dayKey = DAY_KEYS[dayIndex];
      slotsByDay[dayKey].push({
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    });

    return { slotsByDay };
  },

  async updateAvailability(data: AvailabilityData): Promise<{ success: boolean }> {
    const availability: AvailabilitySlot[] = [];
    
    Object.entries(data.slotsByDay).forEach(([dayKey, slots]) => {
      const dayIndex = DAY_KEYS.indexOf(dayKey);
      const dayOfWeek = dayIndex === 6 ? 0 : dayIndex + 1;
      
      slots.forEach(slot => {
        availability.push({
          dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        });
      });
    });

    return await apiClient.put('/tutor-profiles/availability', { availability });
  },
};
