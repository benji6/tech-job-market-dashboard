import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from "recharts";
import layoffsAnnualTrueupData from "../data/layoffs-annual-trueup.json";
import layoffsQuarterlyFyiData from "../data/layoffs-quarterly-fyi.json";
import layoffsMonthlyTrueupData from "../data/layoffs-monthly-trueup.json";
import layoffsMonthlyFyiData from "../data/layoffs-monthly-fyi.json";
import { defaultDict } from "../utils";

const integerFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});

const layoffsTrueupByYear: Record<string, number> = {};
for (const item of layoffsAnnualTrueupData)
  layoffsTrueupByYear[item.year] = item.value;

const layoffsFyiByYear = defaultDict(() => 0);
for (const item of layoffsQuarterlyFyiData)
  layoffsFyiByYear[item.date.split("-", 1)[0]] += item.value;

let layoffsTrueupByQuarter = defaultDict(() => 0);
for (const item of layoffsMonthlyTrueupData) {
  const [year, month] = item.date.split("-");
  const quarter = `Q${Math.floor((parseInt(month) - 1) / 3) + 1}`;
  layoffsTrueupByQuarter[`${year}-${quarter}`] += item.value;
}
layoffsTrueupByQuarter = { ...layoffsTrueupByQuarter };

const annualLayoffsData = layoffsAnnualTrueupData.map((item) => {
  const fyi = layoffsFyiByYear[item.year];
  return {
    average: (item.value + fyi) / 2,
    fyi,
    period: item.year,
    trueup: item.value,
  };
});

const quarterlyLayoffsData = layoffsQuarterlyFyiData.map((item) => {
  const trueup = layoffsTrueupByQuarter[item.date];
  return {
    average: trueup === null ? null : (item.value + trueup) / 2,
    period: item.date,
    trueup,
    fyi: item.value,
  };
});

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
      <h1 style={{ marginTop: "60px" }}>Tech industry layoffs</h1>
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
      <p>
        <small>
          Note that latest data is not complete yet. The trueup annual 2025 data
          is a projection.
        </small>
      </p>

      <h2 style={{ marginTop: "60px" }}>Layoffs by year</h2>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={annualLayoffsData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" angle={-45} textAnchor="end" height={80} />
          <YAxis
            label={{ value: "Layoffs", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value) => {
              if (value === null) return null;
              return integerFormatter.format(Number(value));
            }}
          />
          <Legend />
          <Bar dataKey="trueup" fill="#ff6b6b" name="trueup" />
          <Bar dataKey="fyi" fill="#9b59b6" name="Layoffs.fyi" />
          <Line
            dataKey="average"
            dot={{ fill: "#4ecdc4" }}
            name="Average"
            stroke="#4ecdc4"
            strokeDasharray="5 5"
            strokeWidth={2}
            type="monotone"
          />
        </ComposedChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: "60px" }}>Layoffs by quarter</h2>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={quarterlyLayoffsData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" angle={-45} textAnchor="end" height={80} />
          <YAxis
            label={{ value: "Layoffs", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value, _, props) => {
              if (value === null) return null;
              return [
                integerFormatter.format(Number(value)),
                props.dataKey === "trueup"
                  ? "trueup"
                  : props.dataKey === "fyi"
                    ? "Layoffs.fyi"
                    : "Moving average",
              ];
            }}
          />
          <Legend />
          <Bar dataKey="trueup" fill="#ff6b6b" name="trueup" />
          <Bar dataKey="fyi" fill="#9b59b6" name="Layoffs.fyi" />
          <Line
            dataKey="average"
            dot={{ fill: "#4ecdc4" }}
            name="Average"
            stroke="#4ecdc4"
            strokeDasharray="5 5"
            strokeWidth={2}
            type="monotone"
          />
        </ComposedChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: "60px" }}>Monthly layoffs</h2>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={monthlyLayoffsData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
          <YAxis
            label={{ value: "Layoffs", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value, _, props) => {
              if (value === null) return null;
              return [
                integerFormatter.format(Number(value)),
                props.dataKey === "trueup"
                  ? "trueup"
                  : props.dataKey === "fyi"
                    ? "Layoffs.fyi"
                    : "Moving average",
              ];
            }}
          />
          <Legend />
          <Bar dataKey="trueup" fill="#ff6b6b" name="trueup" />
          <Bar dataKey="fyi" fill="#9b59b6" name="Layoffs.fyi" />
          <Line
            dataKey="ema"
            dot={{ fill: "#4ecdc4" }}
            name="3-month exponential moving average (using average of all available data points)"
            stroke="#4ecdc4"
            strokeDasharray="5 5"
            strokeWidth={2}
            type="monotone"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
}
