import jobPostingsData from "./data/job-postings-index.json";
import { calculateEma } from "./exponentialMovingAverage";

const aggregatedPostingsData: { date: string; value: number; ema: number }[] =
  [];
for (let i = 0; i < jobPostingsData.length; i++) {
  const item = jobPostingsData[i];
  aggregatedPostingsData.push({
    date: item.dateString,
    value: item.value,
    ema: calculateEma(
      item.value,
      item.dateString,
      aggregatedPostingsData[i - 1],
    ),
  });
}

export default aggregatedPostingsData;
