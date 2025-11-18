import React from "react";
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { SparklineProps, DetailedChartProps } from "@/lib/types";

export const RechartsSparkline: React.FC<SparklineProps> = ({
  data,
  color = "#4F46E5",
}) => {
  if (!data || data.length < 2) return null;

  return (
    <div className="w-[60px] h-[20px] inline-block ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PerformanceChart: React.FC<DetailedChartProps> = ({
  data,
  color = "#4F46E5",
  yAxisLabel,
}) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" />
          <YAxis
            label={{
              value: yAxisLabel || "",
              angle: -90,
              position: "insideLeft",
              offset: 10,
            }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
