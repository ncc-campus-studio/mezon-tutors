import { ROUTES } from './routes';

export type DashboardMenuIconKey =
  | 'document'
  | 'bookingRequests'
  | 'calendar'
  | 'logout';
export type DashboardMenuLabelKey =
  | 'myLessons'
  | 'bookingRequests'
  | 'mySchedule'
  | 'logout';

export type DashboardRole = 'STUDENT' | 'TUTOR';

export type DashboardMenuItem = {
  key: string;
  type: 'link' | 'action';
  labelKey: DashboardMenuLabelKey;
  iconKey: DashboardMenuIconKey;
  href?: string;
  roles: DashboardRole[];
};

export const DASHBOARD_MENU_ITEMS: DashboardMenuItem[] = [
  {
    key: 'my-lessons',
    type: 'link',
    labelKey: 'myLessons',
    iconKey: 'document',
    href: ROUTES.DASHBOARD.MY_LESSONS,
    roles: ['STUDENT'],
  },
  {
    key: 'booking-requests',
    type: 'link',
    labelKey: 'bookingRequests',
    iconKey: 'bookingRequests',
    href: ROUTES.DASHBOARD.BOOKING_REQUESTS,
    roles: ['TUTOR'],
  },
  {
    key: 'my-schedule',
    type: 'link',
    labelKey: 'mySchedule',
    iconKey: 'calendar',
    href: ROUTES.DASHBOARD.MY_SCHEDULE,
    roles: ['TUTOR'],
  },
  {
    key: 'logout',
    type: 'action',
    labelKey: 'logout',
    iconKey: 'logout',
    roles: ['STUDENT', 'TUTOR'],
  },
];
