'use client'
import Link from 'next/link'
import { useAtomValue } from 'jotai'
import { isAuthenticatedAtom, userAtom } from '@mezon-tutors/app/store/auth.atom'
import { LoginButton } from '@mezon-tutors/app/components/auth/LoginButton'
import { HEADER_NAV, ROUTES } from '@mezon-tutors/shared'
import { useCallback } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { XStack, Text } from '@mezon-tutors/app/ui'
import { LogoIcon } from '@mezon-tutors/app/ui/icons'
import { themes } from '@mezon-tutors/app/theme/theme'
import { useThemeName, useMedia } from 'tamagui'
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
  const media = useMedia()
  const isMobile = media.sm || media.xs
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
      $xs={{ height: 56, paddingHorizontal: 12 }}
      $sm={{ height: 60, paddingHorizontal: 14 }}
      style={{
        position: 'sticky',
        backdropFilter: 'blur(14px) saturate(140%)',
        backgroundImage: `linear-gradient(90deg, ${headerTheme.webHeaderBgStart}, ${headerTheme.webHeaderBgEnd})`,
        boxShadow: `${headerTheme.webHeaderContainerShadow}`,
        transition: 'background-image 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms cubic-bezier(0.22,1,0.36,1), border-color 320ms ease',
      }}
    >
      <XStack alignItems="center" gap={10} $xs={{ gap: 6 }} $sm={{ gap: 8 }}>
        <Link href={ROUTES.HOME.index} style={{ textDecoration: 'none' }}>
          <XStack
            alignItems="center"
            gap={10}
            borderRadius={999}
            paddingVertical={6}
            paddingHorizontal={10}
            backgroundColor="$webHeaderLogoChipBg"
            borderWidth={1}
            borderColor="$webHeaderLogoChipBorder"
            $xs={{ paddingVertical: 6, paddingHorizontal: 6, gap: 0 }}
            $sm={{ paddingVertical: 6, paddingHorizontal: 6, gap: 0 }}
            style={{ transition: 'all 320ms cubic-bezier(0.22,1,0.36,1)', cursor: 'pointer' }}
            className="mobile-header-logo"
            hoverStyle={{
              transform: 'scale(1.05)',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
            }}
            pressStyle={{
              transform: 'scale(0.95)',
            }}
          >
            <LogoIcon size={24} />
            <Text 
              color="$myLessonsBrandText" 
              fontSize={18} 
              fontWeight="700" 
              lineHeight={24}
              display="block"
              $xs={{ display: 'none' }}
              $sm={{ display: 'none' }}
            >
              TutorMatch
            </Text>
          </XStack>
        </Link>
      </XStack>

      <XStack 
        gap={30} 
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
        $xs={{ display: 'flex', gap: 8 }}
        $sm={{ display: 'flex', gap: 10 }}
      >
        <Link href={HEADER_NAV[0].href} style={{ color: 'inherit', textDecoration: 'none' }}>
          <Text
            color={pathname === HEADER_NAV[0].href ? '$myLessonsNavActive' : '$myLessonsNavInactive'}
            fontSize={14}
            fontWeight={pathname === HEADER_NAV[0].href ? '700' : '500'}
            $xs={{ fontSize: 12 }}
            $sm={{ fontSize: 13 }}
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
            $xs={{ padding: 2 }}
            $sm={{ padding: 3 }}
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
              className="mobile-avatar"
            />
          </XStack>
        ) : null}
      </XStack>
    </XStack>
  )
}
