'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useAtomValue, useSetAtom } from 'jotai';
import { Screen, XStack, YStack } from '@mezon-tutors/app/ui';
import { getDashboardMenuItemsByRole } from '@mezon-tutors/shared/src/constants/dashboard';
import { ROUTES } from '@mezon-tutors/shared/src/constants/routes';
import { isLoadingAtom, userAtom } from '@mezon-tutors/app/store/auth.atom';
import { authService, tokenStorage } from '@mezon-tutors/app/services';
import { useThemeName, useMedia } from 'tamagui';
import { themes } from '@mezon-tutors/app/theme/theme';
import { DashboardSidebar } from '@mezon-tutors/app/features/dashboard/sidebar/DashboardSidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const themeName = useThemeName();
  const media = useMedia();
  const isMobile = media.sm || media.xs;
  const t = useTranslations('Dashboard');
  const user = useAtomValue(userAtom);
  const isAuthLoading = useAtomValue(isLoadingAtom);
  const setUser = useSetAtom(userAtom);
  const dashboardTheme = themeName === 'dark' ? themes.dark : themes.light;
  const visibleMenuItems = useMemo(() => getDashboardMenuItemsByRole(user?.role), [user?.role]);

  useEffect(() => {
    if (isAuthLoading) {
      return
    }

    if (!user?.role) {
      router.replace(ROUTES.HOME.index)
    }
  }, [isAuthLoading, router, user?.role])

  if (isAuthLoading) {
    return null
  }

  if (!user?.role) {
    return null
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
    } finally {
      await tokenStorage.clearTokens()
      setUser(null)
      router.push(ROUTES.HOME.index)
    }
  }

  return (
    <Screen>
      <XStack
        minHeight="100vh"
        flexDirection="row"
        flexWrap="nowrap"
        position="relative"
      >
        {!isMobile && (
          <DashboardSidebar
            items={visibleMenuItems}
            pathname={pathname}
            activeIconColor={dashboardTheme.dashboardTutorFilterActiveBg || '#3B82F6'}
            inactiveIconColor={dashboardTheme.dashboardTutorTextSecondary || '#6B7280'}
            logoutIconColor={dashboardTheme.myLessonsSidebarLogoutIcon || '#EF4444'}
            onLogout={handleLogout}
            t={t}
          />
        )}

        <YStack
          flex={1}
          minWidth={0}
          backgroundColor="$dashboardTutorPageBackground"
          padding={isMobile ? 12 : '$4'}
          paddingTop={isMobile ? 12 : '$4'}
        >
          {children}
        </YStack>
      </XStack>
    </Screen>
  )
}
