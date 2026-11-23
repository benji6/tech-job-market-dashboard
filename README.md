# Tech job market dashboard

[Check it out here](https://benji6.github.io/tech-job-market-dashboard)

## Trend smoothing

All exponential moving averages use a **30-day half-life**, rather than the
conventional span-based `alpha = 2 / (N + 1)`:

```text
alpha = 1 - 2^(-elapsedDays / 30)
ema = alpha * value + (1 - alpha) * previousEma
```

Each series starts at its first observed value. Alpha uses the actual elapsed
calendar days between observations: about 0.02284 for daily data and exactly 0.5
for observations 30 days apart. The previous EMA's weight halves every 30 days.
Gaps use the time since the previous available observation, without filling
missing values.

This applies to software development and all-UK job postings, monthly job postings,
layoffs, and vacancies. Monthly job postings are averaged before smoothing.
Monthly observations use the first day of their month; rolling vacancy survey
periods use the first day of their ending month (for example, `Dec-Feb 2020` uses
`2020-02-01`). Calendar month lengths therefore affect alpha. Net demand subtracts
the layoffs EMA index from the job postings EMA index, both using the same
30-day half-life.
