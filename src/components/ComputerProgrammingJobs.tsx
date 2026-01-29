import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { compactIntegerFormatter } from "../utils";
import computerProgrammingJobs from "../data/computer-programming-jobs.json";
import { COLOR } from "../constants";

const chartData = computerProgrammingJobs.map((d) => ({
  date: new Date(d.date).getTime(),
  employees: Number(d.thousandEmplyees) * 1e3,
}));

export default function ComputerProgrammingJobs() {
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [indexToMarch2020, setIndexToMarch2020] = useState(true);

  const filteredData = showFullHistory
    ? chartData
    : chartData.filter((d) => d.date >= new Date("2020-02-01").getTime());

  const march2020Value = chartData.find((d) =>
    new Date(d.date).toISOString().startsWith("2020-03"),
  )?.employees;

  const displayData =
    indexToMarch2020 && march2020Value
      ? filteredData.map((d) => ({
          ...d,
          employees: (d.employees / march2020Value) * 100,
        }))
      : filteredData;

  const yDomain: [number | "auto", number | "auto"] = indexToMarch2020
    ? ["auto", "auto"]
    : showFullHistory
      ? [0, "auto"]
      : ["auto", "auto"];

  return (
    <div>
      <h2>UK computer programming employment</h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={displayData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(date) => {
              const d = new Date(date);
              return d.toLocaleDateString("en-GB", {
                year: "numeric",
              });
            }}
            minTickGap={50}
          />
          <YAxis
            domain={yDomain}
            label={{
              value: indexToMarch2020
                ? "Index (March 2020 = 100)"
                : "Employees",
              angle: -90,
              dx: -30,
            }}
            tickFormatter={(value) =>
              indexToMarch2020
                ? value.toFixed(0)
                : compactIntegerFormatter.format(value)
            }
          />
          <Tooltip
            labelFormatter={(date) => {
              const d = new Date(date);
              return d.toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              });
            }}
            formatter={(value) => [
              indexToMarch2020
                ? Number(value).toFixed(1)
                : compactIntegerFormatter.format(Number(value)),
              indexToMarch2020 ? "Index" : "Employees",
            ]}
          />
          <Line
            dataKey="employees"
            dot={false}
            name="Employees"
            stroke={COLOR.primary}
            strokeWidth={2}
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
          checked={indexToMarch2020}
          onChange={(e) => setIndexToMarch2020(e.target.checked)}
        />
        Index to March 2020 = 100
      </label>
      <details>
        <summary>Sources</summary>
        <ul>
          <li>
            <a
              href="https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandemployeetypes/datasets/employeejobsbyindustryjobs03"
              target="_blank"
            >
              ONS Employee jobs by industry
            </a>
          </li>
        </ul>
      </details>
    </div>
  );
}
