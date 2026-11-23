import jobPostingsData from "./data/job-postings-index.json";
import { calculateEma } from "./exponentialMovingAverage";

const sumByMonth = new Map<string, number>();
const countByMonth = new Map<string, number>();

for (const item of jobPostingsData) {
  const monthKey = item.dateString.slice(0, 7);
  sumByMonth.set(monthKey, (sumByMonth.get(monthKey) ?? 0) + item.value);
  countByMonth.set(monthKey, (countByMonth.get(monthKey) ?? 0) + 1);
}

const monthKeys = Array.from(sumByMonth.keys()).sort();

const aggregatedMonthlyPostingsData: {
  date: string;
  value: number;
  ema: number;
}[] = [];
for (let i = 0; i < monthKeys.length; i++) {
  const monthKey = monthKeys[i];
  const sum = sumByMonth.get(monthKey) ?? 0;
  const count = countByMonth.get(monthKey) ?? 0;
  const value = count ? sum / count : 0;

  aggregatedMonthlyPostingsData.push({
    date: `${monthKey}-01`,
    value,
    ema: calculateEma(
      value,
      `${monthKey}-01`,
      aggregatedMonthlyPostingsData[i - 1],
    ),
  });
}

export default aggregatedMonthlyPostingsData;
