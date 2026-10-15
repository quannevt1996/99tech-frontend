const MAX_FRACTION_DIGITS = 8;

const inputFormatter = new Intl.NumberFormat('en-US', {
  useGrouping: false,
  maximumFractionDigits: MAX_FRACTION_DIGITS,
  roundingMode: 'trunc',
});

const GROUPED_NUMBER = /^[1-9]\d{0,2}(,\d{3})+(\.\d*)?$/;

const normalizeSeparators = (raw: string) => {
  if (!raw.includes(',')) {
    return raw;
  }
  if (GROUPED_NUMBER.test(raw)) {
    return raw.replace(/,/g, '');
  }
  if (!raw.includes('.') && raw.indexOf(',') === raw.lastIndexOf(',')) {
    return raw.replace(',', '.');
  }
  return null;
};

export const sanitizeAmountInput = (raw: string) => {
  if (/[^\d.,\s]/.test(raw)) {
    return null;
  }
  const cleaned = normalizeSeparators(raw.replace(/\s/g, ''));
  if (cleaned === null) {
    return null;
  }
  const [whole = '', ...rest] = cleaned.split('.');
  const integer = whole.replace(/^0+(?=\d)/, '');
  if (rest.length === 0) {
    return integer;
  }
  const fraction = rest.join('').slice(0, MAX_FRACTION_DIGITS);
  return `${integer || '0'}.${fraction}`;
};

export const parseAmount = (value: string) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
};

export const formatAmountInput = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return '';
  }
  return inputFormatter.format(value);
};

export const convertAmount = (amount: number, fromPriceUsd: number, toPriceUsd: number) =>
  (amount * fromPriceUsd) / toPriceUsd;

export const roundAmount = (value: number) => Number(value.toFixed(MAX_FRACTION_DIGITS));
