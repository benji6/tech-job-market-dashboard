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
import layoffsMonthlyFYIData from "../data/layoffs-monthly-fyi.json";
import { defaultDict, integerFormatter } from "../utils";

const layoffsFyiByYear = defaultDict(() => 0);
for (const item of layoffsMonthlyFYIData)
  layoffsFyiByYear[item.date.split("-", 1)[0]] += item.value;

const annualLayoffsData = layoffsAnnualTrueupData.map((item) => {
  const fyi = layoffsFyiByYear[item.year];
  return {
    average: (item.value + fyi) / 2,
    fyi,
    period: item.year,
    trueup: item.value,
  };
});

export default function LayoffsByYear() {
  return (
    <>
      <h2>Layoffs by year</h2>
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
    </>
  );
}
