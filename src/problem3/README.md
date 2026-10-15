# Problem 3

Refactored version: [WalletPage.tsx](./WalletPage.tsx).

## Bugs

1. `lhsPriority` is not defined (should be `balancePriority`). It doesn't compile, and at runtime it throws as soon as there's a balance to filter.
2. The filter is inverted. It keeps `amount <= 0`, so only empty balances show. Should be `priority > -99 && amount > 0`.
3. `WalletBalance` has no `blockchain` field, but the filter and the sort read `balance.blockchain`. Doesn't compile.
4. `formattedBalances` is never used. `rows` maps `sortedBalances` but types each item as `FormattedWalletBalance` (doesn't compile), so `formatted` is always `undefined`.
5. `toFixed()` with no digits rounds to an integer: `0.75` shows as `"1"`.
6. `prices[currency]` can be missing, then `usdValue` is `NaN`. I default it to 0. If I could change `WalletRow`, I'd pass `undefined` and show "-" instead.
7. `classes` is not defined.
8. `...rest` is MUI `BoxProps` spread on a `<div>`. Normal props like `className` still work, but the MUI ones (`sx`, `p`, ...) don't: React just writes them as attributes (`sx="[object Object]"`), and camelCase ones like `alignItems` log a warning. Should be `<Box>`.
9. `children` is destructured and never rendered.

## Performance

10. `prices` is in the `useMemo` deps but not used inside, so filter + sort rerun on every price update.
11. `getPriority` runs once per item in the filter and twice per comparison in the sort. I compute it once per balance, then filter and sort on that.
12. `formattedBalances` is computed every render, then thrown away.
13. `getPriority` is recreated every render. It's pure, so I moved it outside as a lookup map.
14. `key={index}` on a sorted list. Changed to `${blockchain}-${currency}`.

## Minor

- The sort comparator returns `undefined` when priorities are equal. It works at runtime (treated as 0) but it's a type error, and `rhs - lhs` is simpler anyway.
- `getPriority(blockchain: any)`: should be `string`.
- Empty `Props` interface, and `React.FC<Props>` plus `(props: Props)` types the props twice.
- `FormattedWalletBalance` should `extends WalletBalance`.
- `-99` is a magic number.
- Mixed tabs and spaces.
- No empty state: with no balances the page renders nothing. The refactor shows a short message instead.

## Not changed on purpose

I didn't memoize `rows` or wrap `WalletRow` in `React.memo`. Rows depend on `prices`, which changes the most, so the memo would rerun almost every time. Leaving `prices` out of the deps would show stale USD values.
