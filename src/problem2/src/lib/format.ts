const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const usdPrecise = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 });
const usdPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 4 });

const tokenFormatters = {
  tiny: new Intl.NumberFormat('en-US', { maximumSignificantDigits: 4, roundingMode: 'trunc' }),
  small: new Intl.NumberFormat('en-US', { maximumFractionDigits: 6, roundingMode: 'trunc' }),
  medium: new Intl.NumberFormat('en-US', { maximumFractionDigits: 4, roundingMode: 'trunc' }),
  large: new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, roundingMode: 'trunc' }),
};

const getTokenFormatter = (value: number) => {
  const size = Math.abs(value);
  if (size < 0.001) {
    return tokenFormatters.tiny;
  }
  if (size < 1) {
    return tokenFormatters.small;
  }
  if (size < 10_000) {
    return tokenFormatters.medium;
  }
  return tokenFormatters.large;
};

export const formatUsd = (value: number) => (value > 0 && value < 0.01 ? usdPrecise : usd).format(value);

export const formatPrice = (value: number) => (value < 1 ? usdPrice : usd).format(value);

export const formatTokenAmount = (value: number) => (value === 0 ? '0' : getTokenFormatter(value).format(value));
