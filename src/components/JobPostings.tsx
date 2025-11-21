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
import jobPostingsData from "../data/job-postings-index.json";

export default function JobPostings() {
  const chartData = jobPostingsData.map((item) => ({
    date: item.dateString,
    value: item.value,
  }));

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
          data={chartData}
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
            label={{ value: "Index Value", angle: -90, position: "insideLeft" }}
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
            formatter={(value: number) => [value.toFixed(2), "Index"]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            name="Job Postings Index"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
