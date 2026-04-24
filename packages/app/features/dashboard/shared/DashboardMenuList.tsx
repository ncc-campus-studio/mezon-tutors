import Link from 'next/link';
import { Button, Text, YStack } from '@mezon-tutors/app/ui';
import {
  BookingRequestIcon,
  CalendarIcon,
  DocumentIcon,
  LogoutIcon,
} from '@mezon-tutors/app/ui/icons';
import type { DashboardMenuItem, DashboardMenuIconKey } from '@mezon-tutors/shared/src/constants/dashboard';
import { getDashboardMenuItemDisplay } from '@mezon-tutors/shared/src/constants/dashboard';
import type { ComponentType } from 'react';

type IconComponent = ComponentType<{ size?: number; color?: string }>;

const DASHBOARD_ICON_COMPONENTS: Record<DashboardMenuIconKey, IconComponent> = {
  document: DocumentIcon,
  bookingRequests: BookingRequestIcon,
  calendar: CalendarIcon,
  logout: LogoutIcon,
};

type DashboardMenuListConfig = {
  defaultIconSize: number;
  bookingRequestsIconSize: number;
  itemPaddingVertical: number;
  itemPaddingHorizontal: number;
  itemBorderRadius: number;
};

type DashboardMenuListProps = {
  items: DashboardMenuItem[];
  pathname: string;
  activeIconColor: string;
  inactiveIconColor: string;
  logoutIconColor: string;
  t: (key: string) => string;
  onItemPress?: (item: DashboardMenuItem) => void;
  config: DashboardMenuListConfig;
};

export function DashboardMenuList({
  items,
  pathname,
  activeIconColor,
  inactiveIconColor,
  logoutIconColor,
  t,
  onItemPress,
  config,
}: DashboardMenuListProps) {
  return (
    <>
      {items.map((item) => {
        const { active, iconKey, iconColor, labelColor } = getDashboardMenuItemDisplay(item, {
          pathname,
          activeIconColor,
          inactiveIconColor,
          logoutIconColor,
        });
        const Icon = DASHBOARD_ICON_COMPONENTS[iconKey];
        const iconSize =
          item.iconKey === 'bookingRequests'
            ? config.bookingRequestsIconSize
            : config.defaultIconSize;

        const content = (
          <Button
            onPress={() => onItemPress?.(item)}
            borderWidth={1}
            borderColor={active ? '$dashboardTutorSidebarItemActiveBorder' : 'rgba(59, 130, 246, 0.15)'}
            backgroundColor={active ? '$dashboardTutorSidebarItemActiveBg' : 'rgba(59, 130, 246, 0.04)'}
            color={labelColor}
            paddingVertical={config.itemPaddingVertical}
            paddingHorizontal={config.itemPaddingHorizontal}
            borderRadius={config.itemBorderRadius}
            flexDirection="row"
            alignItems="center"
            gap="$2"
            justifyContent="flex-start"
            width="100%"
            hoverStyle={{
              backgroundColor: '$dashboardTutorSidebarItemHover',
              borderColor: '$dashboardTutorSidebarItemActiveBorder',
            }}
            style={{
              transition: 'all 0.2s ease',
            }}
          >
            <Icon
              size={iconSize}
              color={iconColor}
            />
            <Text
              color={labelColor}
              fontWeight={active ? '700' : '500'}
              fontSize={15}
            >
              {t(`sidebar.${item.labelKey}`)}
            </Text>
          </Button>
        );

        if (item.type === 'link' && item.href) {
          return (
            <Link
              key={item.key}
              href={item.href}
              style={{ textDecoration: 'none', width: '100%' }}
            >
              {content}
            </Link>
          );
        }

        return (
          <YStack
            key={item.key}
            width="100%"
          >
            {content}
          </YStack>
        );
      })}
    </>
  );
}
