# Problem 2

Currency swap form. Vite + React + TypeScript, no UI library.

Live demo: https://quannevt1996.github.io/99tech-frontend/

```
npm install
npm run dev
```

Open http://localhost:5173. `npm run build` makes a production build. Needs Node 20.19+.

## What it does

- Prices come from the Switcheo feed. Tokens without a price are left out.
- Type in either field and the other one is calculated from the rate.
- Pick a token from a searchable dropdown (arrow keys and Enter work). Picking the token that's already on the other side flips them.
- Max fills your whole balance, and the arrow button swaps the two sides.
- The swap button says what's missing: "Enter an amount", "Insufficient ETH balance". Letters and other junk can't be typed into the amounts.
- Swapping shows a loading state for 1.5s, then a confirmation, and the demo balances update.
- If the price feed fails, there's an error screen with a retry.

## Notes

- The feed has duplicates (BUSD twice with the same timestamp, USDC four times). I keep the latest row per currency.
- Some icons use a lowercase prefix (stATOM, rATOM, ...), so there's a small alias map, and a letter badge if an icon still fails to load.
- Pasting "185,000" works because it's a properly grouped number. A single comma like "0,5" is treated as a decimal point.
- Balances and the swap are mocked.
- Amounts are plain JS numbers. A real app should use bigint with the token decimals.
