import SwapCard from './SwapCard';
import styles from './SwapSkeleton.module.css';

const PANELS = ['pay', 'receive'];

const SwapSkeleton = () => (
  <SwapCard feed="loading">
    <p className="visually-hidden" role="status">
      Loading prices
    </p>
    <div className={styles.panels} aria-hidden="true">
      {PANELS.map(panel => (
        <div key={panel} className={styles.panel}>
          <span className={`${styles.block} ${styles.label}`} />
          <span className={styles.row}>
            <span className={`${styles.block} ${styles.amount}`} />
            <span className={`${styles.block} ${styles.token}`} />
          </span>
          <span className={`${styles.block} ${styles.meta}`} />
        </div>
      ))}
    </div>
    <span className={styles.rate} aria-hidden="true">
      <span className={`${styles.block} ${styles.rateLine}`} />
    </span>
    <span className={`${styles.block} ${styles.submit}`} aria-hidden="true" />
  </SwapCard>
);

export default SwapSkeleton;
