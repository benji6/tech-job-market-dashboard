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
    <div>
      <h2>Layoffs by month</h2>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={aggregatedMonthlyLayoffData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
          <YAxis
            label={{
              value: "Layoffs",
              angle: -90,
              dx: -40,
            }}
          />
          <Tooltip
            formatter={(value, _, props) => [
              integerFormatter.format(Number(value)),
              props.dataKey === "trueup"
                ? "trueup"
                : props.dataKey === "fyi"
                  ? "Layoffs.fyi"
                  : "12-month trend",
            ]}
          />
          <Legend />
          <Bar dataKey="trueup" fill="#ff6b6b" name="trueup" />
          <Bar dataKey="fyi" fill="#9b59b6" name="Layoffs.fyi" />
          <Line
            dataKey="ema12"
            dot={false}
            name="12-month exponential moving average"
            stroke="#4ecdc4"
            strokeWidth={2}
            type="monotone"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <details>
        <summary>Sources</summary>
        <ul>
          <li>
            <a href="https://layoffs.fyi" target="_blank">
              Layoffs.fyi layoffs
            </a>
          </li>
          <li>
            <a href="https://www.trueup.io/layoffs" target="_blank">
              trueup layoffs
            </a>
          </li>
        </ul>
      </details>
    </div>
  );
}
