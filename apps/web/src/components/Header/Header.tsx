'use client'
import Link from 'next/link'
import styles from './Header.module.css'
import { useAtomValue } from 'jotai'
import { isAuthenticatedAtom } from '@mezon-tutors/app/store/auth.atom'
import { LoginButton } from '@mezon-tutors/app/components/auth/LoginButton'
import { LogoutButton } from '@mezon-tutors/app/components/auth/LogoutButton'
import { ROUTES } from '@mezon-tutors/shared'

export default function Header() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          className={styles.icons}
        >
          <img src="/icons/Background.svg" alt="background" />
          <span style={{ margin: 0 }}>TutorMatch</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <Link href={ROUTES.TUTOR.INDEX}>Find Tutor</Link>
        <Link href={ROUTES.MY_LESSONS.INDEX}>My Lessons</Link>
        <Link href={ROUTES.BECOME_TUTOR.INDEX}>Become a Tutor</Link>
      </nav>

      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
    </header>
  )
}
