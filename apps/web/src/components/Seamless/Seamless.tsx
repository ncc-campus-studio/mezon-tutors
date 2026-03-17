'use client';

import styles from './Seamless.module.css';

export default function Seamless() {
  return (
    <section className={styles.seamless}>

      {/* TITLE */}
      <div className={styles.header}>
        <h2>Seamless experience on Mezon</h2>

        <p>
          TutorMatch integrates with Mezon to create a focused and
          connected learning space. No need to switch between too
          many apps.
        </p>
      </div>

      {/* CARDS */}
      <div className={styles.cards}>

        <div className={styles.card}>
          <div className={styles.icon}>💬</div>

          <div>
            <h3>Virtual Classroom</h3>

            <p>
              High-quality video calls, screen sharing, and
              interactive whiteboards directly in your browser.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}>📹</div>

          <div>
            <h3>Virtual Classroom</h3>

            <p>
              High-quality video calls, screen sharing, and
              interactive whiteboards directly in your browser.
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}