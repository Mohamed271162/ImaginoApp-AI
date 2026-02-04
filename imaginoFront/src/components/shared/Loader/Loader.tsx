import styles from './loader.module.css';
export default function Loader() {
  return (
    <div className={`${styles.loaderContainer}`}>
      <div className={styles['loader-wrapper']}>
        <span className={styles['loader-letter']}>L</span>
        <span className={styles['loader-letter']}>o</span>
        <span className={styles['loader-letter']}>a</span>
        <span className={styles['loader-letter']}>d</span>
        <span className={styles['loader-letter']}>i</span>
        <span className={styles['loader-letter']}>n</span>
        <span className={styles['loader-letter']}>g</span>
        <span className={styles['loader-letter']}>.</span>
        <span className={styles['loader-letter']}>.</span>
        <span className={styles['loader-letter']}>.</span>

        <div className={styles['loader']}></div>
      </div>
    </div>
  );
}
