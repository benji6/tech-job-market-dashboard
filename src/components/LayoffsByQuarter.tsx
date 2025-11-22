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
import layoffsQuarterlyFyiData from "../data/layoffs-quarterly-fyi.json";
import layoffsMonthlyTrueupData from "../data/layoffs-monthly-trueup.json";
import { defaultDict, integerFormatter } from "../utils";

let layoffsTrueupByQuarter = defaultDict(() => 0);
for (const item of layoffsMonthlyTrueupData) {
  const [year, month] = item.date.split("-");
  const quarter = `Q${Math.floor((parseInt(month) - 1) / 3) + 1}`;
  layoffsTrueupByQuarter[`${year}-${quarter}`] += item.value;
}
layoffsTrueupByQuarter = { ...layoffsTrueupByQuarter };

const EMA_PERIOD = 4;
const k = 2 / (EMA_PERIOD + 1);
const layoffsData: {
  period: string;
  fyi: number;
  trueup: number | undefined;
  average: number | undefined;
  ema: number | undefined;
}[] = [];
for (let i = 0; i < layoffsQuarterlyFyiData.length; i++) {
  const item = layoffsQuarterlyFyiData[i];
  const fyi = item.value;
  const trueup: number | undefined = layoffsTrueupByQuarter[item.date];
  const average = trueup === undefined ? undefined : (item.value + trueup) / 2;
  const lastEma = i ? layoffsData[i - 1].ema : undefined;
  const emaBase = average ?? fyi;
  layoffsData.push({
    period: item.date,
    fyi,
    trueup,
    average,
    ema: lastEma === undefined ? emaBase : emaBase * k + lastEma * (1 - k),
  });
}

export default function LayoffsByQuarter() {
  return (
    <>
      <h2>Layoffs by quarter</h2>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={layoffsData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" angle={-45} textAnchor="end" height={80} />
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
                  : "Moving average",
            ]}
          />
          <Legend />
          <Bar dataKey="trueup" fill="#ff6b6b" name="trueup" />
          <Bar dataKey="fyi" fill="#9b59b6" name="Layoffs.fyi" />
          <Line
            dataKey="ema"
            dot={{ fill: "#4ecdc4" }}
            name="4-quarter exponential moving average (using average of all available data points)"
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
