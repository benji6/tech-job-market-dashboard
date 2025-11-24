import layoffsAnnualTrueupData from "../data/layoffs-annual-trueup.json";
import layoffsQuarterlyFyiData from "../data/layoffs-quarterly-fyi.json";
import layoffsMonthlyTrueupData from "../data/layoffs-monthly-trueup.json";
import layoffsMonthlyFyiData from "../data/layoffs-monthly-fyi.json";
import { defaultDict } from "../utils";
import LayoffsByYear from "./LayoffsByYear";
import LayoffsByQuarter from "./LayoffsByQuarter";
import LayoffsByMonth from "./LayoffsByMonth";

const layoffsTrueupByYear: Record<string, number> = {};
for (const item of layoffsAnnualTrueupData)
  layoffsTrueupByYear[item.year] = item.value;

const layoffsFyiByYear = defaultDict(() => 0);
for (const item of layoffsQuarterlyFyiData)
  layoffsFyiByYear[item.date.split("-", 1)[0]] += item.value;

let monthlyTrueupByDate: Record<string, number> = {};
for (const item of layoffsMonthlyTrueupData) {
  monthlyTrueupByDate[item.date] = item.value;
}
monthlyTrueupByDate = { ...monthlyTrueupByDate };

const EMA_PERIOD_FOR_MONTHLY_CHART = 3;
const kMonthly = 2 / (EMA_PERIOD_FOR_MONTHLY_CHART + 1);
const monthlyLayoffsData: {
  date: string;
  fyi: number;
  trueup: number | undefined;
  average: number | undefined;
  ema: number | undefined;
}[] = [];
for (let i = 0; i < layoffsMonthlyFyiData.length; i++) {
  const item = layoffsMonthlyFyiData[i];
  const fyi = item.value;
  const trueup: number | undefined = monthlyTrueupByDate[item.date];
  const average = trueup === undefined ? undefined : (item.value + trueup) / 2;
  const lastEma = i ? monthlyLayoffsData[i - 1].ema : undefined;
  const emaBase = average ?? fyi;
  monthlyLayoffsData.push({
    date: item.date,
    fyi,
    trueup,
    average,
    ema:
      lastEma === undefined
        ? emaBase
        : emaBase * kMonthly + lastEma * (1 - kMonthly),
  });
}

export default function Layoffs() {
  return (
    <>
      <h1>Tech industry layoffs</h1>
      <p>
        Sources:{" "}
        <a href="https://layoffs.fyi" target="_blank">
          Layoffs.fyi
        </a>
        {", "}
        <a href="https://www.trueup.io/layoffs" target="_blank">
          trueup
        </a>
      </p>
      <small>
        <details>
          <summary>Notes</summary>
          <ul>
            <li>
              This is OSINT and is likely a significant underestimate, although
              it can give insight into trends.
            </li>
            <li>
              Latest data is not complete yet so the last period is likely
              understated (except the trueup annual 2025 data which is a
              projection).
            </li>
            <li>
              Trends in the quarterly and monthly chartsare computed with
              exponential moving averages. Where trueup data is available it is
              normalized to match the layoffs.fyi data within the overlapping
              period before calculating the trend.
            </li>
          </ul>
        </details>
      </small>
      <LayoffsByYear />
      <LayoffsByQuarter />
      <LayoffsByMonth />
    </>
  );
}
