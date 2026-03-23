'use client';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>

      {/* LEFT */}
      <div className={styles.left}>
        <div className={styles.logo}>
          <img src="/icons/Background.svg" alt="logo" />
          <span>TutorMatch</span>
        </div>
      </div>

      {/* CENTER */}
      <nav className={styles.nav}>
        <Link href="#">Find Tutor</Link>
        <Link href="#">Become a Tutor</Link>
      </nav>

      {/* RIGHT */}
      <div className={styles.right}>
        <Link href="#" className={styles.login}>
          Login
        </Link>

        <button className={styles.startBtn}>
          Get Started
        </button>

        {/* Mobile menu */}
        <div className={styles.mobileMenu}>
          ☰
        </div>
      </div>

    </header>
  );
}