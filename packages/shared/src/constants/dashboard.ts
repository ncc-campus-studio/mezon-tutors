import { ROUTES } from './routes';

export type DashboardMenuIconKey = 'calendar' | 'logout';
export type DashboardMenuLabelKey = 'myLessons' | 'logout';

export type DashboardMenuItem = {
  key: string;
  type: 'link' | 'action';
  labelKey: DashboardMenuLabelKey;
  iconKey: DashboardMenuIconKey;
  href?: string;
};

export const DASHBOARD_MENU_ITEMS: DashboardMenuItem[] = [
  {
    key: 'my-lessons',
    type: 'link',
    labelKey: 'myLessons',
    iconKey: 'calendar',
    href: ROUTES.DASHBOARD.MY_LESSONS,
  },
  {
    key: 'logout',
    type: 'action',
    labelKey: 'logout',
    iconKey: 'logout',
  },
];
