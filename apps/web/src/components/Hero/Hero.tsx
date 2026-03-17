'use client';

import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>

      {/* LEFT CONTENT */}
      <div className={styles.left}>

        <span className={styles.badge}>
          ⚡ MATCHING STYLE TINDER
        </span>

        <h1 className={styles.title}>
          Find your ideal tutor -
          <br />
          <span>Just a swipe away</span>
        </h1>

        <p className={styles.desc}>
          Connect busy professionals with talented tutors. Learn
          any language, anytime, anywhere via the integrated
          Mezon platform.
        </p>

        <div className={styles.buttons}>
          <button className={styles.primary}>
            Start now
          </button>

          <button className={styles.secondary}>
            ▶ Watch demo
          </button>
        </div>

      </div>

      {/* RIGHT IMAGE */}
      <div className={styles.right}>

        <div className={styles.card}>
          <img
            src="/tutor.png"
            alt="Tutor"
          />

          <div className={styles.cardInfo}>
            <span className={styles.match}>95% MATCH ⭐ 4.9</span>

            <h3>Nguyen Minh Anh, 24</h3>

            <p>IELTS 8.0 • Dedicated to busy learners</p>

            <div className={styles.cardButtons}>
              <button className={styles.profile}>
                Profile
              </button>

              <button className={styles.connect}>
                Connect
              </button>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}