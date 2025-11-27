import layoffsMonthlyTrueupData from "./data/layoffs-monthly-trueup.json";
import layoffsMonthlyFyiData from "./data/layoffs-monthly-fyi.json";
import { defaultDict, sum } from "./utils";

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

const k3 = 2 / (3 + 1);
const k12 = 2 / (12 + 1);
let baseValueForIndex;
const aggregatedMonthlyLayoffData: {
  date: string;
  ema12: number;
  ema3: number;
  fyi: number;
  index: number;
  indexEma3: number;
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
  const lastEma3 = i ? aggregatedMonthlyLayoffData[i - 1].ema3 : undefined;
  const lastEma12 = i ? aggregatedMonthlyLayoffData[i - 1].ema12 : undefined;
  const ema3 =
    lastEma3 === undefined
      ? normalizedAverage
      : normalizedAverage * k3 + lastEma3 * (1 - k3);
  aggregatedMonthlyLayoffData.push({
    date: item.date,
    ema3,
    ema12:
      lastEma12 === undefined
        ? normalizedAverage
        : normalizedAverage * k12 + lastEma12 * (1 - k12),
    fyi,
    index: (normalizedAverage / baseValueForIndex) * 100,
    indexEma3: (ema3 / baseValueForIndex) * 100,
    normalizedAverage,
    trueup,
  });
}

export default aggregatedMonthlyLayoffData;
