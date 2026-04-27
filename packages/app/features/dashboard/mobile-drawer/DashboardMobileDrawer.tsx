import { YStack, XStack, Text } from '@mezon-tutors/app/ui';
import { LogoIcon } from '@mezon-tutors/app/ui/icons';
import { type DashboardMenuItem } from '@mezon-tutors/shared/src/constants/dashboard';
import { HEADER_CONFIG } from '@mezon-tutors/shared/src/constants/header';
import { DashboardMenuList } from '../shared/DashboardMenuList';

type DashboardMobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  items: DashboardMenuItem[];
  pathname: string;
  activeIconColor: string;
  inactiveIconColor: string;
  logoutIconColor: string;
  onLogout: () => void;
  t: (key: string) => string;
};

export function DashboardMobileDrawer({
  isOpen,
  onClose,
  items,
  pathname,
  activeIconColor,
  inactiveIconColor,
  logoutIconColor,
  onLogout,
  t,
}: DashboardMobileDrawerProps) {
  if (!isOpen) return null;

  const handleItemPress = (item: DashboardMenuItem) => {
    if (item.type === 'action') {
      onLogout();
    } else {
      onClose();
    }
  };

  return (
    <>
      <YStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundColor={`rgba(0, 0, 0, ${HEADER_CONFIG.backdrop.overlayOpacity})`}
        zIndex={998}
        onPress={onClose}
        style={{ position: 'fixed' as never, cursor: 'pointer' }}
      />
      <YStack
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        width={HEADER_CONFIG.drawer.width}
        backgroundColor="$dashboardTutorSidebarBackground"
        borderRightWidth={1}
        borderRightColor="$dashboardTutorSidebarBorder"
        zIndex={999}
        style={{ position: 'fixed' as never }}
      >
        <XStack
          alignItems="center"
          gap={10}
          padding={HEADER_CONFIG.drawer.padding}
          paddingVertical={HEADER_CONFIG.drawer.padding}
          borderBottomWidth={1}
          borderBottomColor="$dashboardTutorSidebarBorder"
        >
          <LogoIcon size={HEADER_CONFIG.drawer.logoSize} />
          <Text
            color="$myLessonsBrandText"
            fontSize={HEADER_CONFIG.drawer.logoFontSize}
            fontWeight="700"
          >
            TutorMatch
          </Text>
        </XStack>

        <YStack
          flex={1}
          padding={HEADER_CONFIG.drawer.padding}
          gap={HEADER_CONFIG.drawer.itemGap}
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
              defaultIconSize: HEADER_CONFIG.drawer.iconSize.default,
              bookingRequestsIconSize: HEADER_CONFIG.drawer.iconSize.bookingRequests,
              itemPaddingVertical: HEADER_CONFIG.drawer.itemPadding.vertical,
              itemPaddingHorizontal: HEADER_CONFIG.drawer.itemPadding.horizontal,
              itemBorderRadius: HEADER_CONFIG.drawer.itemBorderRadius,
            }}
          />
        </YStack>
      </YStack>
    </>
  );
}
