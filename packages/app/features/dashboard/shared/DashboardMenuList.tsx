import Link from 'next/link';
import { Button, Text, YStack } from '@mezon-tutors/app/ui';
import type { DashboardMenuItem } from '@mezon-tutors/shared/src/constants/dashboard';
import { getDashboardMenuItemDisplay } from '../utils/menu-item';

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
        const { active, Icon, iconColor, labelColor } = getDashboardMenuItemDisplay(item, {
          pathname,
          activeIconColor,
          inactiveIconColor,
          logoutIconColor,
        });
        const iconSize =
          item.iconKey === 'bookingRequests'
            ? config.bookingRequestsIconSize
            : config.defaultIconSize;

        const content = (
          <Button
            onPress={() => onItemPress?.(item)}
            borderWidth={active ? 1 : 0}
            borderColor="$dashboardTutorSidebarItemActiveBorder"
            backgroundColor={active ? '$dashboardTutorSidebarItemActiveBg' : 'transparent'}
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
          >
            <Icon
              size={iconSize}
              color={iconColor}
            />
            <Text
              color={labelColor}
              fontWeight={active ? '700' : '500'}
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

      <YStack
        marginTop="auto"
        width="100%"
      />
    </>
  );
}
