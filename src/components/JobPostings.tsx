import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
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

const jobPostingsValueByDate = new Map<string, number>(
  aggregatedPostingsData.map((d) => [d.date, d.value]),
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

const dateTwelveMonthsAgo = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const lastDayOfTargetMonth = new Date(Date.UTC(year - 1, month, 0));
  const targetDay = Math.min(day, lastDayOfTargetMonth.getUTCDate());

  return new Date(Date.UTC(year - 1, month - 1, targetDay))
    .toISOString()
    .slice(0, 10);
};

const jobPostingsChangeData = mergedJobPostingsData.map((item) => {
  const valueTwelveMonthsAgo = jobPostingsValueByDate.get(
    dateTwelveMonthsAgo(item.date),
  );

  return {
    date: item.date,
    changeVsTwelveMonthsAgo: valueTwelveMonthsAgo
      ? ((item.value - valueTwelveMonthsAgo) / valueTwelveMonthsAgo) * 100
      : null,
  };
});

const seriesLabelByDataKey: Record<string, string> = {
  value: "Software development job postings index",
  ema: "Software development trend (90-day exponential moving average)",
  headlineEma: "All UK trend (90-day exponential moving average)",
  emaMinusHeadlineEma:
    "Software development trend minus all UK trend (90-day exponential moving average)",
  changeVsTwelveMonthsAgo:
    "Software development job postings change vs 12 months ago",
};

const signedIntegerFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
  signDisplay: "exceptZero",
});

const signedPercentageFormatter = new Intl.NumberFormat(undefined, {
  style: "percent",
  maximumFractionDigits: 0,
  signDisplay: "exceptZero",
});

type JobPostingsChartData = {
  date: string;
  value?: number;
  ema?: number;
  headline?: number;
  headlineEma?: number;
  emaMinusHeadlineEma?: number | null;
  changeVsTwelveMonthsAgo?: number | null;
};

export default function JobPostings() {
  const [subtractHeadline, setSubtractHeadline] = useState(false);
  const [showChangeVsTwelveMonthsAgo, setShowChangeVsTwelveMonthsAgo] =
    useState(false);

  const chartData: JobPostingsChartData[] = useMemo(() => {
    if (showChangeVsTwelveMonthsAgo) return jobPostingsChangeData;
    if (!subtractHeadline) return mergedJobPostingsData;
    return mergedJobPostingsData.map((d) => ({
      ...d,
      emaMinusHeadlineEma:
        typeof d.headlineEma === "number" ? d.ema - d.headlineEma : null,
    }));
  }, [showChangeVsTwelveMonthsAgo, subtractHeadline]);

  return (
    <div>
      <h2>UK job postings index (software development vs all UK)</h2>
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
            label={{
              value: showChangeVsTwelveMonthsAgo
                ? "Change vs 12 months ago"
                : subtractHeadline
                  ? "Index difference"
                  : "Index",
              angle: -90,
              dx: -30,
            }}
            tickFormatter={
              showChangeVsTwelveMonthsAgo
                ? (value) =>
                    signedPercentageFormatter.format(Number(value) / 100)
                : undefined
            }
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
              if (value === null || value === undefined) return [value, ""];
              const formatter = showChangeVsTwelveMonthsAgo
                ? signedPercentageFormatter
                : subtractHeadline
                  ? signedIntegerFormatter
                  : integerFormatter;
              return [
                formatter.format(
                  showChangeVsTwelveMonthsAgo
                    ? Number(value) / 100
                    : Number(value),
                ),
                seriesLabelByDataKey[dataKey] ?? dataKey,
              ];
            }}
          />
          <Legend />
          {showChangeVsTwelveMonthsAgo ? (
            <>
              <Line
                type="monotone"
                dataKey="changeVsTwelveMonthsAgo"
                stroke={COLOR.trend}
                strokeWidth={2}
                dot={false}
                name={seriesLabelByDataKey.changeVsTwelveMonthsAgo}
                connectNulls
              />
              <ReferenceLine y={0} stroke={COLOR.neutral} />
            </>
          ) : subtractHeadline ? (
            <>
              <Line
                type="monotone"
                dataKey="emaMinusHeadlineEma"
                stroke={COLOR.trend}
                strokeWidth={2}
                dot={false}
                name={seriesLabelByDataKey.emaMinusHeadlineEma}
                connectNulls
              />
              <ReferenceLine y={0} stroke={COLOR.neutral} />
            </>
          ) : (
            <>
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
                type="monotone"
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
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
      <label style={{ display: "block", marginBlock: "1em" }}>
        <input
          type="checkbox"
          checked={subtractHeadline}
          onChange={(e) => setSubtractHeadline(e.target.checked)}
          disabled={showChangeVsTwelveMonthsAgo}
        />{" "}
        Show relative to all UK (software development - all UK)
      </label>
      <label>
        <input
          type="checkbox"
          checked={showChangeVsTwelveMonthsAgo}
          onChange={(e) => setShowChangeVsTwelveMonthsAgo(e.target.checked)}
        />{" "}
        Show change vs 12 months ago
      </label>
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
