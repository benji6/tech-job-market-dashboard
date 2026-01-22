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
import { integerFormatter } from "../utils";
import computerProgrammingJobs from "../data/computer-programming-jobs.json";

const chartData = computerProgrammingJobs.map((d) => ({
  date: new Date(d.date).getTime(),
  employees: Number(d.thousandEmplyees),
}));

export default function ComputerProgrammingJobs() {
  const [showFullHistory, setShowFullHistory] = useState(false);

  const displayData = showFullHistory
    ? chartData
    : chartData.filter((d) => d.date >= new Date("2019-12-01").getTime());

  const yDomain: [number | "auto", number | "auto"] = showFullHistory
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
              value: "Employees (thousands)",
              angle: -90,
              dx: -30,
            }}
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
              integerFormatter.format(Number(value)) + "k",
              "Employees",
            ]}
          />
          <Line
            dataKey="employees"
            dot={false}
            name="Employees (thousands)"
            stroke="#8884d8"
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
