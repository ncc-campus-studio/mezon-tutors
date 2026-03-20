'use client';

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>

      <div className={styles.container}>

        {/* BRAND */}
        <div className={styles.brand}>
          <div className={styles.logo}>
  <div style={{display: "flex",alignItems: "center",gap: "10px"}} className={styles.icons}>
  <img src="/icons/Background.svg" alt="background" />
   <h3 style={{ margin: 0 }}>TutorMatch</h3>
</div>

</div>
          <p>
            The leading language tutor < br/>  matching platform
            for working < br/>  professionals in Vietnam.
          </p>

          <div className={styles.icons}>
            <img src="/icons/foot1.svg" alt="foot1" />
            <img src="/icons/foot2.svg" alt="foot2" />
          </div>
        </div>

        {/* PRODUCT */}
        <div className={styles.column}>
          <h4>Product</h4>
          <ul>
            <li>Find a tutor</li>
            <li>Pricing</li>
            <li>Enterprise</li>
          </ul>
        </div>

        {/* COMMUNITY */}
        <div className={styles.column}>
          <h4>Community</h4>
          <ul>
            <li>Become a tutor</li>
            <li>Education blog</li>
            <li>Events</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div className={styles.column}>
          <h4>Support</h4>
          <ul>
            <li>Help center</li>
            <li>Privacy policy</li>
            <li>Contact</li>
          </ul>
        </div>

      </div>

      <div className={styles.bottom}>
        <p>© 2024 TutorMatch. All rights reserved.</p>

        <div className={styles.links}>
          <span>Terms</span>
          <span>Privacy</span>
        </div>
      </div>

    </footer>
  );
}