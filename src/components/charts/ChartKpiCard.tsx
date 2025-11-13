"use client";

import React from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

export interface ChartKpiCardProps {
  data: { value: number }[];
  isPositive: boolean;
}

export const ChartKpiCard: React.FC<ChartKpiCardProps> = ({
  data,
  isPositive,
}) => {
  return (
    <div className="flex grid-cols-5 relative w-36 h-20">
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 8, bottom: 0, left: 0, right: 0 }}
        >
          <Line
            type="monotone"
            dataKey="value"
            stroke={isPositive ? "var(--color-primary)" : "var(--color-error)"}
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartKpiCard;
