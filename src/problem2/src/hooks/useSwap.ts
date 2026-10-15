import { useReducer } from 'react';
import type { Token } from '../api/prices';
import {
  DEMO_BALANCES,
  getBalance,
  getSettledBalances,
  submitSwap,
  type Balances,
  type SwapOrder,
} from '../api/wallet';
import { convertAmount, formatAmountInput, parseAmount, sanitizeAmountInput } from '../lib/amount';

export type Side = 'pay' | 'receive';

export type SwapStatus = 'empty' | 'too-small' | 'insufficient' | 'ready' | 'submitting';

interface SwapState {
  pay: Token;
  receive: Token;
  amount: string;
  exactSide: Side;
  balances: Balances;
  submitting: boolean;
  flips: number;
}

type SwapAction =
  | { type: 'amountChanged'; side: Side; value: string }
  | { type: 'tokenSelected'; side: Side; token: Token }
  | { type: 'flipped' }
  | { type: 'submitted' }
  | { type: 'settled'; order: SwapOrder }
  | { type: 'failed' };

const DEFAULT_PAY = 'ETH';
const DEFAULT_RECEIVE = 'USDC';

const getInitialState = (tokens: Token[]): SwapState => {
  const pay = tokens.find(t => t.symbol === DEFAULT_PAY) ?? tokens[0];
  const others = tokens.filter(t => t.symbol !== pay.symbol);
  const receive = others.find(t => t.symbol === DEFAULT_RECEIVE) ?? others[0];
  return { pay, receive, amount: '', exactSide: 'pay', balances: DEMO_BALANCES, submitting: false, flips: 0 };
};

const getFlippedState = (state: SwapState): SwapState => ({
  ...state,
  pay: state.receive,
  receive: state.pay,
  exactSide: state.exactSide === 'pay' ? 'receive' : 'pay',
  flips: state.flips + 1,
});

const swapReducer = (state: SwapState, action: SwapAction): SwapState => {
  switch (action.type) {
    case 'amountChanged':
      return { ...state, amount: action.value, exactSide: action.side };
    case 'tokenSelected': {
      const other = action.side === 'pay' ? state.receive : state.pay;
      if (action.token.symbol === other.symbol) {
        return getFlippedState(state);
      }
      return action.side === 'pay' ? { ...state, pay: action.token } : { ...state, receive: action.token };
    }
    case 'flipped':
      return getFlippedState(state);
    case 'submitted':
      return { ...state, submitting: true };
    case 'settled':
      return { ...state, submitting: false, amount: '', balances: getSettledBalances(state.balances, action.order) };
    case 'failed':
      return { ...state, submitting: false };
  }
};

const getCounterAmount = ({ amount, exactSide, pay, receive }: SwapState) => {
  const typed = parseAmount(amount);
  if (typed === 0) {
    return '';
  }
  const converted =
    exactSide === 'pay'
      ? convertAmount(typed, pay.priceUsd, receive.priceUsd)
      : convertAmount(typed, receive.priceUsd, pay.priceUsd);
  return formatAmountInput(converted) || '0';
};

const getStatus = (payAmount: number, receiveAmount: number, payBalance: number, submitting: boolean): SwapStatus => {
  if (submitting) {
    return 'submitting';
  }
  if (payAmount === 0 && receiveAmount === 0) {
    return 'empty';
  }
  if (payAmount === 0 || receiveAmount === 0) {
    return 'too-small';
  }
  if (payAmount > payBalance) {
    return 'insufficient';
  }
  return 'ready';
};

const useSwap = (tokens: Token[]) => {
  const [state, dispatch] = useReducer(swapReducer, tokens, getInitialState);
  const { pay, receive, amount, exactSide, balances, submitting, flips } = state;

  const counterAmount = getCounterAmount(state);
  const payAmount = exactSide === 'pay' ? amount : counterAmount;
  const receiveAmount = exactSide === 'receive' ? amount : counterAmount;
  const payBalance = getBalance(balances, pay.symbol);
  const receiveBalance = getBalance(balances, receive.symbol);
  const status = getStatus(parseAmount(payAmount), parseAmount(receiveAmount), payBalance, submitting);

  const changeAmount = (side: Side, raw: string) => {
    const value = sanitizeAmountInput(raw);
    if (value !== null) {
      dispatch({ type: 'amountChanged', side, value });
    }
  };

  const setMaxAmount = () => dispatch({ type: 'amountChanged', side: 'pay', value: formatAmountInput(payBalance) });

  const selectToken = (side: Side, token: Token) => dispatch({ type: 'tokenSelected', side, token });

  const flip = () => dispatch({ type: 'flipped' });

  const submit = async () => {
    if (status !== 'ready') {
      return null;
    }
    dispatch({ type: 'submitted' });
    try {
      const order = await submitSwap({
        paySymbol: pay.symbol,
        payAmount: parseAmount(payAmount),
        receiveSymbol: receive.symbol,
        receiveAmount: parseAmount(receiveAmount),
      });
      dispatch({ type: 'settled', order });
      return order;
    } catch (e) {
      dispatch({ type: 'failed' });
      throw e;
    }
  };

  return {
    pay,
    receive,
    payAmount,
    receiveAmount,
    payBalance,
    receiveBalance,
    balances,
    status,
    flips,
    changeAmount,
    setMaxAmount,
    selectToken,
    flip,
    submit,
  };
};

export default useSwap;
