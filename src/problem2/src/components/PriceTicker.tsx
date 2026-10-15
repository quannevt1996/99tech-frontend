import type { Token } from '../api/prices';
import { formatPrice } from '../lib/format';
import styles from './PriceTicker.module.css';

interface PriceTickerProps {
  tokens: Token[];
}

interface TickerListProps {
  tokens: Token[];
  hidden?: boolean;
}

const TickerList = ({ tokens, hidden = false }: TickerListProps) => (
  <ul className={styles.list} aria-hidden={hidden || undefined}>
    {tokens.map(token => (
      <li key={token.symbol} className={styles.item}>
        <span className={styles.symbol}>{token.symbol}</span>
        <span className={styles.price}>{formatPrice(token.priceUsd)}</span>
      </li>
    ))}
  </ul>
);

const PriceTicker = ({ tokens }: PriceTickerProps) => (
  <section className={styles.ticker} aria-label="Token prices" tabIndex={0}>
    <div className={styles.track}>
      <TickerList tokens={tokens} />
      <TickerList tokens={tokens} hidden />
    </div>
  </section>
);

export default PriceTicker;
