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

export const LOCALE_LABEL_KEYS: Record<string, string> = {
  en: 'english',
  vi: 'vietnamese',
} as const;

export const SELECT_STYLES = {
  base: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    border: '1.5px solid rgba(59, 130, 246, 0.2)',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    color: 'var(--color-myLessonsHeaderTitle)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  focus: {
    borderColor: 'rgba(59, 130, 246, 0.5)',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  blur: {
    borderColor: 'rgba(59, 130, 246, 0.2)',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
} as const;

export const HEADER_CONFIG = {
  height: {
    desktop: 80,
    tablet: 60,
    mobile: 56,
  },
  padding: {
    desktop: 60,
    tablet: 14,
    mobile: 12,
  },
  logo: {
    size: 24,
    fontSize: 18,
    lineHeight: 24,
    mobileDashboardFontSize: 18,
    borderRadius: 999,
    padding: {
      vertical: 6,
      horizontal: 10,
    },
    mobilePadding: {
      vertical: 6,
      horizontal: 6,
    },
  },
  avatar: {
    size: {
      desktop: 36,
      tablet: 32,
      mobile: 28,
    },
    borderWidth: 2,
    padding: {
      desktop: 4,
      tablet: 3,
      mobile: 2,
    },
  },
  nav: {
    gap: {
      desktop: 30,
      tablet: 10,
      mobile: 8,
    },
    fontSize: {
      desktop: 14,
      tablet: 13,
      mobile: 12,
    },
  },
  menu: {
    iconSize: 24,
    buttonPadding: 2,
    buttonBorderRadius: 8,
    dashboardGap: 4,
  },
  drawer: {
    width: 240,
    logoSize: 32,
    logoFontSize: 20,
    padding: 16,
    itemGap: 12,
    itemBorderRadius: 12,
    itemPadding: {
      vertical: 8,
      horizontal: 12,
    },
    iconSize: {
      default: 16,
      bookingRequests: 19,
    },
  },
  transition: {
    duration: '420ms',
    easing: 'cubic-bezier(0.22,1,0.36,1)',
    borderDuration: '320ms',
  },
  backdrop: {
    blur: 'blur(14px) saturate(140%)',
    overlayOpacity: 0.5,
  },
} as const;
