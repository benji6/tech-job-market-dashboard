import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { integerFormatter } from "../utils";
import computerScienceGraduates from "../data/computer-science-graduates.json";

const chartData = computerScienceGraduates.map((d) => ({
  year: d.year,
  graduates: d.graduates,
}));

export default function ComputerScienceGraduates() {
  return (
    <div>
      <h2>UK computer science graduates</h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            domain={[0, "auto"]}
            label={{
              value: "Graduates",
              angle: -90,
              dx: -50,
            }}
            tickFormatter={(value) => integerFormatter.format(value)}
          />
          <Tooltip
            formatter={(value) => [
              integerFormatter.format(Number(value)),
              "Graduates",
            ]}
          />
          <Bar dataKey="graduates" fill="#82ca9d" name="Graduates" />
        </BarChart>
      </ResponsiveContainer>
      <details>
        <summary>Sources</summary>
        <ul>
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
