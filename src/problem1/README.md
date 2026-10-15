# Problem 1

- `sum_to_n_a`: loop, O(n)
- `sum_to_n_b`: formula `n * (n + 1) / 2`, O(1)
- `sum_to_n_c`: recursion that halves n, O(log n). `1..2k` is the odd numbers (`k * k`) plus the even numbers (`2 * sum(1..k)`). Normal `n + sum(n - 1)` recursion hits the max call stack around n = 8000.

Assumption: for negative n I sum from n to 0, so `sum_to_n(-5) = -15`.
