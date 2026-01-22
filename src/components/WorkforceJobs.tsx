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
import { useState } from "react";
import { compactIntegerFormatter } from "../utils";
import workforceJobsInformationAndCommunication from "../data/workforce-jobs-information-and-communication.json";

const workforceData: { date: string; value: number }[] = [];
for (let i = 0; i < workforceJobsInformationAndCommunication.length; i++) {
  const item = workforceJobsInformationAndCommunication[i];
  const value = item.value * 1e3;
  workforceData.push({
    date: item.date,
    value,
  });
}

export default function WorkforceJobs() {
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [indexToMar2020, setIndexToMar2020] = useState(true);

  const mar2020Value =
    workforceData.find((item) => item.date === "2020-03")?.value || 1;

  const processedData = workforceData.map((item) => ({
    ...item,
    value: indexToMar2020 ? (item.value / mar2020Value) * 100 : item.value,
  }));

  const displayData = showFullHistory
    ? processedData
    : processedData.slice(
        processedData.findIndex((item) => item.date === "2020-03"),
      );

  return (
    <div>
      <h2>UK information and communication workforce jobs</h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={displayData}
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
            domain={showFullHistory ? [0, "auto"] : ["auto", "auto"]}
            label={{
              value: indexToMar2020 ? "Index (Mar 2020 = 100)" : "Jobs",
              angle: -90,
              dx: -40,
            }}
            tickFormatter={(value) => compactIntegerFormatter.format(value)}
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
              compactIntegerFormatter.format(Number(value)),
              props.dataKey === "value"
                ? indexToMar2020
                  ? "Index"
                  : "Jobs"
                : "Trend",
            ]}
          />
          <Legend />
          <Line
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            name={indexToMar2020 ? "Index" : "Jobs"}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
      <label>
        <input
          type="checkbox"
          checked={showFullHistory}
          onChange={(e) => setShowFullHistory(e.target.checked)}
        />
        Show full history
      </label>
      <label>
        <input
          type="checkbox"
          checked={indexToMar2020}
          onChange={(e) => setIndexToMar2020(e.target.checked)}
        />
        Index (Mar 2020 = 100)
      </label>
      <details>
        <summary>Sources</summary>
        <ul>
          <li>
            <a
              href="https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandemployeetypes/datasets/workforcejobsbyindustryjobs08"
              target="_blank"
            >
              ONS Workforce jobs by industry
            </a>
          </li>
        </ul>
      </details>
    </div>
  );
}
