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
import remoteSectorShareData from "../data/remote-sector-share.json";
import { oneDecimalPlaceFormatter } from "../utils";
import { COLOR } from "../constants";

const processedData = remoteSectorShareData.map((d) => ({
  date: d.dateString,
  value: d.value,
}));

export default function RemoteShare() {
  return (
    <div>
      <h2>UK software development remote job share (%)</h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={processedData}
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
              value: "Remote share (%)",
              angle: -90,
              dx: -30,
            }}
            domain={["auto", "auto"]}
            tickFormatter={(value) => `${value}%`}
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
            formatter={(value?: number) => [
              value === undefined
                ? undefined
                : `${oneDecimalPlaceFormatter.format(value)}%`,
              "Remote share",
            ]}
          />
          <Legend />
          <Line
            dataKey="value"
            dot={false}
            name="Percentage of job postings and searches on Indeed mentioning remote/hybrid terms"
            stroke={COLOR.primary}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      <details>
        <summary>Sources</summary>
        <ul>
          <li>
            <a href="https://data.indeed.com/#/remote" target="_blank">
              Indeed remote tracker
            </a>
          </li>
        </ul>
      </details>
    </div>
  );
}
