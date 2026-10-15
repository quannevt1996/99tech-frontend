const PRICES_URL = 'https://interview.switcheo.com/prices.json';

const ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

const ICON_ALIASES: Readonly<Record<string, string>> = {
  RATOM: 'rATOM',
  STATOM: 'stATOM',
  STEVMOS: 'stEVMOS',
  STLUNA: 'stLUNA',
  STOSMO: 'stOSMO',
};

interface PriceRow {
  currency: string;
  date: string;
  price: number;
}

export interface Token {
  symbol: string;
  priceUsd: number;
  iconUrl: string;
}

interface LatestPrice {
  price: number;
  time: number;
}

const getIconUrl = (symbol: string) => `${ICON_BASE_URL}/${ICON_ALIASES[symbol] ?? symbol}.svg`;

const isUsableRow = (row: unknown): row is PriceRow => {
  if (typeof row !== 'object' || row === null) {
    return false;
  }
  const { currency, date, price } = row as Partial<Record<keyof PriceRow, unknown>>;
  return (
    typeof currency === 'string' &&
    currency.length > 0 &&
    typeof date === 'string' &&
    !Number.isNaN(Date.parse(date)) &&
    typeof price === 'number' &&
    Number.isFinite(price) &&
    price > 0
  );
};

export const compareSymbols = (a: string, b: string) => a.localeCompare(b, 'en', { sensitivity: 'base' });

const getTokens = (rows: unknown): Token[] => {
  if (!Array.isArray(rows)) {
    return [];
  }

  const latest = new Map<string, LatestPrice>();
  for (const row of rows) {
    if (!isUsableRow(row)) {
      continue;
    }
    const time = Date.parse(row.date);
    const current = latest.get(row.currency);
    if (!current || time >= current.time) {
      latest.set(row.currency, { price: row.price, time });
    }
  }

  return [...latest]
    .map(([symbol, { price }]) => ({ symbol, priceUsd: price, iconUrl: getIconUrl(symbol) }))
    .sort((a, b) => compareSymbols(a.symbol, b.symbol));
};

export const fetchTokens = async (signal?: AbortSignal): Promise<Token[]> => {
  const res = await fetch(PRICES_URL, { signal });
  if (!res.ok) {
    throw new Error(`Price feed responded with ${res.status}`);
  }
  const tokens = getTokens(await res.json());
  if (tokens.length < 2) {
    throw new Error('Price feed did not return enough priced tokens');
  }
  return tokens;
};
