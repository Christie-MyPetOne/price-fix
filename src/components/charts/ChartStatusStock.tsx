"use client";

import React, { useState, useEffect } from "react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export const ChartStatusStock = ({
  data,
  CustomTooltip,
  height = 256,
  outerRadius = 90,
  innerRadius = 50,
}: {
  data: any[];
  CustomTooltip: React.FC<any>;
  height?: number;
  outerRadius?: number | string;
  innerRadius?: number | string;
  showLabels?: boolean;
}) => {
  const [clientRendered, setClientRendered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setClientRendered(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getLabelText = (entry: any) => {
    const mobileCondition = !clientRendered || isMobile;

    return mobileCondition
      ? `${entry.count} (${entry.value.toFixed(1)}%)`
      : `${entry.count} Produtos (${entry.value.toFixed(1)}%)`;
  };

  return (
    <div
      className="w-full border-b-2 border-border-dark pb-2 h-[220px] md:h-[256px]"
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
            outerRadius={isMobile ? "70%" : outerRadius}
            innerRadius={isMobile ? "40%" : innerRadius}
            paddingAngle={3}
            labelLine={false}
            label={getLabelText}
            style={{ fontSize: isMobile ? "14px" : "16px" }}
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
};
