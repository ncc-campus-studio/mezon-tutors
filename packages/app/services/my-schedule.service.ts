import { apiClient } from './api-client';

const BASE = '/my-schedule';

export type MyScheduleApiResponse = {
  availability: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }>;
  lessons: Array<{
    id: string;
    dayIndex: number;
    startHour: number;
    endHour: number;
    status: 'upcoming' | 'pending' | 'blocked' | 'available';
    title: string;
    studentName: string;
    timeLabel: string;
  }>;
};

export const myScheduleService = {
  async getSchedule(tutorMezonUserId?: string, weekStartDate?: string): Promise<MyScheduleApiResponse> {
    const params: Record<string, string> = {};
    if (tutorMezonUserId) {
      params.tutor_mezon_user_id = tutorMezonUserId;
    }
    if (weekStartDate) {
      params.week_start_date = weekStartDate;
    }
    return await apiClient.get<MyScheduleApiResponse>(BASE, { params });
  },
};
