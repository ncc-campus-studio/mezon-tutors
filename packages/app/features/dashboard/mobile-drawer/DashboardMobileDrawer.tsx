import { YStack, XStack, Text, Separator, Button } from '@mezon-tutors/app/ui';
import { LogoIcon, LogoutIcon, WorldIcon, CurrencyIcon, MoonIcon, SunIcon, ChevronDownIcon, ChevronUpIcon, SettingsIcon } from '@mezon-tutors/app/ui/icons';
import { type DashboardMenuItem } from '@mezon-tutors/shared/src/constants/dashboard';
import { HEADER_CONFIG, SELECT_STYLES } from '@mezon-tutors/shared/src/constants/header';
import { ECurrency } from '@mezon-tutors/shared';
import { DashboardMenuList } from '../shared/DashboardMenuList';
import { useTheme } from 'tamagui';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

type SettingsSectionProps = {
  currency: string;
  locale: string;
  isDarkMode: boolean;
  isAuthenticated: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onCurrencyChange: (currency: string) => void;
  onLocaleChange: (locale: string) => void;
  onThemeToggle: () => void;
  onLogout: () => void;
  logoutIconColor: string;
  t: (key: string) => string;
};

function DrawerSettingsSection({
  currency,
  locale,
  isDarkMode,
  isAuthenticated,
  isExpanded,
  onToggleExpand,
  onCurrencyChange,
  onLocaleChange,
  onThemeToggle,
  onLogout,
  logoutIconColor,
  t: tDashboard,
}: SettingsSectionProps) {
  const t = useTranslations('Home.CurrencyToggle');
  const theme = useTheme();
  const iconColor = theme.appPrimary?.get() ?? '#3B82F6';

  const handleCurrencySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCurrencyChange(e.target.value);
  };

  const handleLocaleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLocaleChange(e.target.value);
  };

  const handleSelectFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    e.target.style.borderColor = SELECT_STYLES.focus.borderColor;
    e.target.style.backgroundColor = SELECT_STYLES.focus.backgroundColor;
  };

  const handleSelectBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    e.target.style.borderColor = SELECT_STYLES.blur.borderColor;
    e.target.style.backgroundColor = SELECT_STYLES.blur.backgroundColor;
  };

  return (
    <YStack gap={0}>
      <Button
        chromeless
        onPress={onToggleExpand}
        borderWidth={1}
        borderColor="rgba(0, 0, 0, 0.06)"
        backgroundColor="rgba(0, 0, 0, 0.02)"
        paddingVertical={12}
        paddingHorizontal={14}
        borderRadius={10}
        justifyContent="space-between"
        flexDirection="row"
        alignItems="center"
        width="100%"
        hoverStyle={{
          backgroundColor: '$dashboardTutorSidebarItemHover',
          borderColor: '$dashboardTutorSidebarItemActiveBorder',
        }}
        style={{
          transition: 'all 0.2s ease',
        }}
      >
        <XStack alignItems="center" gap={10}>
          <SettingsIcon size={18} color={iconColor} />
          <Text fontSize={15} fontWeight="500" color="$myLessonsHeaderTitle">
            {t('settings')}
          </Text>
        </XStack>
        {isExpanded ? (
          <ChevronUpIcon size={18} color={iconColor} />
        ) : (
          <ChevronDownIcon size={18} color={iconColor} />
        )}
      </Button>

      {isExpanded && (
        <YStack gap={16} paddingTop={12} paddingHorizontal={14}>
          <YStack gap={8}>
            <XStack alignItems="center" gap={8}>
              <WorldIcon size={16} color={iconColor} />
              <Text fontSize={13} fontWeight="600" color="$myLessonsHeaderTitle" opacity={0.7}>
                {t('language')}
              </Text>
            </XStack>
            <select
              value={locale}
              onChange={handleLocaleSelect}
              onFocus={handleSelectFocus}
              onBlur={handleSelectBlur}
              className="currency-select"
              style={SELECT_STYLES.base}
            >
              <option value="en">{t('english')}</option>
              <option value="vi">{t('vietnamese')}</option>
            </select>
          </YStack>

          <YStack gap={8}>
            <XStack alignItems="center" gap={8}>
              <CurrencyIcon size={16} color={iconColor} />
              <Text fontSize={13} fontWeight="600" color="$myLessonsHeaderTitle" opacity={0.7}>
                {t('currency')}
              </Text>
            </XStack>
            <select
              value={currency}
              onChange={handleCurrencySelect}
              onFocus={handleSelectFocus}
              onBlur={handleSelectBlur}
              className="currency-select"
              style={SELECT_STYLES.base}
            >
              {Object.values(ECurrency).map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </YStack>

          <YStack gap={8}>
            <XStack alignItems="center" gap={8}>
              {isDarkMode ? (
                <MoonIcon size={16} color={iconColor} />
              ) : (
                <SunIcon size={16} color={iconColor} />
              )}
              <Text fontSize={13} fontWeight="600" color="$myLessonsHeaderTitle" opacity={0.7}>
                {t('theme')}
              </Text>
            </XStack>
            <Button
              onPress={onThemeToggle}
              borderWidth={1.5}
              borderColor="rgba(59, 130, 246, 0.2)"
              backgroundColor="rgba(59, 130, 246, 0.05)"
              paddingVertical={10}
              paddingHorizontal={12}
              borderRadius={8}
              width="100%"
              hoverStyle={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
              }}
              pressStyle={{
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                scale: 0.98,
              }}
              style={{
                transition: 'all 0.2s ease',
              }}
            >
              <XStack alignItems="center" gap={10} width="100%" justifyContent="flex-start">
                <Text fontSize={14} fontWeight="500" color="$myLessonsHeaderTitle">
                  {isDarkMode ? t('darkMode') : t('lightMode')}
                </Text>
              </XStack>
            </Button>
          </YStack>
        </YStack>
      )}

      {isAuthenticated && (
        <YStack marginTop={16}>
          <Button
            chromeless
            onPress={onLogout}
            paddingVertical={12}
            paddingHorizontal={14}
            borderRadius={10}
            justifyContent="flex-start"
            borderWidth={1}
            borderColor="rgba(239, 68, 68, 0.15)"
            backgroundColor="rgba(239, 68, 68, 0.04)"
            hoverStyle={{
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              borderColor: 'rgba(239, 68, 68, 0.25)',
            }}
            pressStyle={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              scale: 0.98,
            }}
            style={{
              transition: 'all 0.2s ease',
            }}
          >
            <XStack alignItems="center" gap={12}>
              <LogoutIcon size={18} color={logoutIconColor} />
              <Text fontSize={15} fontWeight="600" color={logoutIconColor}>
                {tDashboard('sidebar.logout')}
              </Text>
            </XStack>
          </Button>
        </YStack>
      )}
    </YStack>
  );
}

type DashboardMobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  items: DashboardMenuItem[];
  pathname: string;
  activeIconColor: string;
  inactiveIconColor: string;
  logoutIconColor: string;
  onLogout: () => void;
  onNavigateHome: () => void;
  t: (key: string) => string;
  currency: string;
  locale: string;
  isDarkMode: boolean;
  isAuthenticated: boolean;
  onCurrencyChange: (currency: string) => void;
  onLocaleChange: (locale: string) => void;
  onThemeToggle: () => void;
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
  onNavigateHome,
  t,
  currency,
  locale,
  isDarkMode,
  isAuthenticated,
  onCurrencyChange,
  onLocaleChange,
  onThemeToggle,
}: DashboardMobileDrawerProps) {
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const menuItems = items.filter((item) => item.type !== 'action');
  const hasMenuItems = isAuthenticated && menuItems.length > 0;

  const handleItemPress = () => {
    onClose();
  };

  const handleToggleSettings = () => {
    setIsSettingsExpanded(!isSettingsExpanded);
  };

  const handleLogoClick = () => {
    onClose();
    onNavigateHome();
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
        overflow="scroll"
        className="hide-scrollbar"
        style={{ position: 'fixed' as never }}
      >
        <Button
          chromeless
          onPress={handleLogoClick}
          padding={0}
          borderRadius={0}
          width="100%"
        >
          <XStack
            alignItems="center"
            gap={10}
            padding={HEADER_CONFIG.drawer.padding}
            paddingVertical={HEADER_CONFIG.drawer.padding}
            borderBottomWidth={1}
            borderBottomColor="$dashboardTutorSidebarBorder"
            width="100%"
            hoverStyle={{
              backgroundColor: '$dashboardTutorSidebarItemHover',
            }}
            style={{
              transition: 'background-color 0.2s ease',
            }}
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
        </Button>

        <YStack flex={1}>
          {hasMenuItems && (
            <YStack padding={HEADER_CONFIG.drawer.padding} gap={HEADER_CONFIG.drawer.itemGap}>
              <DashboardMenuList
                items={menuItems}
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
          )}

          {hasMenuItems && (
            <Separator marginHorizontal={HEADER_CONFIG.drawer.padding} marginVertical={8} />
          )}

          <YStack
            padding={HEADER_CONFIG.drawer.padding}
            paddingTop={hasMenuItems ? 8 : HEADER_CONFIG.drawer.padding}
          >
            <DrawerSettingsSection
              currency={currency}
              locale={locale}
              isDarkMode={isDarkMode}
              isAuthenticated={isAuthenticated}
              isExpanded={isSettingsExpanded}
              onToggleExpand={handleToggleSettings}
              onCurrencyChange={onCurrencyChange}
              onLocaleChange={onLocaleChange}
              onThemeToggle={onThemeToggle}
              onLogout={onLogout}
              logoutIconColor={logoutIconColor}
              t={t}
            />
          </YStack>
        </YStack>
      </YStack>
    </>
  );
}
