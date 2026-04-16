'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useAtomValue, useSetAtom } from 'jotai'
import Link from 'next/link'
import { Screen, XStack, YStack, Text, Button } from '@mezon-tutors/app/ui'
import { type DashboardMenuIconKey, type DashboardMenuItem, DASHBOARD_MENU_ITEMS } from '@mezon-tutors/shared/src/constants/dashboard'
import { ROUTES } from '@mezon-tutors/shared/src/constants/routes'
import { isLoadingAtom, logoutAtom, userAtom } from '@mezon-tutors/app/store/auth.atom'
import { BookingRequestIcon, CalendarIcon, DocumentIcon, LogoutIcon } from '@mezon-tutors/app/ui/icons'
import { useThemeName } from 'tamagui'
import { themes } from '@mezon-tutors/app/theme/theme'

type AppTheme = (typeof themes)[keyof typeof themes]

const DASHBOARD_ICON_COMPONENTS: Record<
  DashboardMenuIconKey,
  React.ComponentType<{ size?: number; color?: string }>
> = {
  document: DocumentIcon,
  bookingRequests: BookingRequestIcon,
  calendar: CalendarIcon,
  logout: LogoutIcon,
}

function getDashboardMenuDisplay(
  item: DashboardMenuItem,
  pathname: string,
  dashboardTheme: AppTheme
) {
  const active = item.type === 'link' && !!item.href && pathname === item.href
  const isLogoutItem = item.type === 'action'

  return {
    active,
    Icon: DASHBOARD_ICON_COMPONENTS[item.iconKey],
    iconColor: isLogoutItem
      ? dashboardTheme.myLessonsSidebarLogoutIcon
      : active
        ? dashboardTheme.dashboardTutorFilterActiveBg
        : dashboardTheme.dashboardTutorTextSecondary,
    labelColor: isLogoutItem
      ? '$myLessonsSidebarLogoutText'
      : active
        ? '$dashboardTutorFilterActiveBg'
        : '$dashboardTutorTextSecondary',
  }
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const themeName = useThemeName()
  const t = useTranslations('Dashboard')
  const user = useAtomValue(userAtom)
  const isAuthLoading = useAtomValue(isLoadingAtom)
  const logout = useSetAtom(logoutAtom)
  const dashboardTheme = themeName === 'dark' ? themes.dark : themes.light
  const role = user?.role === 'STUDENT' ? 'STUDENT' : 'TUTOR'
  const visibleMenuItems = DASHBOARD_MENU_ITEMS.filter((item) => item.roles.includes(role))

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
    await logout()
    router.push(ROUTES.HOME.index)
  }

  return (
    <Screen>
      <XStack minHeight="100vh" flexDirection="row" flexWrap="nowrap">
        <YStack
          width={240}
          minWidth={240}
          backgroundColor="$dashboardTutorSidebarBackground"
          borderRightWidth={1}
          borderRightColor="$dashboardTutorSidebarBorder"
          padding="$4"
          gap="$3"
        >
          {visibleMenuItems.map((item: DashboardMenuItem) => {
            const { active, Icon: ItemIcon, iconColor, labelColor } = getDashboardMenuDisplay(
              item,
              pathname,
              dashboardTheme
            )

            const content = (
              <Button
                onPress={item.type === 'action' ? handleLogout : undefined}
                borderWidth={active ? 1 : 0}
                borderColor="$dashboardTutorSidebarItemActiveBorder"
                backgroundColor={active ? '$dashboardTutorSidebarItemActiveBg' : 'transparent'}
                color={labelColor}
                paddingVertical="$2"
                paddingHorizontal="$3"
                borderRadius={12}
                flexDirection="row"
                alignItems="center"
                gap="$2"
                justifyContent="flex-start"
                style={{ cursor: 'pointer' }}
                hoverStyle={{
                  backgroundColor: '$dashboardTutorSidebarItemHover',
                  borderColor: '$dashboardTutorSidebarItemActiveBorder',
                }}
              >
                <ItemIcon size={item.iconKey === 'bookingRequests' ? 19 : 16} color={iconColor} />
                <Text color={labelColor} fontWeight={active ? '700' : '500'}>
                  {t(`sidebar.${item.labelKey}`)}
                </Text>
              </Button>
            )

            if (item.type === 'link' && item.href) {
              return (
                <Link key={item.key} href={item.href} style={{ textDecoration: 'none' }}>
                  {content}
                </Link>
              )
            }

            return <YStack key={item.key}>{content}</YStack>
          })}

          <YStack marginTop="auto" width="100%" />
        </YStack>

        <YStack flex={1} minWidth={0} backgroundColor="$dashboardTutorPageBackground" padding="$4">
          {children}
        </YStack>
      </XStack>
    </Screen>
  )
}
