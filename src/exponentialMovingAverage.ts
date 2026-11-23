const HALF_LIFE_DAYS = 30;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export const calculateEma = (
  value: number,
  date: string,
  previous?: { date: string; ema: number },
): number => {
  if (!previous) return value;

  const elapsedDays =
    (Date.parse(date) - Date.parse(previous.date)) / MILLISECONDS_PER_DAY;
  const alpha = 1 - 2 ** (-elapsedDays / HALF_LIFE_DAYS);
  return value * alpha + previous.ema * (1 - alpha);
};
