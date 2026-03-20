'use client';

import styles from './Stats.module.css';

export default function Stats() {
  return (
    <section className={styles.stats}>

      {/* LEFT IMAGE */}
      <div className={styles.imageBox}>
        <img src="/teach.jpg" alt="Teaching" />

        <div className={styles.badge}>
          <h3>+15M VND</h3>
          <span>AVERAGE INCOME / MONTH </span>
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
          <li style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }} ><img src="/icons/iccheck.svg" alt="check" />
    <span> Get paid after every lesson</span></li>
          <li style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}><img src="/icons/iccheck.svg" alt="check" />
    <span> Teaching tools support</span></li>
          <li style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}><img src="/icons/iccheck.svg" alt="check" />
    <span> Flexible schedule</span></li>
        </ul>

        <button className={styles.button}>
          Register to teach
        </button>

      </div>

    </section>
  );
}