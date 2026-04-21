import {
  BookingRequestIcon,
  CalendarIcon,
  DocumentIcon,
  LogoutIcon,
} from '@mezon-tutors/app/ui/icons';
import type { ComponentType } from 'react';
import type {
  DashboardMenuIconKey,
  DashboardMenuItem,
} from '@mezon-tutors/shared/src/constants/dashboard';

type IconComponent = ComponentType<{ size?: number; color?: string }>;

type MenuDisplayOptions = {
  pathname: string;
  activeIconColor: string;
  inactiveIconColor: string;
  logoutIconColor: string;
};

export const DASHBOARD_ICON_COMPONENTS: Record<DashboardMenuIconKey, IconComponent> = {
  document: DocumentIcon,
  bookingRequests: BookingRequestIcon,
  calendar: CalendarIcon,
  logout: LogoutIcon,
};

export function getDashboardMenuItemDisplay(item: DashboardMenuItem, options: MenuDisplayOptions) {
  const active = item.type === 'link' && !!item.href && options.pathname === item.href;
  const isLogoutItem = item.type === 'action';

  return {
    active,
    Icon: DASHBOARD_ICON_COMPONENTS[item.iconKey],
    iconColor: isLogoutItem
      ? options.logoutIconColor
      : active
        ? options.activeIconColor
        : options.inactiveIconColor,
    labelColor: isLogoutItem
      ? '$myLessonsSidebarLogoutText'
      : active
        ? '$dashboardTutorFilterActiveBg'
        : '$dashboardTutorTextSecondary',
  };
}
