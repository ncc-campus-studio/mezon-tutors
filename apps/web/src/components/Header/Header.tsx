'use client'
import Link from 'next/link'
import styles from './Header.module.css'
import { useAtomValue, useSetAtom } from 'jotai'
import { getAuthUrlAtom, isAuthenticatedAtom, userAtom } from '@mezon-tutors/app/store/auth.atom'
import { LoginButton } from '@mezon-tutors/app/components/auth/LoginButton'
import { LogoutButton } from '@mezon-tutors/app/components/auth/LogoutButton'
import { ROUTES } from '@mezon-tutors/shared'
import { useCallback, useEffect, useMemo, useState, type CSSProperties, type MouseEvent } from 'react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTheme } from 'tamagui'

const POST_LOGIN_REDIRECT_KEY = 'post-login-redirect'

function ThemeIcon({ isDark }: { isDark: boolean }) {
  if (isDark) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2.5V5.2M12 18.8V21.5M21.5 12H18.8M5.2 12H2.5M18.7 5.3L16.8 7.2M7.2 16.8L5.3 18.7M18.7 18.7L16.8 16.8M7.2 7.2L5.3 5.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Header() {
  const router = useRouter()
  const locale = useLocale()
  const theme = useTheme()
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const user = useAtomValue(userAtom)
  const getAuthUrl = useSetAtom(getAuthUrlAtom)
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light')
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme')
    if (currentTheme === 'dark' || currentTheme === 'light') {
      setThemeMode(currentTheme)
      return
    }

    const savedTheme = window.localStorage.getItem('app-theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setThemeMode(savedTheme)
    }
  }, [])

  const handleStartLogin = useCallback(async () => {
    try {
      const url = await getAuthUrl()
      const width = 800
      const height = 500
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2

      window.open(
        url,
        'mezon-oauth',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      )
    } catch (error) {
      console.error('[OAUTH] start login error:', error)
    }
  }, [getAuthUrl])

  const handleBecomeTutorClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      if (isAuthenticated) return
      event.preventDefault()
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, ROUTES.BECOME_TUTOR.INDEX)
      }
      void handleStartLogin()
    },
    [handleStartLogin, isAuthenticated]
  )

  useEffect(() => {
    if (!isAuthenticated || typeof window === 'undefined') return

    const redirectPath = window.sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY)
    if (!redirectPath) return

    window.sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY)
    router.push(redirectPath)
  }, [isAuthenticated, router])

  const toggleTheme = useCallback(() => {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark'
    setThemeMode(nextTheme)
    window.dispatchEvent(new CustomEvent('app-theme-change', { detail: nextTheme }))
  }, [themeMode])

  const switchLocale = useCallback(
    (nextLocale: 'en' | 'vi') => {
      if (nextLocale === locale) return

      // Persist selected locale for next-intl middleware/request config.
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax; secure`

      // Re-render current route with the updated locale cookie.
      router.refresh()
    },
    [locale, router]
  )

  const headerCssVars = useMemo(
    () =>
      ({
        '--header-bg-start': theme.webHeaderBgStart?.get(),
        '--header-bg-end': theme.webHeaderBgEnd?.get(),
        '--header-border': theme.webHeaderBorder?.get(),
        '--header-logo-text': theme.webHeaderLogoText?.get(),
        '--header-nav-text': theme.webHeaderNavText?.get(),
        '--header-nav-hover': theme.webHeaderNavHover?.get(),
        '--header-toggle-border': theme.webHeaderToggleBorder?.get(),
        '--header-toggle-bg': theme.webHeaderToggleBg?.get(),
        '--header-toggle-text': theme.webHeaderToggleText?.get(),
        '--header-toggle-hover': theme.webHeaderToggleHover?.get(),
        '--header-locale-active-bg': theme.webHeaderLocaleActiveBg?.get(),
        '--header-locale-active-text': theme.webHeaderLocaleActiveText?.get(),
      }) as CSSProperties,
    [theme]
  )

  return (
    <header className={styles.header} style={headerCssVars}>
      <div className={styles.logo}>
        <Link href={ROUTES.HOME.index} className={styles.logoLink}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            className={styles.icons}
          >
            <img src="/icons/Background.svg" alt="background" />
            <span style={{ margin: 0 }}>TutorMatch</span>
          </div>
        </Link>
      </div>

      <nav className={styles.nav}>
        <Link href={ROUTES.TUTOR.INDEX}>Find Tutor</Link>
        <Link href={ROUTES.MY_LESSONS.INDEX}>My Lessons</Link>
        {isAuthenticated ? (
          <Link href={ROUTES.BECOME_TUTOR.INDEX}>Become a Tutor</Link>
        ) : (
          <button type="button" className={styles.navLinkButton} onClick={handleBecomeTutorClick}>
            Become a Tutor
          </button>
        )}
      </nav>

      <div className={styles.actions}>
        <button type="button" className={styles.themeToggle} onClick={toggleTheme}>
          <ThemeIcon isDark={themeMode === 'dark'} />
        </button>

        <div className={styles.localeToggle}>
          <button
            type="button"
            className={locale === 'en' ? styles.localeActive : ''}
            onClick={() => switchLocale('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={locale === 'vi' ? styles.localeActive : ''}
            onClick={() => switchLocale('vi')}
          >
            VI
          </button>
        </div>

        {isAuthenticated ? (
          <div className={styles.userMenuWrapper}>
            <button 
              type="button"
              className={styles.userInfo}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username ?? 'User avatar'} className={styles.avatar} />
              ) : (
                <div className={styles.avatar}>
                  {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                </div>
              )}
              <span className={styles.username}>{user?.username}</span>
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none"
                style={{ 
                  transition: 'transform 200ms',
                  transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                <path 
                  d="M3 4.5L6 7.5L9 4.5" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            
            {showUserMenu && (
              <>
                <div 
                  className={styles.menuOverlay} 
                  onClick={() => setShowUserMenu(false)}
                />
                <div className={styles.userMenu}>
                  <div className={styles.menuItem}>
                    <LogoutButton />
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  )
}
