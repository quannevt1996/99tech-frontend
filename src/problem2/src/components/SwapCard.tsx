import { useId, type ReactNode } from 'react';
import type { TokensStatus } from '../hooks/useTokens';
import styles from './SwapCard.module.css';

interface SwapCardProps {
  children: ReactNode;
  feed: TokensStatus;
}

const FEED_LABELS: Readonly<Record<TokensStatus, string>> = {
  loading: 'Loading',
  error: 'Offline',
  ready: 'Live',
};

const SwapCard = ({ children, feed }: SwapCardProps) => {
  const titleId = useId();

  return (
    <section className={styles.card} aria-labelledby={titleId} aria-busy={feed === 'loading' || undefined}>
      <div className={styles.titleBar}>
        <h1 id={titleId} className={styles.title}>
          Swap
        </h1>
        <span className={styles.feed} data-feed={feed}>
          <span className={styles.dot} aria-hidden="true" />
          <span className="visually-hidden">Price feed </span>
          {FEED_LABELS[feed]}
        </span>
      </div>
      {children}
    </section>
  );
};

export default SwapCard;
