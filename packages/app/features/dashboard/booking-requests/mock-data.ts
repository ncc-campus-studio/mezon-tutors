import type {
  BookingRequestStatus,
  BookingRequestMockItem,
  BookingRequestsQuery,
  BookingRequestsViewData,
} from './types';

const MOCK_REQUESTS: BookingRequestMockItem[] = [
  {
    id: 'req-001',
    studentName: 'Sarah Jenkins',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=5',
    studentLevelKey: 'undergraduateStudent',
    subjectKey: 'advancedCalculus',
    requestedDateKey: 'dateTomorrow',
    requestedTimeKey: 'slot0400To0530',
    durationLabel: '(1.5h)',
    rateLabel: '$75.00',
    rateSubLabel: '$50.00/hr',
    status: 'pending',
    createdAt: '2024-10-23T08:00:00Z',
    requestedDate: '2024-10-24T00:00:00Z',
  },
  {
    id: 'req-002',
    studentName: 'Marcus Thorne',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=12',
    studentLevelKey: 'highSchoolJunior',
    subjectKey: 'apPhysics1',
    requestedDateKey: 'dateFriday',
    requestedTimeKey: 'slot0200To0300',
    durationLabel: '(1h)',
    rateLabel: '$50.00',
    rateSubLabel: '$50.00/hr',
    status: 'confirmed',
    createdAt: '2024-10-22T10:00:00Z',
    requestedDate: '2024-10-25T00:00:00Z',
  },
  {
    id: 'req-003',
    studentName: 'David Kim',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=33',
    studentLevelKey: 'postGradPreparation',
    subjectKey: 'dataScience',
    requestedDateKey: 'dateMonday',
    requestedTimeKey: 'slot1000To1200',
    durationLabel: '(2h)',
    rateLabel: '$100.00',
    rateSubLabel: '$50.00/hr',
    status: 'completed',
    createdAt: '2024-10-20T08:00:00Z',
    requestedDate: '2024-10-28T00:00:00Z',
  },
  {
    id: 'req-004',
    studentName: 'Leila Vance',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=9',
    studentLevelKey: 'undergraduateStudent',
    subjectKey: 'biochemistry2',
    requestedDateKey: 'dateSaturday',
    requestedTimeKey: 'slot1000To1200',
    durationLabel: '(2h)',
    rateLabel: '$100.00',
    rateSubLabel: '$50.00/hr',
    status: 'pending',
    createdAt: '2024-10-23T07:00:00Z',
    requestedDate: '2024-10-26T00:00:00Z',
  },
  {
    id: 'req-005',
    studentName: 'Noah Brooks',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=14',
    studentLevelKey: 'highSchoolJunior',
    subjectKey: 'advancedCalculus',
    requestedDateKey: 'dateTomorrow',
    requestedTimeKey: 'slot0200To0300',
    durationLabel: '(1h)',
    rateLabel: '$60.00',
    rateSubLabel: '$60.00/hr',
    status: 'pending',
    createdAt: '2024-10-23T09:10:00Z',
    requestedDate: '2024-10-24T00:00:00Z',
  },
  {
    id: 'req-006',
    studentName: 'Emma Carter',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=25',
    studentLevelKey: 'undergraduateStudent',
    subjectKey: 'dataScience',
    requestedDateKey: 'dateFriday',
    requestedTimeKey: 'slot1000To1200',
    durationLabel: '(2h)',
    rateLabel: '$120.00',
    rateSubLabel: '$60.00/hr',
    status: 'confirmed',
    createdAt: '2024-10-22T14:00:00Z',
    requestedDate: '2024-10-25T00:00:00Z',
  },
  {
    id: 'req-007',
    studentName: 'Aiden Lee',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=32',
    studentLevelKey: 'postGradPreparation',
    subjectKey: 'biochemistry2',
    requestedDateKey: 'dateMonday',
    requestedTimeKey: 'slot1000To1200',
    durationLabel: '(2h)',
    rateLabel: '$110.00',
    rateSubLabel: '$55.00/hr',
    status: 'completed',
    createdAt: '2024-10-21T08:30:00Z',
    requestedDate: '2024-10-28T00:00:00Z',
  },
  {
    id: 'req-008',
    studentName: 'Sophia Nguyen',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=41',
    studentLevelKey: 'undergraduateStudent',
    subjectKey: 'apPhysics1',
    requestedDateKey: 'dateSaturday',
    requestedTimeKey: 'slot0400To0530',
    durationLabel: '(1.5h)',
    rateLabel: '$82.50',
    rateSubLabel: '$55.00/hr',
    status: 'pending',
    createdAt: '2024-10-23T05:40:00Z',
    requestedDate: '2024-10-26T00:00:00Z',
  },
  {
    id: 'req-009',
    studentName: 'Lucas Patel',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=52',
    studentLevelKey: 'highSchoolJunior',
    subjectKey: 'dataScience',
    requestedDateKey: 'dateTomorrow',
    requestedTimeKey: 'slot0400To0530',
    durationLabel: '(1.5h)',
    rateLabel: '$78.00',
    rateSubLabel: '$52.00/hr',
    status: 'confirmed',
    createdAt: '2024-10-22T16:20:00Z',
    requestedDate: '2024-10-24T00:00:00Z',
  },
  {
    id: 'req-010',
    studentName: 'Mia Thompson',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=61',
    studentLevelKey: 'postGradPreparation',
    subjectKey: 'advancedCalculus',
    requestedDateKey: 'dateFriday',
    requestedTimeKey: 'slot0200To0300',
    durationLabel: '(1h)',
    rateLabel: '$65.00',
    rateSubLabel: '$65.00/hr',
    status: 'completed',
    createdAt: '2024-10-20T13:45:00Z',
    requestedDate: '2024-10-25T00:00:00Z',
  },
  {
    id: 'req-011',
    studentName: 'Ethan Walker',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=67',
    studentLevelKey: 'undergraduateStudent',
    subjectKey: 'biochemistry2',
    requestedDateKey: 'dateMonday',
    requestedTimeKey: 'slot1000To1200',
    durationLabel: '(2h)',
    rateLabel: '$98.00',
    rateSubLabel: '$49.00/hr',
    status: 'pending',
    createdAt: '2024-10-23T10:05:00Z',
    requestedDate: '2024-10-28T00:00:00Z',
  },
  {
    id: 'req-012',
    studentName: 'Ava Miller',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=73',
    studentLevelKey: 'highSchoolJunior',
    subjectKey: 'apPhysics1',
    requestedDateKey: 'dateSaturday',
    requestedTimeKey: 'slot0200To0300',
    durationLabel: '(1h)',
    rateLabel: '$54.00',
    rateSubLabel: '$54.00/hr',
    status: 'confirmed',
    createdAt: '2024-10-22T07:25:00Z',
    requestedDate: '2024-10-26T00:00:00Z',
  },
  {
    id: 'req-013',
    studentName: 'Benjamin Scott',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=19',
    studentLevelKey: 'postGradPreparation',
    subjectKey: 'dataScience',
    requestedDateKey: 'datePastSession',
    requestedTimeKey: 'slotCompletedSession',
    durationLabel: '',
    rateLabel: '$95.00',
    rateSubLabel: '$47.50/hr',
    status: 'completed',
    createdAt: '2024-10-19T11:00:00Z',
    requestedDate: '2024-10-21T00:00:00Z',
  },
  {
    id: 'req-014',
    studentName: 'Charlotte Green',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=8',
    studentLevelKey: 'undergraduateStudent',
    subjectKey: 'advancedCalculus',
    requestedDateKey: 'dateTomorrow',
    requestedTimeKey: 'slot1000To1200',
    durationLabel: '(2h)',
    rateLabel: '$112.00',
    rateSubLabel: '$56.00/hr',
    status: 'pending',
    createdAt: '2024-10-23T06:55:00Z',
    requestedDate: '2024-10-24T00:00:00Z',
  },
  {
    id: 'req-015',
    studentName: 'Henry Adams',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=11',
    studentLevelKey: 'highSchoolJunior',
    subjectKey: 'biochemistry2',
    requestedDateKey: 'dateFriday',
    requestedTimeKey: 'slot0400To0530',
    durationLabel: '(1.5h)',
    rateLabel: '$84.00',
    rateSubLabel: '$56.00/hr',
    status: 'confirmed',
    createdAt: '2024-10-22T20:15:00Z',
    requestedDate: '2024-10-25T00:00:00Z',
  },
  {
    id: 'req-016',
    studentName: 'Amelia White',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=21',
    studentLevelKey: 'postGradPreparation',
    subjectKey: 'apPhysics1',
    requestedDateKey: 'dateMonday',
    requestedTimeKey: 'slot0200To0300',
    durationLabel: '(1h)',
    rateLabel: '$58.00',
    rateSubLabel: '$58.00/hr',
    status: 'completed',
    createdAt: '2024-10-18T15:30:00Z',
    requestedDate: '2024-10-28T00:00:00Z',
  },
  {
    id: 'req-017',
    studentName: 'James Hall',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=27',
    studentLevelKey: 'undergraduateStudent',
    subjectKey: 'dataScience',
    requestedDateKey: 'dateSaturday',
    requestedTimeKey: 'slot0400To0530',
    durationLabel: '(1.5h)',
    rateLabel: '$90.00',
    rateSubLabel: '$60.00/hr',
    status: 'pending',
    createdAt: '2024-10-23T11:45:00Z',
    requestedDate: '2024-10-26T00:00:00Z',
  },
  {
    id: 'req-018',
    studentName: 'Isabella Young',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=36',
    studentLevelKey: 'highSchoolJunior',
    subjectKey: 'advancedCalculus',
    requestedDateKey: 'dateTomorrow',
    requestedTimeKey: 'slot0200To0300',
    durationLabel: '(1h)',
    rateLabel: '$62.00',
    rateSubLabel: '$62.00/hr',
    status: 'confirmed',
    createdAt: '2024-10-22T12:12:00Z',
    requestedDate: '2024-10-24T00:00:00Z',
  },
  {
    id: 'req-019',
    studentName: 'Daniel King',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=44',
    studentLevelKey: 'postGradPreparation',
    subjectKey: 'biochemistry2',
    requestedDateKey: 'datePastSession',
    requestedTimeKey: 'slotCompletedSession',
    durationLabel: '',
    rateLabel: '$88.00',
    rateSubLabel: '$44.00/hr',
    status: 'completed',
    createdAt: '2024-10-17T09:00:00Z',
    requestedDate: '2024-10-21T00:00:00Z',
  },
  {
    id: 'req-020',
    studentName: 'Harper Rivera',
    studentAvatarUrl: 'https://i.pravatar.cc/160?img=55',
    studentLevelKey: 'undergraduateStudent',
    subjectKey: 'apPhysics1',
    requestedDateKey: 'dateMonday',
    requestedTimeKey: 'slot1000To1200',
    durationLabel: '(2h)',
    rateLabel: '$104.00',
    rateSubLabel: '$52.00/hr',
    status: 'pending',
    createdAt: '2024-10-23T03:20:00Z',
    requestedDate: '2024-10-28T00:00:00Z',
  },
];

function sortRequests(items: BookingRequestMockItem[], query: BookingRequestsQuery): BookingRequestMockItem[] {
  const sortBy = query.sortBy ?? 'createdAt';
  const sortOrder = query.sortOrder ?? 'desc';

  return [...items].sort((a, b) => {
    const aValue = new Date(sortBy === 'requestedDate' ? a.requestedDate : a.createdAt).getTime();
    const bValue = new Date(sortBy === 'requestedDate' ? b.requestedDate : b.createdAt).getTime();
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });
}

function mixRequestsByStatus(items: BookingRequestMockItem[]): BookingRequestMockItem[] {
  const statuses: BookingRequestStatus[] = ['pending', 'confirmed', 'completed'];
  const buckets: Record<BookingRequestStatus, BookingRequestMockItem[]> = {
    pending: [],
    confirmed: [],
    completed: [],
  };

  items.forEach((item) => {
    buckets[item.status].push(item);
  });

  const mixed: BookingRequestMockItem[] = [];
  let hasNext = true;

  while (hasNext) {
    hasNext = false;
    statuses.forEach((status) => {
      const next = buckets[status].shift();
      if (next) {
        mixed.push(next);
        hasNext = true;
      }
    });
  }

  return mixed;
}

export async function getMockBookingRequests(query: BookingRequestsQuery): Promise<BookingRequestsViewData> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const filtered = query.status
    ? MOCK_REQUESTS.filter((req) => req.status === query.status)
    : MOCK_REQUESTS;
  const sorted = sortRequests(filtered, query);
  const prepared = query.status ? sorted : mixRequestsByStatus(sorted);
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.max(1, query.pageSize ?? 5);
  const total = prepared.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const paged = prepared.slice(start, start + pageSize);

  return {
    requests: paged.map(({ createdAt, requestedDate, ...request }) => request),
    metrics: [
      { key: 'conversionRate', value: '92%' },
      { key: 'responseTime', value: '1.2h' },
      { key: 'nextPayout', value: '$1,420.00' },
    ],
    total,
    page,
    pageSize,
    totalPages,
  };
}
