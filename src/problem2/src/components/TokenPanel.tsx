import { useId, type ChangeEvent, type ReactNode, type Ref } from 'react';
import type { Token } from '../api/prices';
import { parseAmount } from '../lib/amount';
import { formatTokenAmount, formatUsd } from '../lib/format';
import { ChevronDownIcon } from './Icons';
import TokenIcon from './TokenIcon';
import styles from './TokenPanel.module.css';

interface TokenPanelProps {
  label: string;
  pickerLabel: string;
  token: Token;
  amount: string;
  balance: number;
  invalid?: boolean;
  triggerRef: Ref<HTMLButtonElement>;
  picker?: ReactNode;
  onAmountChange: (value: string) => void;
  onTokenClick: () => void;
  onMax?: () => void;
}

const getAmountSize = (amount: string) => {
  if (amount.length > 11) {
    return 'small';
  }
  if (amount.length > 8) {
    return 'medium';
  }
  return 'large';
};

const TokenPanel = ({
  label,
  pickerLabel,
  token,
  amount,
  balance,
  invalid = false,
  triggerRef,
  picker,
  onAmountChange,
  onTokenClick,
  onMax,
}: TokenPanelProps) => {
  const inputId = useId();
  const valueId = useId();
  const balanceId = useId();
  const valueUsd = parseAmount(amount) * token.priceUsd;

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => onAmountChange(event.target.value);

  return (
    <div className={styles.panel} data-invalid={invalid || undefined}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <div className={styles.row}>
        <input
          id={inputId}
          className={styles.amount}
          data-size={getAmountSize(amount)}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="0"
          value={amount}
          onChange={handleAmountChange}
          aria-invalid={invalid}
          aria-describedby={`${valueId} ${balanceId}`}
        />
        <div className={styles.tokenField}>
          <button
            type="button"
            ref={triggerRef}
            className={styles.token}
            onClick={onTokenClick}
            aria-haspopup="listbox"
            aria-expanded={Boolean(picker)}
            aria-label={`${pickerLabel}, ${token.symbol} selected`}
          >
            <TokenIcon token={token} size={20} />
            <span className={styles.symbol}>{token.symbol}</span>
            <ChevronDownIcon className={styles.chevron} />
          </button>
          {picker}
        </div>
      </div>
      <div className={styles.meta}>
        <span id={valueId} className={styles.value} data-empty={valueUsd === 0 || undefined}>
          {valueUsd > 0 ? `≈ ${formatUsd(valueUsd)}` : formatUsd(0)}
        </span>
        <span className={styles.balance}>
          <span id={balanceId}>
            <span className={styles.balanceLabel} aria-hidden="true">
              Bal
            </span>
            <span className="visually-hidden">Balance:</span> {formatTokenAmount(balance)}
          </span>
          {onMax && balance > 0 && (
            <button type="button" className={styles.max} onClick={onMax}>
              Max
            </button>
          )}
        </span>
      </div>
    </div>
  );
};

export default TokenPanel;
