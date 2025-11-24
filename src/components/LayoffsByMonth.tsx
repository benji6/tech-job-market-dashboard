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
import layoffsMonthlyTrueupData from "../data/layoffs-monthly-trueup.json";
import layoffsMonthlyFyiData from "../data/layoffs-monthly-fyi.json";
import { defaultDict, integerFormatter, sum } from "../utils";

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
const monthlyLayoffsData: {
  date: string;
  fyi: number;
  trueup: number | undefined;
  normalizedAverage: number | undefined;
  ema3: number;
  ema12: number;
}[] = [];
for (let i = 0; i < layoffsMonthlyFyiData.length; i++) {
  const item = layoffsMonthlyFyiData[i];
  const fyi = item.value;
  const trueup: number | undefined = monthlyTrueupByDate[item.date];
  const normalizedAverage =
    trueup === undefined
      ? undefined
      : (item.value + trueup * trueupScalingFactorForAverage) / 2;
  const lastEma3 = i ? monthlyLayoffsData[i - 1].ema3 : undefined;
  const lastEma12 = i ? monthlyLayoffsData[i - 1].ema12 : undefined;
  const emaBase = normalizedAverage ?? fyi;
  monthlyLayoffsData.push({
    date: item.date,
    fyi,
    trueup,
    normalizedAverage,
    ema3: lastEma3 === undefined ? emaBase : emaBase * k3 + lastEma3 * (1 - k3),
    ema12:
      lastEma12 === undefined ? emaBase : emaBase * k12 + lastEma12 * (1 - k12),
  });
}

export default function LayoffsByMonth() {
  return (
    <>
      <h2>Layoffs by month</h2>
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
            formatter={(value, _, props) => [
              integerFormatter.format(Number(value)),
              props.dataKey === "trueup"
                ? "trueup"
                : props.dataKey === "fyi"
                  ? "Layoffs.fyi"
                  : props.dataKey === "ema3"
                    ? "3-month trend"
                    : "12-month trend",
            ]}
          />
          <Legend />
          <Bar dataKey="trueup" fill="#ff6b6b" name="trueup" />
          <Bar dataKey="fyi" fill="#9b59b6" name="Layoffs.fyi" />
          <Line
            dataKey="ema12"
            dot={{ fill: "#f39c12" }}
            name="12-month exponential moving average"
            stroke="#f39c12"
            strokeDasharray="5 5"
            strokeWidth={2}
            type="monotone"
          />
          <Line
            dataKey="ema3"
            dot={{ fill: "#4ecdc4" }}
            name="3-month exponential moving average"
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
