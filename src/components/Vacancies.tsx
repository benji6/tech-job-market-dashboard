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
import { useState } from "react";
import { integerFormatter } from "../utils";
import vacancySurveyInformationAndCommunication from "../data/vacancy-survey-information-and-communication.json";

const EMA_PERIOD = 3;
const k = 2 / (EMA_PERIOD + 1);
const vacancyData: { date: string; value: number; ema: number }[] = [];
for (let i = 0; i < vacancySurveyInformationAndCommunication.length; i++) {
  const item = vacancySurveyInformationAndCommunication[i];
  const value = item.value * 1e3;
  vacancyData.push({
    date: item.date,
    value,
    ema: i ? value * k + vacancyData[i - 1].ema * (1 - k) : value,
  });
}

export default function Vacancies() {
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [indexToFeb2020, setIndexToFeb2020] = useState(false);

  const feb2020Value =
    vacancyData.find((item) => item.date === "Dec-Feb 2020")?.value || 1;

  const processedData = vacancyData.map((item) => ({
    ...item,
    value: indexToFeb2020 ? (item.value / feb2020Value) * 100 : item.value,
    ema: indexToFeb2020 ? (item.ema / feb2020Value) * 100 : item.ema,
  }));

  const displayData = showFullHistory
    ? processedData
    : processedData.slice(
        processedData.findIndex((item) => item.date === "Dec-Feb 2020"),
      );

  return (
    <div>
      <h2>UK information and communication vacancies</h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={displayData}
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
              value: indexToFeb2020 ? "Index (Feb 2020 = 100)" : "Vacancies",
              angle: -90,
              dx: -40,
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
            formatter={(value, _, props) => [
              indexToFeb2020
                ? `${Number(value).toFixed(1)}`
                : integerFormatter.format(Number(value)),
              props.dataKey === "value"
                ? indexToFeb2020
                  ? "Index"
                  : "Vacancies"
                : "Trend",
            ]}
          />
          <Legend />
          <Line
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            name={indexToFeb2020 ? "Index" : "Vacancies"}
            type="monotone"
          />
          <Line
            type="monotone"
            dataKey="ema"
            stroke="#4ecdc4"
            strokeWidth={2}
            dot={false}
            name="90 day exponential moving average"
            strokeDasharray="5 5"
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
          checked={indexToFeb2020}
          onChange={(e) => setIndexToFeb2020(e.target.checked)}
        />
        Index (Feb 2020 = 100)
      </label>
    </div>
  );
}
