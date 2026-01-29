import { useState } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import aggregatedMonthlyLayoffData from "../aggregatedMonthlyLayoffData";
import aggregatedPostingsData from "../aggregatedPostingsData";
import interestRatesData from "../data/boe-interest-rates.json";
import { integerFormatter } from "../utils";
import { COLOR } from "../constants";

const layoffsByMonth: Record<string, number> = {};
for (const { date, index } of aggregatedMonthlyLayoffData) {
  layoffsByMonth[date] = index;
}
const layoffsByMonthEma: Record<string, number> = {};
for (const { date, indexEma3 } of aggregatedMonthlyLayoffData) {
  layoffsByMonthEma[date] = indexEma3;
}

const interestRatesByDate: Record<string, number> = {};
for (const { date, value } of interestRatesData) {
  interestRatesByDate[date] = value;
}

const combinedData: {
  date: string;
  jobPostingsIndexed: number;
  layoffsIndexed: number | null;
  jobPostingsEmaIndexed: number;
  layoffsEmaIndexed: number | null;
  netIndexed: number | null;
  interestRate: number | null;
}[] = [];

let layoffsEma: number | null = null;
let lastInterestRate = 0.75;

for (let i = 0; i < aggregatedPostingsData.length; i++) {
  const item = aggregatedPostingsData[i];
  const dateKey = item.date.slice(0, 7);
  const layoffs = layoffsByMonth[dateKey];

  layoffsEma = layoffsByMonthEma[dateKey];

  const netIndexed = layoffsEma === undefined ? null : item.ema - layoffsEma;

  if (interestRatesByDate[item.date] !== undefined) {
    lastInterestRate = interestRatesByDate[item.date];
  }

  combinedData.push({
    date: item.date,
    jobPostingsIndexed: item.value,
    layoffsIndexed: layoffs,
    jobPostingsEmaIndexed: item.ema,
    layoffsEmaIndexed: layoffsEma,
    netIndexed,
    interestRate: lastInterestRate,
  });
}

export default function NetDemand() {
  const [showInterestRate, setShowInterestRate] = useState(false);

  return (
    <div className="dashboard__item--stretch">
      <h2>Net demand for software engineers</h2>
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
            yAxisId="left"
            label={{
              value: "Index",
              angle: -90,
              dx: -30,
            }}
          />
          {showInterestRate && (
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: "Interest rate (%)",
                angle: 90,
                dx: 10,
              }}
              domain={[0, 6]}
            />
          )}
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
              } else if (dataKey === "interestRate") {
                return [`${value}%`, "Interest rate"];
              }
              return [integerFormatter.format(Number(value)), label];
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            dataKey="jobPostingsEmaIndexed"
            dot={false}
            name="Job postings index (90-day exponential moving average)"
            stroke={COLOR.secondary}
            opacity={1 / 3}
            strokeWidth={2}
          />
          <Line
            dataKey="layoffsEmaIndexed"
            dot={false}
            name="Layoffs index (90-day exponential moving average)"
            opacity={1 / 3}
            stroke={COLOR.negative}
            strokeWidth={2}
            type="monotone"
            yAxisId="left"
          />
          <Line
            dataKey="netIndexed"
            dot={false}
            name="Net demand for software engineers (postings index - layoffs index)"
            stroke="#111"
            strokeWidth={2}
            type="monotone"
            yAxisId="left"
          />
          {showInterestRate && (
            <Line
              yAxisId="right"
              dataKey="interestRate"
              dot={false}
              name="Bank of England interest rate"
              stroke="#f39c12"
              strokeWidth={2}
              type="stepAfter"
            />
          )}
          <ReferenceLine yAxisId="left" y={0} stroke="#111" />
        </ComposedChart>
      </ResponsiveContainer>
      <div>
        <small>
          Trends are indicated with 90 day exponential moving averages, using
          all available data sources and indexed to 100 for the start of each
          series
        </small>
      </div>
      <label style={{ display: "block", marginBlock: "1em" }}>
        <input
          type="checkbox"
          checked={showInterestRate}
          onChange={(e) => setShowInterestRate(e.target.checked)}
        />{" "}
        Show Bank of England interest rate
      </label>
      <details>
        <summary>Sources</summary>
        <ul>
          <li>
            <a href="https://data.indeed.com/#/postings" target="_blank">
              Indeed job postings
            </a>
          </li>
          <li>
            <a href="https://layoffs.fyi" target="_blank">
              Layoffs.fyi layoffs
            </a>
          </li>
          <li>
            <a href="https://www.trueup.io/layoffs" target="_blank">
              trueup layoffs
            </a>
          </li>
          <li>
            <a
              href="https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate"
              target="_blank"
            >
              Bank of England interest rate
            </a>
          </li>
        </ul>
      </details>
    </div>
  );
}
