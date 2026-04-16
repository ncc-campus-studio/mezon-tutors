import type {
  TutorBookingRequestDateKey,
  TutorBookingRequestLevelKey,
  TutorBookingRequestSubjectKey,
  TutorBookingRequestTimeKey,
} from '@mezon-tutors/shared';

export type BookingRequestStatus = 'pending' | 'confirmed' | 'completed';
export type BookingRequestFilter = 'all' | BookingRequestStatus;
export type BookingRequestLevelKey = TutorBookingRequestLevelKey;
export type BookingRequestSubjectKey = TutorBookingRequestSubjectKey;
export type BookingRequestDateKey = TutorBookingRequestDateKey;
export type BookingRequestTimeKey = TutorBookingRequestTimeKey;

export interface BookingRequestViewModel {
  id: string;
  studentName: string;
  studentAvatarUrl?: string;
  studentLevelKey: BookingRequestLevelKey;
  subjectKey: BookingRequestSubjectKey;
  requestedDateKey: BookingRequestDateKey;
  requestedTimeKey: BookingRequestTimeKey;
  durationLabel: string;
  rateLabel: string;
  rateSubLabel: string;
  status: BookingRequestStatus;
}

export interface BookingRequestMockItem extends BookingRequestViewModel {
  createdAt: string;
  requestedDate: string;
}

export type BookingRequestActionHandlers = {
  onApprove?: (requestId: string) => void;
  onDecline?: (requestId: string) => void;
  onMessage?: (requestId: string) => void;
  onFeedback?: (requestId: string) => void;
};

export type BookingRequestActionContext = {
  requestId: string;
  status: BookingRequestStatus;
};

export type SummaryMetricKey = 'conversionRate' | 'responseTime' | 'nextPayout';

export interface SummaryMetricViewModel {
  key: SummaryMetricKey;
  value: string;
}

export interface BookingRequestsViewData {
  requests: BookingRequestViewModel[];
  metrics: SummaryMetricViewModel[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type BookingRequestTableProps = {
  requests: BookingRequestViewModel[];
  isCompact: boolean;
  actions?: BookingRequestActionHandlers;
};

export type BookingRequestRowProps = {
  item: BookingRequestViewModel;
  isCompact: boolean;
  actions?: BookingRequestActionHandlers;
};

export type StudentCellProps = {
  studentName: string;
  studentLevelKey: BookingRequestLevelKey;
  studentAvatarUrl?: string;
};

export type StudentAvatarProps = {
  studentName: string;
  studentAvatarUrl?: string;
};

export type StatusBadgeProps = {
  status: BookingRequestViewModel['status'];
};

export interface BookingRequestsQuery {
  tutorId: string;
  status?: BookingRequestStatus;
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'requestedDate';
  sortOrder?: 'asc' | 'desc';
}

export type TutorBookingRequestStatus = BookingRequestStatus;
export type TutorBookingRequestFilter = BookingRequestFilter;
export type TutorBookingRequestItem = BookingRequestViewModel;
export type TutorBookingSummaryMetric = SummaryMetricViewModel;
export type TutorBookingSummaryMetricKey = SummaryMetricKey;
export type TutorBookingRequestsViewData = BookingRequestsViewData;
