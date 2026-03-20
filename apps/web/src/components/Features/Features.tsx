'use client';

import styles from './Features.module.css';

export default function Features() {
  return (
    <section className={styles.features}>

      {/* TOP */}
      <div className={styles.top}>

        <div>
          <h2>For busy learners</h2>

          <p>
            Our learning system is specifically designed to optimize the
            time of working <br /> professionals, helping you conquer foreign
            languages without affecting your career.
          </p>
        </div>

        <a className={styles.explore}>
          Explore all features →
        </a>

      </div>

      {/* CARDS */}
      <div className={styles.cards}>

        <div className={styles.card}>
          <div className={styles.icon}>
            <img src="/icons/ft1.svg" alt="icft1" />
          </div>

          <h3>Evening classes</h3>

          <p>
            Make use of your time after work with tutors ready to accompany
            you until 11 PM.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}>
            <img src="/icons/ft2.svg" alt="icft2"
            style={{ width: "24px", height: "24px" }} />
          </div>

          <h3>Flexible weekends</h3>

          <p>
            No more worrying about work pressure, spend 2 weekend days
            to upgrade your communication skills.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}>
            <img src="/icons/ft3.svg" alt="icft3" />
          </div>

          <h3>Learn via Mezon</h3>

          <p>
            Chat, video call, and share materials smoothly on the
            familiar Mezon app.
          </p>
        </div>

      </div>

    </section>
  );
}