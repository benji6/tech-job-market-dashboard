import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import layoffsAnnualTrueupData from "../data/layoffs-annual-trueup.json";
import layoffsQuarterlyFyiData from "../data/layoffs-quarterly-fyi.json";
import layoffsMonthlyTrueupData from "../data/layoffs-monthly-trueup.json";
import layoffsMonthlyFyiData from "../data/layoffs-monthly-fyi.json";
import { defaultDict } from "../utils";

const layoffsTrueupByYear: Record<string, number> = {};
for (const item of layoffsAnnualTrueupData)
  layoffsTrueupByYear[item.year] = item.value;

const layoffsFyiByYear = defaultDict(() => 0);
for (const item of layoffsQuarterlyFyiData)
  layoffsFyiByYear[item.date.split("-", 1)[0]] += item.value;

const layoffsTrueupByQuarter = defaultDict(() => 0);
for (const item of layoffsMonthlyTrueupData) {
  const [year, month] = item.date.split("-");
  const quarter = `Q${Math.floor((parseInt(month) - 1) / 3) + 1}`;
  layoffsTrueupByQuarter[`${year}-${quarter}`] += item.value;
}

export default function Layoffs() {
  const annualLayoffsData = layoffsAnnualTrueupData.map((item) => {
    return {
      period: item.year,
      trueup: item.value,
      fyi: layoffsFyiByYear[item.year],
    };
  });

  const quarterlyLayoffsData = layoffsQuarterlyFyiData.map((item) => ({
    period: item.date,
    trueup: layoffsTrueupByQuarter[item.date] || null,
    fyi: item.value,
  }));

  const monthlytrueupByDate: Record<string, number> = {};
  for (const item of layoffsMonthlyTrueupData) {
    monthlytrueupByDate[item.date] = item.value;
  }

  const monthlyLayoffsData = layoffsMonthlyFyiData
    .map((item) => ({
      date: item.date,
      fyi: item.value,
      trueup: monthlytrueupByDate[item.date] || null,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <h1 style={{ marginTop: "60px" }}>Tech industry layoffs</h1>
      <p>
        Sources:{" "}
        <a href="https://layoffs.fyi" target="_blank">
          Layoffs.fyi
        </a>
        {", "}
        <a href="https://www.trueup.io/layoffs" target="_blank">
          trueup
        </a>
      </p>
      <p>
        <small>
          Note that latest data is not complete yet. The trueup annual 2025 data
          is a projection.
        </small>
      </p>

      <h2 style={{ marginTop: "60px" }}>Layoffs by year</h2>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={annualLayoffsData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" angle={-45} textAnchor="end" height={80} />
          <YAxis
            label={{ value: "Layoffs", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value) => {
              if (value === null) return null;
              return value.toLocaleString();
            }}
          />
          <Legend />
          <Bar dataKey="trueup" fill="#ff6b6b" name="trueup" />
          <Bar dataKey="fyi" fill="#9b59b6" name="Layoffs.fyi" />
        </ComposedChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: "60px" }}>Layoffs by quarter</h2>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={quarterlyLayoffsData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" angle={-45} textAnchor="end" height={80} />
          <YAxis
            label={{ value: "Layoffs", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value, _name, props) => {
              if (value === null) return null;
              const label =
                props.dataKey === "trueup" ? "trueup" : "Layoffs.fyi";
              return [value.toLocaleString(), label];
            }}
          />
          <Legend />
          <Bar dataKey="trueup" fill="#ff6b6b" name="trueup" />
          <Bar dataKey="fyi" fill="#9b59b6" name="Layoffs.fyi" />
        </ComposedChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: "60px" }}>Monthly layoffs</h2>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={monthlyLayoffsData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
          <YAxis
            label={{ value: "Layoffs", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value) => {
              if (value === null) return null;
              return value.toLocaleString();
            }}
          />
          <Legend />
          <Bar type="monotone" dataKey="trueup" fill="#ff6b6b" name="trueup" />
          <Bar
            type="monotone"
            dataKey="fyi"
            fill="#9b59b6"
            name="Layoffs.fyi"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
}
