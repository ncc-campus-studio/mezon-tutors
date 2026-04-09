import type { BookingRequestStatus } from './types';

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
