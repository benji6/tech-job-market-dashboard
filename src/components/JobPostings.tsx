import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { integerFormatter } from "../utils";
import aggregatedPostingsData from "../aggregatedPostingsData";
import { COLOR } from "../constants";

export default function JobPostings() {
  return (
    <div>
      <h2>UK software development job postings index</h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={aggregatedPostingsData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => {
              const d = new Date(date);
              return d.toLocaleDateString("en-GB", {
                month: "short",
                year: "numeric",
              });
            }}
            minTickGap={50}
          />
          <YAxis
            label={{
              value: "Index",
              angle: -90,
              dx: -30,
            }}
          />
          <Tooltip
            labelFormatter={(date) => {
              const d = new Date(date);
              return d.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });
            }}
            formatter={(value, _, props) => [
              integerFormatter.format(Number(value)),
              props.dataKey === "value" ? "Job postings index" : "Trend",
            ]}
          />
          <Legend />
          <Line
            dataKey="value"
            stroke={COLOR.primary}
            strokeWidth={1}
            dot={false}
            name="Job postings index"
          />
          <Line
            type="monotone"
            dataKey="ema"
            stroke={COLOR.trend}
            strokeWidth={2}
            dot={false}
            name="90-day expoenential moving average"
          />
        </LineChart>
      </ResponsiveContainer>
      <details>
        <summary>Sources</summary>
        <ul>
          <li>
            <a href="https://data.indeed.com/#/postings" target="_blank">
              Indeed job postings
            </a>
          </li>
        </ul>
      </details>
    </div>
  );
}
