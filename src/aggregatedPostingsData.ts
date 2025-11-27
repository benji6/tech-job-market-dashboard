import jobPostingsData from "./data/job-postings-index.json";

const EMA_PERIOD = 90;
const k = 2 / (EMA_PERIOD + 1);
const aggregatedPostingsData: { date: string; value: number; ema: number }[] =
  [];
for (let i = 0; i < jobPostingsData.length; i++) {
  const item = jobPostingsData[i];
  aggregatedPostingsData.push({
    date: item.dateString,
    value: item.value,
    ema: i
      ? item.value * k + aggregatedPostingsData[i - 1].ema * (1 - k)
      : item.value,
  });
}

export default aggregatedPostingsData;
