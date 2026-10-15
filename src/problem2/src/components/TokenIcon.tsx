import { useState } from 'react';
import type { Token } from '../api/prices';
import styles from './TokenIcon.module.css';

interface TokenIconProps {
  token: Token;
  size?: number;
}

const getInitials = (symbol: string) => symbol.slice(0, 2).toUpperCase();

const TokenIcon = ({ token, size = 28 }: TokenIconProps) => {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (failedUrl === token.iconUrl) {
    return (
      <span
        className={styles.fallback}
        style={{
          width: size,
          height: size,
          fontSize: Math.round(size * 0.4),
        }}
        aria-hidden="true"
      >
        {getInitials(token.symbol)}
      </span>
    );
  }

  return (
    <img
      className={styles.icon}
      src={token.iconUrl}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setFailedUrl(token.iconUrl)}
    />
  );
};

export default TokenIcon;
