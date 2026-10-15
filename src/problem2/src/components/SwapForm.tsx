import { useCallback, useRef, useState, type FormEvent } from 'react';
import type { Token } from '../api/prices';
import type { SwapOrder } from '../api/wallet';
import useSwap, { type Side, type SwapStatus } from '../hooks/useSwap';
import { convertAmount } from '../lib/amount';
import { formatPrice, formatTokenAmount } from '../lib/format';
import { FlipIcon, RateIcon } from './Icons';
import SwapCard from './SwapCard';
import Toast, { type Notice } from './Toast';
import TokenPanel from './TokenPanel';
import TokenPicker from './TokenPicker';
import styles from './SwapForm.module.css';

interface SwapFormProps {
  tokens: Token[];
}

const getSubmitLabel = (status: SwapStatus, paySymbol: string) => {
  switch (status) {
    case 'empty':
      return 'Enter an amount';
    case 'too-small':
      return 'Amount too small';
    case 'insufficient':
      return `Insufficient ${paySymbol} balance`;
    case 'submitting':
      return 'Swapping...';
    case 'ready':
      return 'Swap';
  }
};

const getOrderSummary = (order: SwapOrder) =>
  `Swapped ${formatTokenAmount(order.payAmount)} ${order.paySymbol} for ${formatTokenAmount(order.receiveAmount)} ${order.receiveSymbol}`;

const SwapForm = ({ tokens }: SwapFormProps) => {
  const swap = useSwap(tokens);
  const [pickerSide, setPickerSide] = useState<Side | null>(null);
  const [rateInverted, setRateInverted] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const payTriggerRef = useRef<HTMLButtonElement>(null);
  const receiveTriggerRef = useRef<HTMLButtonElement>(null);

  const [base, quote] = rateInverted ? [swap.receive, swap.pay] : [swap.pay, swap.receive];
  const rate = convertAmount(1, base.priceUsd, quote.priceUsd);
  const submitting = swap.status === 'submitting';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const order = await swap.submit();
      if (!order) {
        return;
      }
      setNotice({ id: Date.now(), tone: 'success', title: 'Swap complete', message: getOrderSummary(order) });
    } catch {
      setNotice({
        id: Date.now(),
        tone: 'error',
        title: 'Swap failed',
        message: 'Nothing was moved. Please try again.',
      });
    }
  };

  const handleSelect = (token: Token) => {
    if (pickerSide) {
      swap.selectToken(pickerSide, token);
    }
    setPickerSide(null);
  };

  const handleTokenClick = (side: Side) => setPickerSide(prev => (prev === side ? null : side));

  const handleClosePicker = useCallback(() => setPickerSide(null), []);

  const handleRateToggle = () => setRateInverted(prev => !prev);

  const handleDismiss = useCallback(() => setNotice(null), []);

  const getPicker = (side: Side) =>
    pickerSide === side ? (
      <TokenPicker
        tokens={tokens}
        balances={swap.balances}
        selectedSymbol={side === 'pay' ? swap.pay.symbol : swap.receive.symbol}
        anchorRef={side === 'pay' ? payTriggerRef : receiveTriggerRef}
        onSelect={handleSelect}
        onClose={handleClosePicker}
      />
    ) : undefined;

  return (
    <SwapCard feed="ready">
      <form onSubmit={handleSubmit} noValidate>
        <fieldset className={styles.fieldset} disabled={submitting}>
          <div className={styles.panels}>
            <TokenPanel
              label="You pay"
              pickerLabel="Choose token to pay"
              token={swap.pay}
              amount={swap.payAmount}
              balance={swap.payBalance}
              invalid={swap.status === 'insufficient'}
              triggerRef={payTriggerRef}
              picker={getPicker('pay')}
              onAmountChange={value => swap.changeAmount('pay', value)}
              onTokenClick={() => handleTokenClick('pay')}
              onMax={swap.setMaxAmount}
            />
            <button
              type="button"
              className={styles.flip}
              onClick={swap.flip}
              aria-label="Switch pay and receive tokens"
            >
              <FlipIcon className={styles.flipIcon} style={{ transform: `rotate(${swap.flips * 180}deg)` }} />
            </button>
            <TokenPanel
              label="You receive"
              pickerLabel="Choose token to receive"
              token={swap.receive}
              amount={swap.receiveAmount}
              balance={swap.receiveBalance}
              triggerRef={receiveTriggerRef}
              picker={getPicker('receive')}
              onAmountChange={value => swap.changeAmount('receive', value)}
              onTokenClick={() => handleTokenClick('receive')}
            />
          </div>

          <button type="button" className={styles.rate} onClick={handleRateToggle} title="Show inverse rate">
            <span className={styles.rateLabel}>Rate</span>
            <span className={styles.rateValue}>
              1 {base.symbol} = {formatTokenAmount(rate)} {quote.symbol}
            </span>
            <span className={styles.ratePrice}>({formatPrice(base.priceUsd)})</span>
            <RateIcon className={styles.rateIcon} />
          </button>

          <button
            type="submit"
            className={styles.submit}
            data-status={swap.status}
            disabled={swap.status !== 'ready'}
            aria-busy={submitting || undefined}
          >
            {getSubmitLabel(swap.status, swap.pay.symbol)}
            {submitting && <span className={styles.cursor} aria-hidden="true" />}
            {swap.status === 'ready' && (
              <span className={styles.hint} aria-hidden="true">
                ↵
              </span>
            )}
          </button>
        </fieldset>
      </form>

      <Toast notice={notice} onDismiss={handleDismiss} />
    </SwapCard>
  );
};

export default SwapForm;
