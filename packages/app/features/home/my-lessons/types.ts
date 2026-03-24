export type MyLessonsTab = 'lessons' | 'calendar' | 'tutors';

export type LessonCategory = string;

export type LessonStatus = 'upcoming' | 'completed';

export type WeekDay = {
  shortLabel: string;
  dateLabel: string;
};

export type LessonItem = {
  id: string;
  subject: string;
  tutor: string;
  tutorAvatar: string;
  category: LessonCategory;
  dateLabel: string;
  timeLabel: string;
  dayIndex: number;
  startHour: number;
  endHour: number;
  status: LessonStatus;
};

export type TutorItem = {
  id: string;
  name: string;
  avatar: string;
  teaches: string;
  availability: string;
  completedLessons: number;
  nextLessonLabel: string;
  ratingAverage: number;
  reviewCount: number;
};

export type MyLessonsCalendarMeta = {
  title: string;
  weekDays: WeekDay[];
  weekHours: number[];
  currentDayIndex: number;
  currentHour: number;
};

export type MyLessonsViewData = {
  calendar: MyLessonsCalendarMeta;
  calendarLessons: LessonItem[];
  upcomingLessons: LessonItem[];
  previousLessons: LessonItem[];
  tutors: TutorItem[];
};

