'use client';

import styles from './Stats.module.css';

export default function Stats() {
  return (
    <section className={styles.stats}>

      {/* LEFT IMAGE */}
      <div className={styles.imageBox}>
        <img src="/teach.jpg" alt="Teaching" />

        <div className={styles.badge}>
          <strong>+15M VND</strong>
          <span>Average income / month</span>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className={styles.content}>

        <h2>
          Become a tutor and <br />
          <span>increase your income</span>
        </h2>

        <p>
          For students and professionals with high language proficiency.Share knowledge, manage your time, and build a personal brand
          in our learning community.
        </p>

        <ul className={styles.list}>
          <li>✔ Get paid after every lesson</li>
          <li>✔ Teaching tools support</li>
          <li>✔ Flexible schedule</li>
        </ul>

        <button className={styles.button}>
          Register to teach
        </button>

      </div>

    </section>
  );
}