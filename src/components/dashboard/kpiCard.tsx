"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { KpiCardProps } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import ChartKpiCard from "@/components/charts/ChartKpiCard";

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  sparklineData,
  comparedLabel = "Período comparado",
  comparedValue = "—",
}) => {
  const isPositive = change >= 0;
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="p-6 flex w-full flex-col bg-card">
      <span>
        <p className="text-2sm">{title}</p>
        <p className="text-2xl font-bold mt-10 mb-2">{value}</p>
      </span>

      <div className="-mt-11 -mb-5 flex justify-end relative">
        <div
          className={`mb-2 -mt-5 absolute -top-6 right-0 flex items-center gap-2 rounded-lg px-3 py-1.5 text-base font-bold shadow-md ${
            isPositive ? "text-primary bg-primary/15" : "text-error bg-error/15"
          }`}
          title={isPositive ? "Subindo" : "Caindo"}
        >
          <ChangeIcon size={22} strokeWidth={2.5} />
          {Math.abs(change)}%
        </div>

        <ChartKpiCard data={sparklineData} isPositive={isPositive} />
      </div>
      <div className="mt-4 pt-3 border-t border-border-dark/60 flex items-center justify-between">
        <span className="text-xs text-text-secondary">{comparedLabel}</span>
        <span className="text-sm font-semibold">{comparedValue}</span>
      </div>
    </Card>
  );
};

export default KpiCard;
