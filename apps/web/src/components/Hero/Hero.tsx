'use client';

import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>

      {/* LEFT CONTENT */}
      <div className={styles.left}>

        <span className={styles.badge} >
          <img src="/icons/flash.svg" alt="flash" />  MATCHING STYLE TINDER
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

          <button className={styles.secondary} style={{display: "flex", alignItems: "center",gap: "8px"}}>
            <img src="/icons/wdemo.svg" alt="demo" />
            <span>Watch demo</span>
          </button>
        </div>

      </div>

      {/* RIGHT IMAGE */}
     <div className={styles.right}>
  <div className={styles.cardWrapper}> {/* 👈 thêm cái này */}

    {/* CARD CHÍNH */}
    <div className={styles.card}>
      <img src="/tutor.png" alt="Tutor" />

      <div className={styles.cardInfo}>
        <div className={styles.topRow}>
          <span className={styles.match}>95% MATCH</span>

          <div className={styles.rating}>
            <img src="/icons/star.svg" alt="star" />
            <span>4.9</span>
          </div>
        </div>

        <h3>Nguyen Minh Anh, 24</h3>
        <p>IELTS 8.0 • Dedicated to busy learners</p>

        <div className={styles.cardButtons}>
          <button className={styles.profile}>Profile</button>
          <button className={styles.connect}>Connect</button>
        </div>
      </div>
    </div>

    {/* CARD NHỎ */}
    <div className={styles.smallCard}>
      <img src="/cardbe.svg" alt="cardbe" />
      <div className={styles.play}>
        <img src="/icons/play.svg" alt="play" />
      </div>
    </div>

  </div>
</div>
    </section>
  );
}