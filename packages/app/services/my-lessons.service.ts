import type {
  MyLessonApiCategory,
  MyLessonApiItem,
  MyLessonApiStatus,
  MyLessonTutorApiItem,
  MyLessonWeekDayApiItem,
  MyLessonsApiResponse,
} from '@mezon-tutors/shared';
import type {
  LessonCategory,
  LessonItem,
  LessonStatus,
  MyLessonsCalendarMeta,
  MyLessonsViewData,
  TutorItem,
  WeekDay,
} from '../features/home/my-lessons/types';
import { apiClient } from './api-client';

const BASE = '/my-lessons';

enum MyLessonsStatusEnum {
  Upcoming = 'upcoming',
  Completed = 'completed',
}

function mapCategory(category: MyLessonApiCategory): LessonCategory {
  const normalized = category
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return normalized || 'other';
}

function mapStatus(status: MyLessonApiStatus): LessonStatus {
  return status === MyLessonsStatusEnum.Upcoming
    ? MyLessonsStatusEnum.Upcoming
    : MyLessonsStatusEnum.Completed;
}

function mapWeekDay(item: MyLessonWeekDayApiItem): WeekDay {
  return {
    shortLabel: item.short_label,
    dateLabel: item.date_label,
  };
}

function mapLesson(item: MyLessonApiItem): LessonItem {
  return {
    id: item.id,
    subject: item.subject,
    tutor: item.tutor_name,
    tutorAvatar: item.tutor_avatar,
    category: mapCategory(item.category),
    status: mapStatus(item.status),
    dateLabel: item.date_label,
    timeLabel: item.time_label,
    dayIndex: item.day_index,
    startHour: item.start_hour,
    endHour: item.end_hour,
  };
}

function mapTutor(item: MyLessonTutorApiItem): TutorItem {
  return {
    id: item.id,
    name: item.name,
    avatar: item.avatar,
    teaches: item.teaches,
    availability: item.availability,
    completedLessons: item.completed_lessons,
    nextLessonLabel: item.next_lesson_label,
    ratingAverage: item.rating_average,
    reviewCount: item.review_count,
  };
}

function mapCalendarMeta(data: MyLessonsApiResponse): MyLessonsCalendarMeta {
  return {
    title: data.calendar_title,
    weekDays: data.week_days.map(mapWeekDay),
    weekHours: data.week_hours,
    currentDayIndex: data.current_day_index,
    currentHour: data.current_hour,
  };
}

export const myLessonsService = {
  async getOverview(studentMezonUserId?: string, weekStartDate?: string): Promise<MyLessonsViewData> {
    const params: Record<string, string> = {};
    
    if (studentMezonUserId) {
      params.student_mezon_user_id = studentMezonUserId;
    }
    
    if (weekStartDate) {
      params.week_start_date = weekStartDate;
    }
    
    const data = await apiClient.get<MyLessonsApiResponse>(BASE, { params });

    return {
      calendar: mapCalendarMeta(data),
      calendarLessons: data.calendar_lessons.map(mapLesson),
      upcomingLessons: data.upcoming_lessons.map(mapLesson),
      previousLessons: data.previous_lessons.map(mapLesson),
      tutors: data.tutors.map(mapTutor),
    };
  },
};
