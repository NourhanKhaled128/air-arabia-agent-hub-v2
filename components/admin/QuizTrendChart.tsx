"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: { week: string; passRate: number; attempts: number }[];
}

export default function QuizTrendChart({ data }: Props) {
  if (data.length === 0) {
    return <p className="text-slate-500">No submitted quiz attempts in this period.</p>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="week"
            tickFormatter={(value: string) => new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
            tick={{ fontSize: 12 }}
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
          <Tooltip
            formatter={(value: number, name: string) => (name === "passRate" ? [`${value}%`, "Pass rate"] : [value, "Attempts"])}
            labelFormatter={(value: string) => `Week of ${new Date(value).toLocaleDateString("en-GB")}`}
          />
          <Line type="monotone" dataKey="passRate" stroke="#b91c1c" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
