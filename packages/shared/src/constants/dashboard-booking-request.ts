export type TutorBookingRequestStatus = 'pending' | 'confirmed' | 'completed';
export type TutorBookingRequestFilter = 'all' | TutorBookingRequestStatus;
export type TutorBookingRequestActionKind =
  | 'approve'
  | 'decline'
  | 'message'
  | 'feedback';

export type TutorBookingRequestActionConfig =
  | {
      variant: 'icon';
      kind: TutorBookingRequestActionKind;
      iconSize: number;
      glow?: boolean;
    }
  | {
      variant: 'label';
      kind: 'message' | 'feedback';
      iconSize: number;
      textKey: 'message' | 'feedback';
      glow?: boolean;
      pressOpacity: number;
    };

export const TUTOR_BOOKING_SUMMARY_METRIC_KEYS = [
  'conversionRate',
  'responseTime',
  'nextPayout',
] as const;
export type TutorBookingSummaryMetricKey =
  (typeof TUTOR_BOOKING_SUMMARY_METRIC_KEYS)[number];

export const TUTOR_BOOKING_REQUEST_LEVEL_KEYS = [
  'undergraduateStudent',
  'highSchoolJunior',
  'postGradPreparation',
] as const;
export type TutorBookingRequestLevelKey =
  (typeof TUTOR_BOOKING_REQUEST_LEVEL_KEYS)[number];

export const TUTOR_BOOKING_REQUEST_SUBJECT_KEYS = [
  'advancedCalculus',
  'apPhysics1',
  'dataScience',
  'biochemistry2',
] as const;
export type TutorBookingRequestSubjectKey =
  (typeof TUTOR_BOOKING_REQUEST_SUBJECT_KEYS)[number];

export const TUTOR_BOOKING_REQUEST_DATE_KEYS = [
  'dateTomorrow',
  'dateFriday',
  'dateMonday',
  'datePastSession',
  'dateSaturday',
] as const;
export type TutorBookingRequestDateKey =
  (typeof TUTOR_BOOKING_REQUEST_DATE_KEYS)[number];

export const TUTOR_BOOKING_REQUEST_TIME_KEYS = [
  'slot0400To0530',
  'slot0200To0300',
  'slotCompletedSession',
  'slot1000To1200',
] as const;
export type TutorBookingRequestTimeKey =
  (typeof TUTOR_BOOKING_REQUEST_TIME_KEYS)[number];

export type TutorBookingRequestItem = {
  id: string;
  studentName: string;
  studentAvatarUrl?: string;
  studentLevelKey: TutorBookingRequestLevelKey;
  subjectKey: TutorBookingRequestSubjectKey;
  requestedDateKey: TutorBookingRequestDateKey;
  requestedTimeKey: TutorBookingRequestTimeKey;
  durationLabel: string;
  rateLabel: string;
  rateSubLabel: string;
  status: TutorBookingRequestStatus;
};

export type TutorBookingSummaryMetric = {
  key: TutorBookingSummaryMetricKey;
  value: string;
};

export type TutorBookingRequestsViewData = {
  requests: TutorBookingRequestItem[];
  metrics: TutorBookingSummaryMetric[];
};

export const TUTOR_BOOKING_REQUEST_FILTERS: TutorBookingRequestFilter[] = [
  'all',
  'pending',
  'confirmed',
  'completed',
];

export const BOOKING_REQUEST_FILTERS = TUTOR_BOOKING_REQUEST_FILTERS;

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_SORT = {
  sortBy: 'createdAt' as const,
  sortOrder: 'desc' as const,
};

export const BOOKING_REQUEST_TABLE_COLUMN_WIDTHS = {
  student: 255,
  subject: 178,
  requestedTime: 210,
  rate: 114,
  status: 114,
  actions: 198,
} as const;

export const TUTOR_BOOKING_REQUEST_ACTIONS_BY_STATUS: Record<
  TutorBookingRequestStatus,
  TutorBookingRequestActionConfig[]
> = {
  pending: [
    { variant: 'icon', kind: 'approve', iconSize: 18 },
    { variant: 'icon', kind: 'decline', iconSize: 17 },
    { variant: 'icon', kind: 'message', iconSize: 17 },
  ],
  confirmed: [
    {
      variant: 'label',
      kind: 'message',
      textKey: 'message',
      iconSize: 16,
      pressOpacity: 0.82,
    },
  ],
  completed: [
    {
      variant: 'label',
      kind: 'feedback',
      textKey: 'feedback',
      iconSize: 16,
      pressOpacity: 0.84,
    },
  ],
};

export const BOOKING_REQUEST_ACTIONS_BY_STATUS =
  TUTOR_BOOKING_REQUEST_ACTIONS_BY_STATUS;
