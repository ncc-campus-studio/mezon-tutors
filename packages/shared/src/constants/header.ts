import { ROUTES } from './routes';

export const HEADER_NAV = [
  { labelKey: 'findTutors', href: ROUTES.TUTOR.INDEX },
  { labelKey: 'myLessons', href: ROUTES.MY_LESSONS.INDEX },
  { labelKey: 'becomeTutor', href: ROUTES.BECOME_TUTOR.INDEX },
] as const;

export const HEADER_LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'vi', label: 'VI' },
] as const;
