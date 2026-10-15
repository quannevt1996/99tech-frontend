import SwapCard from './SwapCard';
import styles from './PriceError.module.css';

interface PriceErrorProps {
  onRetry: () => void;
}

const PriceError = ({ onRetry }: PriceErrorProps) => (
  <SwapCard feed="error">
    <div className={styles.body} role="alert">
      <h2 className={styles.title}>ERR: price feed unavailable</h2>
      <p className={styles.text}>
        The price feed didn't respond, so rates can't be shown. Check your connection and try again.
      </p>
      <button type="button" className={styles.retry} onClick={onRetry}>
        Retry
      </button>
    </div>
  </SwapCard>
);

export default PriceError;
