'use client';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>

      {/* LEFT - LOGO */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          🎓
        </div>
        <span>TutorMatch</span>
      </div>

      {/* CENTER - MENU */}
      <nav className={styles.nav}>
        <Link href="#">Find Tutor</Link>
        <Link href="#">Become a Tutor</Link>
      </nav>

      {/* RIGHT - ACTIONS */}
      <div className={styles.actions}>
        <Link href="#" className={styles.login}>
          Login
        </Link>

        <button className={styles.startBtn}>
          Get Started
        </button>
      </div>

    </header>
  );
}