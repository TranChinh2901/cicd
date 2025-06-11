
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer} >
      <div className={styles.container}>
        <div className={styles.column}>
          <h3 className={styles.title}>The Algorithms</h3>
          <p className={styles.description}>Open Source resource for learning DSA.</p>
          <p className={styles.text}>
            Join our community of open source developers and learn and share implementations for algorithms and data structures in various languages. Learn, share, and grow with us.
          </p>
        </div>
        <div className={styles.columnB} >
          <h3 className={styles.title}>Resources</h3>
          <ul className={styles.list} >
            <li><a href="#" className={styles.link}>Programming Languages</a></li>
            <li><a href="#" className={styles.link}>Algorithms</a></li>
            <li><a href="#" className={styles.link}>How to Contribute</a></li>
            <li><a href="#" className={styles.link}>Documentation</a></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3 className={styles.title}>Community</h3>
          <ul className={styles.list}>
            <li><a href="#" className={styles.link}>GitHub</a></li>
            <li><a href="#" className={styles.link}>Discord</a></li>
            <li><a href="#" className={styles.link}>Twitter</a></li>
            <li><a href="#" className={styles.link}>Our Team</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>© 2025 The Algorithms of Tran Viet Chinh. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;