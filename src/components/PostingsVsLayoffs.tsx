import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import aggregatedMonthlyLayoffData from "../aggregatedMonthlyLayoffData";
import aggregatedPostingsData from "../aggregatedPostingsData";
import { integerFormatter } from "../utils";

const layoffsByMonth: Record<string, number> = {};
for (const { date, index } of aggregatedMonthlyLayoffData) {
  layoffsByMonth[date] = index;
}
const layoffsByMonthEma: Record<string, number> = {};
for (const { date, indexEma3 } of aggregatedMonthlyLayoffData) {
  layoffsByMonthEma[date] = indexEma3;
}

const combinedData: {
  date: string;
  jobPostingsIndexed: number;
  layoffsIndexed: number | null;
  jobPostingsEmaIndexed: number;
  layoffsEmaIndexed: number | null;
  netIndexed: number | null;
}[] = [];

let layoffsEma: number | null = null;

for (let i = 0; i < aggregatedPostingsData.length; i++) {
  const item = aggregatedPostingsData[i];
  const dateKey = item.date.slice(0, 7);
  const layoffs = layoffsByMonth[dateKey];

  layoffsEma = layoffsByMonthEma[dateKey];

  const netIndexed = item.ema - layoffsEma;

  combinedData.push({
    date: item.date,
    jobPostingsIndexed: item.value,
    layoffsIndexed: layoffs,
    jobPostingsEmaIndexed: item.ema,
    layoffsEmaIndexed: layoffsEma,
    netIndexed,
  });
}

export default function PostingsVsLayoffs() {
  return (
    <>
      <h1>Job postings vs layoffs</h1>
      <p>
        Trends are indicated with 90 day exponential moving averages, using the
        above data sources and indexed to 100 for the start of each series
      </p>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={combinedData}
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
              value: "Index (100 = start)",
              angle: -90,
              position: "insideLeft",
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
              const dataKey = props.dataKey as string;
              let label = "";
              if (dataKey === "jobPostingsEmaIndexed") {
                label = "Job postings";
              } else if (dataKey === "layoffsEmaIndexed") {
                label = "Layoffs";
              } else if (dataKey === "netIndexed") {
                label = "Net (postings - layoffs)";
              }
              return [integerFormatter.format(Number(value)), label];
            }}
          />
          <Legend />
          <Line
            dataKey="jobPostingsEmaIndexed"
            dot={false}
            name="Job postings index (90-day exponential moving average)"
            stroke="#4ecdc4"
            strokeDasharray="1 1"
            strokeWidth={2}
          />
          <Line
            dataKey="layoffsEmaIndexed"
            dot={false}
            name="Layoffs index (90-day exponential moving average)"
            stroke="#ff6b6b"
            strokeDasharray="1 1"
            strokeWidth={2}
          />
          <Line
            dataKey="netIndexed"
            dot={false}
            name="Net index (postings - layoffs)"
            stroke="#111"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
}
