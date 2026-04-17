import type {
  TrialLessonBookingRequestItem,
  TrialLessonBookingRequestStatusFilter,
} from '@mezon-tutors/app/services';
import type { BookingRequestFilter, BookingRequestStatus, BookingRequestsViewData } from './types';

const STATUS_TONE_MAP: Record<
  BookingRequestStatus,
  {
    backgroundColor: string;
    color: string;
  }
> = {
  pending: {
    backgroundColor: '$dashboardTutorStatusPendingBg',
    color: '$dashboardTutorStatusPendingText',
  },
  confirmed: {
    backgroundColor: '$dashboardTutorStatusConfirmedBg',
    color: '$dashboardTutorStatusConfirmedText',
  },
  completed: {
    backgroundColor: '$dashboardTutorStatusCompletedBg',
    color: '$dashboardTutorStatusCompletedText',
  },
};

export function getStudentInitials(name: string): string {
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) {
    return 'NA';
  }

  return tokens
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? '')
    .join('');
}

export function getStatusTone(status: BookingRequestStatus): {
  backgroundColor: string;
  color: string;
} {
  return STATUS_TONE_MAP[status];
}

export function mapFilterToApiStatus(filter: BookingRequestFilter): TrialLessonBookingRequestStatusFilter | undefined {
  if (filter === 'all') return undefined;
  return filter.toUpperCase() as TrialLessonBookingRequestStatusFilter;
}

export function mapStatus(status: string): 'pending' | 'confirmed' | 'completed' {
  if (status === 'CONFIRMED') return 'confirmed';
  if (status === 'COMPLETED') return 'completed';
  return 'pending';
}

export function mapDateKey(startAt: string): 'dateTomorrow' | 'dateFriday' | 'dateMonday' | 'datePastSession' | 'dateSaturday' {
  const date = new Date(startAt);
  const now = new Date();
  const diffDays = Math.round((date.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays < 0) return 'datePastSession';
  const day = date.getDay();
  if (diffDays <= 1) return 'dateTomorrow';
  if (day === 5) return 'dateFriday';
  if (day === 1) return 'dateMonday';
  if (day === 6) return 'dateSaturday';
  return 'dateTomorrow';
}

export function mapTimeKey(startAt: string): 'slot0400To0530' | 'slot0200To0300' | 'slotCompletedSession' | 'slot1000To1200' {
  const hour = new Date(startAt).getHours();
  if (hour >= 10 && hour < 12) return 'slot1000To1200';
  if (hour >= 14 && hour < 16) return 'slot0200To0300';
  if (hour >= 16 && hour < 18) return 'slot0400To0530';
  return 'slot0200To0300';
}

export function mapBookingRequestsToViewData(
  items: TrialLessonBookingRequestItem[],
  page: number,
  limit: number,
  total: number,
  totalPages: number
): BookingRequestsViewData {
  return {
    requests: items.map((item) => {
      const totalPrice = Number(item.grossAmount)
      const rate =
        item.durationMinutes > 0 ? (totalPrice * 60) / item.durationMinutes : 0
      return {
        id: item.id,
        studentName: item.studentName,
        studentAvatarUrl: item.studentAvatarUrl,
        studentLevelKey: 'undergraduateStudent',
        subjectKey: 'advancedCalculus',
        requestedDateKey: mapDateKey(item.startAt),
        requestedTimeKey: mapTimeKey(item.startAt),
        durationLabel: `(${(item.durationMinutes / 60).toFixed(item.durationMinutes % 60 === 0 ? 0 : 1)}h)`,
        rateLabel: `$${totalPrice.toFixed(2)}`,
        rateSubLabel: `$${rate.toFixed(2)}/hr`,
        status: mapStatus(item.status),
      };
    }),
    metrics: [
      { key: 'conversionRate', value: 'N/A' },
      { key: 'responseTime', value: 'N/A' },
      { key: 'nextPayout', value: '$0.00' },
    ],
    total,
    page,
    pageSize: limit,
    totalPages: Math.max(1, totalPages),
  };
}
