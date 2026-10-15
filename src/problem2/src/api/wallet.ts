import { roundAmount } from '../lib/amount';

export type Balances = Readonly<Record<string, number>>;

export interface SwapOrder {
  paySymbol: string;
  payAmount: number;
  receiveSymbol: string;
  receiveAmount: number;
}

const SWAP_DELAY_MS = 1500;

export const DEMO_BALANCES: Balances = {
  ETH: 1.25,
  USDC: 2400,
  SWTH: 185000,
  ATOM: 42,
  WBTC: 0.035,
  OSMO: 310,
};

export const getBalance = (balances: Balances, symbol: string) => balances[symbol] ?? 0;

export const getSettledBalances = (balances: Balances, order: SwapOrder): Balances => ({
  ...balances,
  [order.paySymbol]: roundAmount(Math.max(0, getBalance(balances, order.paySymbol) - order.payAmount)),
  [order.receiveSymbol]: roundAmount(getBalance(balances, order.receiveSymbol) + order.receiveAmount),
});

export const submitSwap = (order: SwapOrder) =>
  new Promise<SwapOrder>(resolve => {
    setTimeout(() => resolve(order), SWAP_DELAY_MS);
  });
