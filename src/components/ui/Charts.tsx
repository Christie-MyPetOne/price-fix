import React from "react";
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
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

export const StatusPieChart = ({
  data,
  CustomTooltip,
  height = 256,
  outerRadius = 90,
  innerRadius = 50,
}: {
  data: any[];
  CustomTooltip: React.FC<any>;
  height?: number;
  outerRadius?: number;
  innerRadius?: number;
  showLabels?: boolean;
}) => (
  <div
    className="w-full border-b-2 border-border-dark pb-2"
    style={{ height }}
    onClick={(e) => e.stopPropagation()}
  >
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          paddingAngle={3}
          labelLine={false}
          label={(entry: any) =>
            `${entry.count} Produtos (${entry.value.toFixed(1)}%)`
          }
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color ?? "#6b7280"}
              className="cursor-pointer"
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>
);
