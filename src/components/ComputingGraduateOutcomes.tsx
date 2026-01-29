import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import computingGraduateOutcomes from "../data/computing-graduate-outcomes.json";
import computerScienceGraduates from "../data/computer-science-graduates.json";
import { integerPercentageFormatter, compactIntegerFormatter } from "../utils";
import { COLOR } from "../constants";

const outcomesMap = new Map(computingGraduateOutcomes.map((d) => [d.year, d]));

const chartData = computerScienceGraduates.map((d) => ({
  year: d.year,
  graduates: d.graduates,
  fullTimeEmployment: outcomesMap.get(d.year)?.fullTimeEmployment,
  unemployed: outcomesMap.get(d.year)?.unemployed,
}));

export default function ComputingGraduateOutcomes() {
  return (
    <div>
      <h2>UK computing graduates and outcomes</h2>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            yAxisId="left"
            domain={[0, "auto"]}
            label={{
              value: "Graduates",
              angle: -90,
              dx: -30,
            }}
            tickFormatter={(value) => compactIntegerFormatter.format(value)}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 1]}
            label={{
              value: "Percentage",
              angle: 90,
              dx: 30,
            }}
            tickFormatter={(value) => integerPercentageFormatter.format(value)}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Graduates") {
                return [compactIntegerFormatter.format(Number(value)), name];
              }
              return [integerPercentageFormatter.format(Number(value)), name];
            }}
            itemSorter={(item) => {
              const order = ["graduates", "fullTimeEmployment", "unemployed"];
              return typeof item.dataKey === "string"
                ? order.indexOf(item.dataKey)
                : -1;
            }}
          />
          <Legend
            itemSorter={(item) => {
              const order = ["graduates", "fullTimeEmployment", "unemployed"];
              return typeof item.dataKey === "string"
                ? order.indexOf(item.dataKey)
                : -1;
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="graduates"
            fill={COLOR.primary}
            name="Graduates"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="fullTimeEmployment"
            stroke={COLOR.positive}
            strokeWidth={2}
            name="Full-time employment"
            connectNulls
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="unemployed"
            stroke={COLOR.negative}
            strokeWidth={2}
            name="Unemployed"
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
      <details>
        <summary>Sources</summary>
        <ul>
          <li>
            <a
              href="https://www.hesa.ac.uk/news/17-07-2025/sb272-higher-education-graduate-outcomes-statistics/study"
              target="_blank"
            >
              Higher Education Student Statistics: UK - Graduate outcomes
            </a>
          </li>
          <li>
            <a
              href="https://www.hesa.ac.uk/news/20-03-2025/sb271-higher-education-student-statistics/qualifications"
              target="_blank"
            >
              Higher Education Student Statistics: UK, 2023/24 - Qualifications
              achieved
            </a>
          </li>
          <li>
            <a
              href="https://www.hesa.ac.uk/news/25-01-2022/sb262-higher-education-student-statistics/qualifications"
              target="_blank"
            >
              Higher Education Student Statistics: UK, 2020/21 - Qualifications
              achieved
            </a>
          </li>
          <li>
            <a
              href="https://www.hesa.ac.uk/news/11-01-2018/sfr247-higher-education-student-statistics/qualifications"
              target="_blank"
            >
              Higher Education Student Statistics: UK, 2016/17 - Qualifications
              achieved
            </a>
          </li>
        </ul>
      </details>
    </div>
  );
}
