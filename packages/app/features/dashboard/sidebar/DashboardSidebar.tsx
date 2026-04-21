import { YStack } from '@mezon-tutors/app/ui';
import {
  type DashboardMenuItem,
  DASHBOARD_SIDEBAR_CONFIG,
} from '@mezon-tutors/shared/src/constants/dashboard';
import { DashboardMenuList } from '../shared/DashboardMenuList';

type DashboardSidebarProps = {
  items: DashboardMenuItem[];
  pathname: string;
  activeIconColor: string;
  inactiveIconColor: string;
  logoutIconColor: string;
  onLogout: () => void;
  t: (key: string) => string;
};

export function DashboardSidebar({
  items,
  pathname,
  activeIconColor,
  inactiveIconColor,
  logoutIconColor,
  onLogout,
  t,
}: DashboardSidebarProps) {
  const handleItemPress = (item: DashboardMenuItem) => {
    if (item.type === 'action') {
      onLogout();
    }
  };

  return (
    <YStack
      width={DASHBOARD_SIDEBAR_CONFIG.width}
      minWidth={DASHBOARD_SIDEBAR_CONFIG.width}
      backgroundColor="$dashboardTutorSidebarBackground"
      borderRightWidth={1}
      borderRightColor="$dashboardTutorSidebarBorder"
      padding={DASHBOARD_SIDEBAR_CONFIG.padding.container}
      gap="$3"
      minHeight="100vh"
      $xs={{ display: 'none' }}
      $sm={{ display: 'none' }}
    >
      <DashboardMenuList
        items={items}
        pathname={pathname}
        activeIconColor={activeIconColor}
        inactiveIconColor={inactiveIconColor}
        logoutIconColor={logoutIconColor}
        t={t}
        onItemPress={handleItemPress}
        config={{
          defaultIconSize: DASHBOARD_SIDEBAR_CONFIG.iconSizes.default,
          bookingRequestsIconSize: DASHBOARD_SIDEBAR_CONFIG.iconSizes.bookingRequests,
          itemPaddingVertical: DASHBOARD_SIDEBAR_CONFIG.padding.item.vertical,
          itemPaddingHorizontal: DASHBOARD_SIDEBAR_CONFIG.padding.item.horizontal,
          itemBorderRadius: DASHBOARD_SIDEBAR_CONFIG.borderRadius,
        }}
      />
    </YStack>
  );
}
