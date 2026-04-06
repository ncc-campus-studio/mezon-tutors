'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useSetAtom } from 'jotai'
import Link from 'next/link'
import { Screen, XStack, YStack, Text, Button } from '@mezon-tutors/app/ui'
import { DASHBOARD_MENU_ITEMS, ROUTES, type DashboardMenuIconKey, type DashboardMenuItem } from '@mezon-tutors/shared'
import { logoutAtom } from '@mezon-tutors/app/store/auth.atom'
import { CalendarIcon, LogoutIcon } from '@mezon-tutors/app/ui/icons'
import { useThemeName } from 'tamagui'
import { themes } from '@mezon-tutors/app/theme/theme'

const DASHBOARD_ICON_COMPONENTS: Record<
  DashboardMenuIconKey,
  React.ComponentType<{ size?: number; color?: string }>
> = {
  calendar: CalendarIcon,
  logout: LogoutIcon,
}

function getDashboardMenuDisplay(
  item: DashboardMenuItem,
  pathname: string,
  dashboardTheme: (typeof themes)['light']
) {
  const active = item.type === 'link' && !!item.href && pathname === item.href
  const isLogoutItem = item.type === 'action'

  return {
    active,
    isLogoutItem,
    Icon: DASHBOARD_ICON_COMPONENTS[item.iconKey],
    iconColor: isLogoutItem
      ? dashboardTheme.myLessonsSidebarLogoutIcon
      : active
        ? dashboardTheme.myLessonsSidebarIconActive
        : dashboardTheme.myLessonsSidebarIconInactive,
    labelColor: isLogoutItem
      ? '$myLessonsSidebarLogoutText'
      : active
        ? '$myLessonsPrimaryButton'
        : '$homeSectionBody',
  }
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const themeName = useThemeName()
  const t = useTranslations('Common.Header')
  const logout = useSetAtom(logoutAtom)
  const dashboardTheme = themeName === 'dark' ? themes.dark : themes.light

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
          backgroundColor="$myLessonsCardBackground"
          borderRightWidth={1}
          borderRightColor="$myLessonsTopNavBorder"
          padding="$4"
          gap="$3"
        >
          {DASHBOARD_MENU_ITEMS.map((item: DashboardMenuItem) => {
            const { active, Icon: ItemIcon, iconColor, labelColor } = getDashboardMenuDisplay(
              item,
              pathname,
              dashboardTheme
            )

            const content = (
              <Button
                onPress={item.type === 'action' ? handleLogout : undefined}
                borderWidth={active ? 1 : 0}
                borderColor="$myLessonsPrimaryButton"
                backgroundColor={active ? '$myLessonsCardBackground' : 'transparent'}
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
                  backgroundColor: '$myLessonsSwitcherBackground',
                  borderColor: '$myLessonsPrimaryButton',
                }}
              >
                <ItemIcon size={16} color={iconColor} />
                <Text color={labelColor} fontWeight={active ? '700' : '500'}>
                  {t(item.labelKey)}
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

            return (
              <YStack key={item.key}>
                {content}
              </YStack>
            )
          })}

          <YStack marginTop="auto" width="100%" />
        </YStack>

        <YStack flex={1} minWidth={0} backgroundColor="$myLessonsPageBackground" padding="$4">
          {children}
        </YStack>
      </XStack>
    </Screen>
  )
}
