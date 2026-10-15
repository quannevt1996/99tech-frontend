const sum_to_n_a = n => {
  let sum = 0;
  for (let i = 1; i <= Math.abs(n); i++) {
    sum += i;
  }
  return n < 0 ? -sum : sum;
};

const sum_to_n_b = n => {
  const sum = (Math.abs(n) * (Math.abs(n) + 1)) / 2;
  return n < 0 ? -sum : sum;
};

const sum_to_n_c = n => {
  if (n < 0) {
    return -sum_to_n_c(-n);
  }
  if (n < 2) {
    return n;
  }
  const half = Math.floor(n / 2);
  const upToEven = 2 * sum_to_n_c(half) + half * half;
  return n % 2 === 0 ? upToEven : upToEven + n;
};
