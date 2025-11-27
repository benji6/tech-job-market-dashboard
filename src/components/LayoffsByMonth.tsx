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
import { integerFormatter } from "../utils";
import aggregatedMonthlyLayoffData from "../aggregatedMonthlyLayoffData";

export default function LayoffsByMonth() {
  return (
    <>
      <h2>Layoffs by month</h2>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={aggregatedMonthlyLayoffData}
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
