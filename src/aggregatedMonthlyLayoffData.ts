import layoffsMonthlyTrueupData from "./data/layoffs-monthly-trueup.json";
import layoffsMonthlyFyiData from "./data/layoffs-monthly-fyi.json";
import { defaultDict, sum } from "./utils";
import { calculateEma } from "./exponentialMovingAverage";

const layoffsFyiByMonth = defaultDict(() => 0);
for (const { date, value } of layoffsMonthlyFyiData)
  layoffsFyiByMonth[date] = value;

let monthlyTrueupByDate: Record<string, number> = {};
for (const item of layoffsMonthlyTrueupData) {
  monthlyTrueupByDate[item.date] = item.value;
}
monthlyTrueupByDate = { ...monthlyTrueupByDate };

const totalTrueupLayoffs = sum(Object.values(monthlyTrueupByDate));

let totalFyiLayoffsOverlappingWithTrueupPeriod = 0;
for (const k of Object.keys(monthlyTrueupByDate))
  totalFyiLayoffsOverlappingWithTrueupPeriod += layoffsFyiByMonth[k];

const trueupScalingFactorForAverage =
  totalFyiLayoffsOverlappingWithTrueupPeriod / totalTrueupLayoffs;

let baseValueForIndex;
const aggregatedMonthlyLayoffData: {
  date: string;
  ema: number;
  fyi: number;
  index: number;
  indexEma: number;
  normalizedAverage: number;
  trueup: number | undefined;
}[] = [];
for (let i = 0; i < layoffsMonthlyFyiData.length; i++) {
  const item = layoffsMonthlyFyiData[i];
  const fyi = item.value;
  const trueup: number | undefined = monthlyTrueupByDate[item.date];
  const normalizedAverage =
    trueup === undefined
      ? item.value
      : (item.value + trueup * trueupScalingFactorForAverage) / 2;
  if (baseValueForIndex === undefined) baseValueForIndex = normalizedAverage;
  const ema = calculateEma(
    normalizedAverage,
    item.date,
    aggregatedMonthlyLayoffData[i - 1],
    90,
  );
  aggregatedMonthlyLayoffData.push({
    date: item.date,
    ema,
    fyi,
    index: (normalizedAverage / baseValueForIndex) * 100,
    indexEma: (ema / baseValueForIndex) * 100,
    normalizedAverage,
    trueup,
  });
}

export default aggregatedMonthlyLayoffData;
