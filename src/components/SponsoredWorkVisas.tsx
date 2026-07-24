import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import sponsoredWorkVisas from "../data/sponsored-work-visas.json";
import { COLOR } from "../constants";
import { compactIntegerFormatter } from "../utils";

export default function SponsoredWorkVisas() {
  return (
    <div>
      <h2>UK sponsored work visas</h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={sponsoredWorkVisas}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis
            domain={[0, "auto"]}
            label={{ value: "Visas", angle: -90, dx: -30 }}
            tickFormatter={(value) => compactIntegerFormatter.format(value)}
          />
          <Tooltip
            formatter={(value) => [
              compactIntegerFormatter.format(Number(value)),
              "Visas",
            ]}
          />
          <Line
            dataKey="value"
            dot={false}
            name="Visas"
            stroke={COLOR.primary}
            strokeWidth={2}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
      <details>
        <summary>Sources</summary>
        <ul>
          <li>
            <a
              href="https://www.gov.uk/government/statistical-data-sets/immigration-system-statistics-data-tables"
              target="_blank"
            >
              Home Office immigration system statistics data tables
            </a>
          </li>
        </ul>
      </details>
    </div>
  );
}
