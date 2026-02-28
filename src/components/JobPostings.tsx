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
import headlineJobPostingsData from "../data/job-postings-headline-index.json";
import { COLOR } from "../constants";

const EMA_PERIOD_DAYS = 90;
const headlineEmaK = 2 / (EMA_PERIOD_DAYS + 1);

const headlineValueByDate = new Map<string, number>(
  headlineJobPostingsData.map((d) => [d.dateString, d.value]),
);

const mergedJobPostingsData: Array<{
  date: string;
  value: number;
  ema: number;
  headline?: number;
  headlineEma?: number;
}> = aggregatedPostingsData.map((d) => ({
  ...d,
  headline: headlineValueByDate.get(d.date),
}));

for (let i = 0; i < mergedJobPostingsData.length; i++) {
  const item = mergedJobPostingsData[i];
  if (typeof item.headline !== "number") continue;
  item.headlineEma = i
    ? item.headline * headlineEmaK +
      (mergedJobPostingsData[i - 1].headlineEma ?? item.headline) *
        (1 - headlineEmaK)
    : item.headline;
}

const seriesLabelByDataKey: Record<string, string> = {
  value: "Software development job postings index",
  ema: "Software development trend (90-day exponential moving average)",
  headline: "All UK job postings index (headline)",
  headlineEma: "All UK trend (90-day exponential moving average)",
};

export default function JobPostings() {
  return (
    <div>
      <h2>UK job postings index (software development vs all UK)</h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={mergedJobPostingsData}
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
              value: "Index",
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
            formatter={(value, _, props) => {
              const dataKey = String(props.dataKey);
              return [
                integerFormatter.format(Number(value)),
                seriesLabelByDataKey[dataKey] ?? dataKey,
              ];
            }}
          />
          <Legend />
          <Line
            dataKey="value"
            stroke={COLOR.primary}
            strokeWidth={1}
            dot={false}
            name={seriesLabelByDataKey.value}
          />
          <Line
            dataKey="headlineEma"
            stroke={COLOR.secondary}
            strokeWidth={1}
            dot={false}
            strokeDasharray="6 4"
            name={seriesLabelByDataKey.headlineEma}
          />
          <Line
            type="monotone"
            dataKey="ema"
            stroke={COLOR.trend}
            strokeWidth={2}
            dot={false}
            name={seriesLabelByDataKey.ema}
          />
        </LineChart>
      </ResponsiveContainer>
      <details>
        <summary>Sources</summary>
        <ul>
          <li>
            <a href="https://data.indeed.com/#/postings" target="_blank">
              Indeed job postings
            </a>
          </li>
        </ul>
      </details>
    </div>
  );
}
