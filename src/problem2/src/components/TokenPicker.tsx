import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { compareSymbols, type Token } from '../api/prices';
import { getBalance, type Balances } from '../api/wallet';
import { formatPrice, formatTokenAmount, formatUsd } from '../lib/format';
import { CheckIcon } from './Icons';
import TokenIcon from './TokenIcon';
import styles from './TokenPicker.module.css';

interface TokenPickerProps {
  tokens: Token[];
  balances: Balances;
  selectedSymbol: string;
  anchorRef: RefObject<HTMLButtonElement | null>;
  onSelect: (token: Token) => void;
  onClose: () => void;
}

interface TokenOptionProps {
  id: string;
  token: Token;
  balance: number;
  active: boolean;
  current: boolean;
  onHover: () => void;
  onSelect: () => void;
}

const getRankedTokens = (tokens: Token[], balances: Balances) =>
  [...tokens].sort((a, b) => {
    const difference = getBalance(balances, b.symbol) * b.priceUsd - getBalance(balances, a.symbol) * a.priceUsd;
    return difference === 0 ? compareSymbols(a.symbol, b.symbol) : difference;
  });

const getSelectedIndex = (tokens: Token[], symbol: string) => {
  const index = tokens.findIndex(t => t.symbol === symbol);
  return index === -1 ? 0 : index;
};

const getMatches = (tokens: Token[], query: string) => {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return tokens;
  }
  const prefixed = tokens.filter(t => t.symbol.toLowerCase().startsWith(needle));
  const contained = tokens.filter(t => !prefixed.includes(t) && t.symbol.toLowerCase().includes(needle));
  return [...prefixed, ...contained];
};

const TokenOption = ({ id, token, balance, active, current, onHover, onSelect }: TokenOptionProps) => (
  <li
    id={id}
    className={styles.option}
    role="option"
    aria-selected={active}
    data-current={current || undefined}
    onMouseMove={onHover}
    onMouseDown={e => e.preventDefault()}
    onClick={onSelect}
  >
    <TokenIcon token={token} size={24} />
    <span className={styles.name}>
      <span className={styles.symbol}>{token.symbol}</span>
      <span className={styles.price}>{formatPrice(token.priceUsd)}</span>
    </span>
    {balance > 0 && (
      <span className={styles.holding}>
        <span className={styles.balance}>{formatTokenAmount(balance)}</span>
        <span className={styles.worth}>{formatUsd(balance * token.priceUsd)}</span>
      </span>
    )}
    <CheckIcon className={styles.check} />
  </li>
);

const TokenPicker = ({ tokens, balances, selectedSymbol, anchorRef, onSelect, onClose }: TokenPickerProps) => {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const ranked = useMemo(() => getRankedTokens(tokens, balances), [tokens, balances]);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(() => getSelectedIndex(ranked, selectedSymbol));
  const matches = useMemo(() => getMatches(ranked, query), [ranked, query]);
  const activeToken = matches.at(activeIndex);
  const getOptionId = (symbol: string) => `${listId}-${symbol}`;
  const activeOptionId = activeToken ? getOptionId(activeToken.symbol) : undefined;

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!rootRef.current?.contains(target) && !anchorRef.current?.contains(target)) {
        onClose();
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [anchorRef, onClose]);

  useEffect(() => {
    if (activeOptionId) {
      document.getElementById(activeOptionId)?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeOptionId]);

  const handleSelect = (token: Token) => {
    onSelect(token);
    anchorRef.current?.focus();
  };

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex(prev => Math.max(0, Math.min(prev + step, matches.length - 1)));
    } else if (e.key === 'Enter' && activeToken) {
      e.preventDefault();
      handleSelect(activeToken);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      anchorRef.current?.focus();
    } else if (e.key === 'Tab') {
      onClose();
    }
  };

  return (
    <div ref={rootRef} className={styles.dropdown}>
      <div className={styles.search}>
        <span className={styles.prompt} aria-hidden="true">
          &gt;
        </span>
        <input
          ref={searchRef}
          className={styles.searchInput}
          type="text"
          role="combobox"
          aria-label="Search tokens"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId}
          placeholder="Search by symbol"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <ul id={listId} className={styles.list} role="listbox" aria-label="Tokens">
        {matches.map((token, index) => (
          <TokenOption
            key={token.symbol}
            id={getOptionId(token.symbol)}
            token={token}
            balance={getBalance(balances, token.symbol)}
            active={index === activeIndex}
            current={token.symbol === selectedSymbol}
            onHover={() => setActiveIndex(index)}
            onSelect={() => handleSelect(token)}
          />
        ))}
      </ul>
      {matches.length === 0 && <p className={styles.empty}>No tokens match "{query.trim()}"</p>}
    </div>
  );
};

export default TokenPicker;
