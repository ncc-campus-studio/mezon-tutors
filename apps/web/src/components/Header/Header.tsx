'use client'
import Link from 'next/link'
import { useAtomValue } from 'jotai'
import { isAuthenticatedAtom, userAtom } from '@mezon-tutors/app/store/auth.atom'
import { LoginButton } from '@mezon-tutors/app/components/auth/LoginButton'
import { HEADER_NAV, ROUTES } from '@mezon-tutors/shared'
import { useCallback } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { XStack, Text, Button } from '@mezon-tutors/app/ui'
import { LogoIcon } from '@mezon-tutors/app/ui/icons'
import { themes } from '@mezon-tutors/app/theme/theme'
import { useThemeName } from 'tamagui'
import { HeaderLocaleToggle } from './HeaderLocaleToggle'
import { HeaderThemeToggle } from './HeaderThemeToggle'
import { HeaderNavLink } from './HeaderNavLink'

export default function Header() {
  const locale = useLocale()
  const t = useTranslations('Common.Header')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const themeName = useThemeName()
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const user = useAtomValue(userAtom)
  const themeMode: 'light' | 'dark' = themeName === 'dark' ? 'dark' : 'light'
  const headerTheme = themeMode === 'dark' ? themes.dark : themes.light

  const toggleTheme = useCallback(() => {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark'
    window.dispatchEvent(new CustomEvent('app-theme-change', { detail: nextTheme }))
  }, [themeMode])

  const switchLocale = useCallback(
    (nextLocale: 'en' | 'vi') => {
      if (nextLocale === locale) return

      const isHttps = window.location.protocol === 'https:'
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax${isHttps ? '; secure' : ''}`

      const query = searchParams.toString()
      const nextPath = query ? `${pathname}?${query}` : pathname
      router.replace(nextPath)
      router.refresh()
    },
    [locale, pathname, router, searchParams]
  )

  const toggleLocale = useCallback(() => {
    const nextLocale = locale === 'en' ? 'vi' : 'en'
    void switchLocale(nextLocale)
  }, [locale, switchLocale])

  const goToDashboard = useCallback(() => {
    router.push(ROUTES.DASHBOARD.INDEX)
  }, [router])

  return (
    <XStack
      top={0}
      zIndex={200}
      height={80}
      paddingHorizontal={60}
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="$myLessonsTopNavBackground"
      borderBottomWidth={1}
      borderBottomColor="$myLessonsTopNavBorder"
      style={{
        position: 'sticky',
        backdropFilter: 'blur(14px) saturate(140%)',
        backgroundImage: `linear-gradient(90deg, ${headerTheme.webHeaderBgStart}, ${headerTheme.webHeaderBgEnd})`,
        boxShadow: `${headerTheme.webHeaderContainerShadow}`,
        transition: 'background-image 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms cubic-bezier(0.22,1,0.36,1), border-color 320ms ease',
      }}
    >
      <XStack alignItems="center" gap={10}>
        <Link href={ROUTES.HOME.index} style={{ color: 'inherit', textDecoration: 'none' }}>
          <XStack
            alignItems="center"
            gap={10}
            borderRadius={999}
            paddingVertical={6}
            paddingHorizontal={10}
            backgroundColor="$webHeaderLogoChipBg"
            borderWidth={1}
            borderColor="$webHeaderLogoChipBorder"
            style={{ transition: 'all 320ms cubic-bezier(0.22,1,0.36,1)' }}
          >
            <LogoIcon />
            <Text color="$myLessonsBrandText" fontSize={18} fontWeight="700" lineHeight={24}>
              TutorMatch
            </Text>
          </XStack>
        </Link>
      </XStack>

      <XStack gap={30} alignItems="center">
        {HEADER_NAV.map((item) => (
          <HeaderNavLink
            key={item.href}
            href={item.href}
            label={t(item.labelKey)}
            active={pathname === item.href}
          />
        ))}
      </XStack>

      <XStack alignItems="center" gap={10}>
        {!isAuthenticated ? <LoginButton /> : null}

        <HeaderLocaleToggle locale={locale} onToggle={toggleLocale} iconColor={headerTheme.webHeaderToggleText} />

        <HeaderThemeToggle isDark={themeMode === 'dark'} onToggleAction={toggleTheme} />

        {isAuthenticated && user?.avatar ? (
          <XStack
            borderWidth={1}
            borderColor="$myLessonsTopNavBorder"
            borderRadius={999}
            backgroundColor="transparent"
            padding={4}
            cursor="pointer"
            onPress={goToDashboard}
          >
            <img
              src={user.avatar}
              alt={user.username ?? 'User avatar'}
              style={{
                width: 36,
                height: 36,
                borderRadius: '999px',
                objectFit: 'cover',
                border: `2px solid ${headerTheme.webHeaderAvatarBorder}`,
                cursor: 'pointer',
              }}
            />
          </XStack>
        ) : null}
      </XStack>
    </XStack>
  )
}
