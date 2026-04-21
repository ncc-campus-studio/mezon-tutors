'use client';
import Link from 'next/link';
import { useAtomValue, useSetAtom } from 'jotai';
import { isAuthenticatedAtom, userAtom, logoutAtom } from '@mezon-tutors/app/store/auth.atom';
import { LoginButton } from '@mezon-tutors/app/components/auth/LoginButton';
import { HEADER_NAV, ROUTES, HEADER_CONFIG } from '@mezon-tutors/shared';
import { getDashboardMenuItemsByRole } from '@mezon-tutors/shared/src/constants/dashboard';
import { useCallback, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { XStack, Text, Button } from '@mezon-tutors/app/ui';
import { LogoIcon, MenuIcon } from '@mezon-tutors/app/ui/icons';
import { themes } from '@mezon-tutors/app/theme/theme';
import { useThemeName, useMedia } from 'tamagui';
import { HeaderLocaleToggle } from './HeaderLocaleToggle';
import { HeaderThemeToggle } from './HeaderThemeToggle';
import { HeaderNavLink } from './HeaderNavLink';
import { DashboardMobileDrawer } from '@mezon-tutors/app/features/dashboard/mobile-drawer/DashboardMobileDrawer';

export default function Header() {
  const locale = useLocale();
  const t = useTranslations('Common.Header');
  const tDashboard = useTranslations('Dashboard');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const themeName = useThemeName();
  const media = useMedia();
  const isMobile = media.sm || media.xs;
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const user = useAtomValue(userAtom);
  const logout = useSetAtom(logoutAtom);
  const themeMode: 'light' | 'dark' = themeName === 'dark' ? 'dark' : 'light';
  const headerTheme = themeMode === 'dark' ? themes.dark : themes.light;
  const dashboardTheme = themeName === 'dark' ? themes.dark : themes.light;

  const isDashboard = pathname.startsWith('/dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const visibleMenuItems = useMemo(() => getDashboardMenuItemsByRole(user?.role), [user?.role]);

  const toggleTheme = useCallback(() => {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark';
    window.dispatchEvent(new CustomEvent('app-theme-change', { detail: nextTheme }));
  }, [themeMode]);

  const switchLocale = useCallback(
    (nextLocale: 'en' | 'vi') => {
      if (nextLocale === locale) return;

      const isHttps = window.location.protocol === 'https:';
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax${isHttps ? '; secure' : ''}`;

      const query = searchParams.toString();
      const nextPath = query ? `${pathname}?${query}` : pathname;
      router.replace(nextPath);
      router.refresh();
    },
    [locale, pathname, router, searchParams]
  );

  const toggleLocale = useCallback(() => {
    const nextLocale = locale === 'en' ? 'vi' : 'en';
    void switchLocale(nextLocale);
  }, [locale, switchLocale]);

  const goToDashboard = useCallback(() => {
    router.push(ROUTES.DASHBOARD.INDEX);
  }, [router]);

  const handleMenuPress = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setIsSidebarOpen(false);
    router.push(ROUTES.HOME.index);
  }, [logout, router]);

  return (
    <>
      <XStack
        top={0}
        zIndex={200}
        height={HEADER_CONFIG.height.desktop}
        paddingHorizontal={HEADER_CONFIG.padding.desktop}
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="$myLessonsTopNavBackground"
        borderBottomWidth={1}
        borderBottomColor="$myLessonsTopNavBorder"
        $xs={{
          height: HEADER_CONFIG.height.mobile,
          paddingHorizontal: HEADER_CONFIG.padding.mobile,
        }}
        $sm={{
          height: HEADER_CONFIG.height.tablet,
          paddingHorizontal: HEADER_CONFIG.padding.tablet,
        }}
        style={{
          position: 'sticky',
          backdropFilter: HEADER_CONFIG.backdrop.blur,
          backgroundImage: `linear-gradient(90deg, ${headerTheme.webHeaderBgStart}, ${headerTheme.webHeaderBgEnd})`,
          boxShadow: `${headerTheme.webHeaderContainerShadow}`,
          transition: `background-image ${HEADER_CONFIG.transition.duration} ${HEADER_CONFIG.transition.easing}, box-shadow ${HEADER_CONFIG.transition.duration} ${HEADER_CONFIG.transition.easing}, border-color ${HEADER_CONFIG.transition.borderDuration} ease`,
        }}
      >
        <XStack
          alignItems="center"
          gap={10}
          $xs={{ gap: 6 }}
          $sm={{ gap: 8 }}
        >
          {isDashboard && isMobile ? (
            <XStack
              alignItems="center"
              gap={HEADER_CONFIG.menu.dashboardGap}
            >
              <Button
                chromeless
                onPress={handleMenuPress}
                padding={HEADER_CONFIG.menu.buttonPadding}
                borderRadius={HEADER_CONFIG.menu.buttonBorderRadius}
                hoverStyle={{
                  backgroundColor: '$dashboardTutorSidebarItemHover',
                }}
              >
                <MenuIcon
                  size={HEADER_CONFIG.menu.iconSize}
                  color={headerTheme.webHeaderToggleText || '#111827'}
                />
              </Button>
              <Text
                color="$myLessonsBrandText"
                fontSize={HEADER_CONFIG.logo.mobileDashboardFontSize}
                fontWeight="700"
              >
                TutorMatch
              </Text>
            </XStack>
          ) : (
            <Link
              href={ROUTES.HOME.index}
              style={{ textDecoration: 'none' }}
            >
              <XStack
                alignItems="center"
                gap={10}
                borderRadius={HEADER_CONFIG.logo.borderRadius}
                paddingVertical={HEADER_CONFIG.logo.padding.vertical}
                paddingHorizontal={HEADER_CONFIG.logo.padding.horizontal}
                backgroundColor="$webHeaderLogoChipBg"
                borderWidth={1}
                borderColor="$webHeaderLogoChipBorder"
                $xs={{
                  paddingVertical: HEADER_CONFIG.logo.mobilePadding.vertical,
                  paddingHorizontal: HEADER_CONFIG.logo.mobilePadding.horizontal,
                  gap: 0,
                }}
                $sm={{
                  paddingVertical: HEADER_CONFIG.logo.mobilePadding.vertical,
                  paddingHorizontal: HEADER_CONFIG.logo.mobilePadding.horizontal,
                  gap: 0,
                }}
                style={{
                  transition: `all ${HEADER_CONFIG.transition.borderDuration} ${HEADER_CONFIG.transition.easing}`,
                  cursor: 'pointer',
                }}
                className="mobile-header-logo"
                hoverStyle={{
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                }}
                pressStyle={{
                  transform: 'scale(0.95)',
                }}
              >
                <LogoIcon size={HEADER_CONFIG.logo.size} />
                <Text
                  color="$myLessonsBrandText"
                  fontSize={HEADER_CONFIG.logo.fontSize}
                  fontWeight="700"
                  lineHeight={HEADER_CONFIG.logo.lineHeight}
                  display="block"
                  $xs={{ display: 'none' }}
                  $sm={{ display: 'none' }}
                >
                  TutorMatch
                </Text>
              </XStack>
            </Link>
          )}
        </XStack>

        <XStack
          gap={HEADER_CONFIG.nav.gap.desktop}
          alignItems="center"
          $xs={{ display: 'none' }}
          $sm={{ display: 'none' }}
        >
          {HEADER_NAV.map((item) => (
            <HeaderNavLink
              key={item.href}
              href={item.href}
              label={t(item.labelKey)}
              active={pathname === item.href}
            />
          ))}
        </XStack>

        <XStack
          gap={12}
          alignItems="center"
          display="none"
          $xs={{ display: 'flex', gap: HEADER_CONFIG.nav.gap.mobile }}
          $sm={{ display: 'flex', gap: HEADER_CONFIG.nav.gap.tablet }}
        >
          <Link
            href={HEADER_NAV[0].href}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            <Text
              color={
                pathname === HEADER_NAV[0].href ? '$myLessonsNavActive' : '$myLessonsNavInactive'
              }
              fontSize={HEADER_CONFIG.nav.fontSize.desktop}
              fontWeight={pathname === HEADER_NAV[0].href ? '700' : '500'}
              $xs={{ fontSize: HEADER_CONFIG.nav.fontSize.mobile }}
              $sm={{ fontSize: HEADER_CONFIG.nav.fontSize.tablet }}
            >
              {t(HEADER_NAV[0].labelKey)}
            </Text>
          </Link>
        </XStack>

        <XStack
          alignItems="center"
          gap={10}
          $xs={{ gap: 4 }}
          $sm={{ gap: 5 }}
        >
          {!isAuthenticated ? <LoginButton /> : null}

          <HeaderLocaleToggle
            locale={locale}
            onToggle={toggleLocale}
            iconColor={headerTheme.webHeaderToggleText}
          />

          <HeaderThemeToggle
            isDark={themeMode === 'dark'}
            onToggleAction={toggleTheme}
          />

          {isAuthenticated && user?.avatar ? (
            <XStack
              borderWidth={1}
              borderColor="$myLessonsTopNavBorder"
              borderRadius={999}
              backgroundColor="transparent"
              padding={HEADER_CONFIG.avatar.padding.desktop}
              cursor="pointer"
              onPress={goToDashboard}
              $xs={{ padding: HEADER_CONFIG.avatar.padding.mobile }}
              $sm={{ padding: HEADER_CONFIG.avatar.padding.tablet }}
            >
              <img
                src={user.avatar}
                alt={user.username ?? 'User avatar'}
                style={{
                  width: HEADER_CONFIG.avatar.size.desktop,
                  height: HEADER_CONFIG.avatar.size.desktop,
                  borderRadius: '999px',
                  objectFit: 'cover',
                  border: `${HEADER_CONFIG.avatar.borderWidth}px solid ${headerTheme.webHeaderAvatarBorder}`,
                  cursor: 'pointer',
                }}
                className="mobile-avatar"
              />
            </XStack>
          ) : null}
        </XStack>
      </XStack>

      <DashboardMobileDrawer
        isOpen={isDashboard && isMobile && isSidebarOpen}
        onClose={handleCloseSidebar}
        items={visibleMenuItems}
        pathname={pathname}
        activeIconColor={dashboardTheme.dashboardTutorFilterActiveBg || '#3B82F6'}
        inactiveIconColor={dashboardTheme.dashboardTutorTextSecondary || '#6B7280'}
        logoutIconColor={dashboardTheme.myLessonsSidebarLogoutIcon || '#EF4444'}
        onLogout={handleLogout}
        t={tDashboard}
      />
    </>
  );
}
