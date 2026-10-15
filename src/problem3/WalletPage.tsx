import { useMemo } from 'react';
import { Box, BoxProps } from '@mui/material';
import { usePrices, useWalletBalances } from './hooks';
import WalletRow from './WalletRow';
import classes from './WalletPage.module.css';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

const UNKNOWN_PRIORITY = -99;

const BLOCKCHAIN_PRIORITY: Partial<Record<string, number>> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const amountFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 });

const getPriority = (blockchain: string) => BLOCKCHAIN_PRIORITY[blockchain] ?? UNKNOWN_PRIORITY;

const getVisibleBalances = (balances: WalletBalance[]): FormattedWalletBalance[] =>
  balances
    .map(balance => ({ balance, priority: getPriority(balance.blockchain) }))
    .filter(({ balance, priority }) => priority > UNKNOWN_PRIORITY && balance.amount > 0)
    .sort((lhs, rhs) => rhs.priority - lhs.priority)
    .map(({ balance }) => ({ ...balance, formatted: amountFormatter.format(balance.amount) }));

const WalletPage = ({ children, ...rest }: BoxProps) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const visibleBalances = useMemo(() => getVisibleBalances(balances), [balances]);

  return (
    <Box {...rest}>
      {visibleBalances.length === 0 && <p className={classes.empty}>No balances yet</p>}
      {visibleBalances.map(balance => (
        <WalletRow
          key={`${balance.blockchain}-${balance.currency}`}
          className={classes.row}
          amount={balance.amount}
          usdValue={(prices[balance.currency] ?? 0) * balance.amount}
          formattedAmount={balance.formatted}
        />
      ))}
      {children}
    </Box>
  );
};

export default WalletPage;
