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

export default function JobPostings() {
  return (
    <>
      <h1>UK software development job postings index</h1>
      <p>
        Source:{" "}
        <a href="https://data.indeed.com/#/postings" target="_blank">
          Indeed
        </a>
      </p>
      <p>
        <small>
          See also:{" "}
          <a href="https://www.trueup.io/job-trend" target="_blank">
            trueup
          </a>
        </small>
      </p>
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
              value: "Index Value",
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
              props.dataKey === "value"
                ? "Job postings index"
                : "Moving average",
            ]}
          />
          <Legend />
          <Line
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            name="Job postings index"
          />
          <Line
            type="monotone"
            dataKey="ema"
            stroke="#4ecdc4"
            strokeWidth={2}
            dot={false}
            name="90-day expoenential moving average"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
