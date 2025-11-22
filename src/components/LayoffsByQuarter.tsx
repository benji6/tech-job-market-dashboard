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

const quarterlyLayoffsData = layoffsQuarterlyFyiData.map((item) => {
  const trueup = layoffsTrueupByQuarter[item.date];
  return {
    average: trueup === null ? null : (item.value + trueup) / 2,
    period: item.date,
    trueup,
    fyi: item.value,
  };
});

export default function LayoffsByQuarter() {
  return (
    <>
      <h2>Layoffs by quarter</h2>
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
    </>
  );
}
