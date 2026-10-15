import PriceError from './components/PriceError';
import PriceTicker from './components/PriceTicker';
import SwapForm from './components/SwapForm';
import SwapSkeleton from './components/SwapSkeleton';
import { LogoMark } from './components/Icons';
import useTokens from './hooks/useTokens';
import styles from './App.module.css';

const App = () => {
  const { status, tokens, retry } = useTokens();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>
          <LogoMark className={styles.mark} />
          Fancy Form
        </span>
        <span className={styles.wallet}>
          <span className={styles.walletDot} aria-hidden="true" />
          Demo wallet
        </span>
      </header>
      <div className={styles.tickerSlot}>{status === 'ready' && <PriceTicker tokens={tokens} />}</div>
      <main className={styles.main}>
        {status === 'loading' && <SwapSkeleton />}
        {status === 'error' && <PriceError onRetry={retry} />}
        {status === 'ready' && <SwapForm tokens={tokens} />}
      </main>
      <footer className={styles.footer}>Prices from the Switcheo feed. Balances and swaps are simulated.</footer>
    </div>
  );
};

export default App;
