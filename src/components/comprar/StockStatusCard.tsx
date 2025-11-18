"use client";

import React, { useMemo, useState, useEffect } from "react";
import { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import {
  ShoppingCart,
  CheckCircle2,
  XCircle,
  PackageCheck,
} from "lucide-react";
import { StockStatusCardProps, ChartDataItem } from "@/lib/types";
import { ToggleButton } from "../ui/ToggleButton";
import { ChartStatusStock } from "../charts/ChartStatusStock";

const CustomTooltip = (props: TooltipProps<ValueType, NameType>) => {
  const { active, payload } = props as any;
  if (active && payload && payload.length) {
    const dataItem = payload[0].payload as any;
    return (
      <div className="bg-card p-3 border border-border-dark rounded-md shadow-lg text-xs sm:text-sm">
        <p className="font-semibold text-text">{dataItem.name}</p>
        <p className="text-text-secondary">
          {dataItem.count ?? 0} produtos ({(dataItem.value ?? 0).toFixed(2)}%)
        </p>
        <p className="text-text-secondary">
          Valor em estoque:{" "}
          <span className="font-medium text-text">
            {(dataItem.totalValue ?? 0).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export const StockStatusCard: React.FC<StockStatusCardProps> = ({
  products,
  getPurchaseStatus,
}) => {
  const [activeStatuses, setActiveStatuses] = useState<string[]>([
    "Acabou",
    "Comprar",
    "Bom",
    "Pedido",
  ]);

  const [data, setData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    const grouped: Record<string, { count: number; totalValue: number }> = {
      Acabou: { count: 0, totalValue: 0 },
      Comprar: { count: 0, totalValue: 0 },
      Bom: { count: 0, totalValue: 0 },
      Pedido: { count: 0, totalValue: 0 },
    };

    const colors: Record<string, string> = {
      Acabou: "#ef4444",
      Comprar: "#f59e0b",
      Bom: "#22c55e",
      Pedido: "#6b7280",
    };

    const icons: Record<string, React.ElementType> = {
      Acabou: XCircle,
      Comprar: ShoppingCart,
      Bom: CheckCircle2,
      Pedido: PackageCheck,
    };

    products.forEach((p) => {
      const statusRaw = getPurchaseStatus(p);
      const status = statusRaw === "Acabou" ? "Acabou" : statusRaw;

      if (status in grouped) {
        const price = p.price ?? 0;
        const stockLevel = p.stockLevel ?? 0;
        const value = stockLevel * price;

        grouped[status].count += 1;
        grouped[status].totalValue += value;
      }
    });

    const totalProductsCount = products.length;
    const allStatuses = Object.keys(grouped);

    const chartData: ChartDataItem[] = allStatuses.map((statusKey) => {
      const { count, totalValue } = grouped[statusKey];
      const color = colors[statusKey] ?? "#6b7280";
      const icon = icons[statusKey] ?? PackageCheck;

      return {
        status: statusKey,
        count,
        totalValue,
        percentage:
          totalProductsCount > 0 ? (count / totalProductsCount) * 100 : 0,
        color,
        icon,
      };
    });

    setData(chartData);
  }, [products, getPurchaseStatus]);

  const totalStockValue = useMemo(
    () => data.reduce((acc, cur) => acc + cur.totalValue, 0),
    [data]
  );

  const filteredPieData = useMemo(
    () =>
      data
        .filter((d) => activeStatuses.includes(d.status))
        .map((d) => ({
          name: d.status,
          value: Number(d.percentage ?? 0),
          color: d.color,
          count: d.count,
          totalValue: d.totalValue,
          icon: d.icon,
        })),
    [data, activeStatuses]
  );

  const toggleStatus = (status: string) => {
    setActiveStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  return (
    <div className="bg-card rounded-lg p-4 sm:p-6 border border-border-dark shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-text mb-2 sm:mb-0">
          Status de compra
        </h2>
        <div className="text-left sm:text-right">
          <p className="text-sm text-text-secondary">Valor total em estoque</p>
          <p className="text-2xl sm:text-3xl font-bold text-text mt-1">
            {totalStockValue.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </div>

      <ChartStatusStock data={filteredPieData} CustomTooltip={CustomTooltip} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        {data.map((item) => {
          const IconComponent = item.icon ?? ShoppingCart;
          const isActive = activeStatuses.includes(item.status);

          return (
            <div
              key={item.status}
              className="flex flex-col items-center text-center space-y-1 sm:space-y-2 p-2 border border-border-dark rounded-lg hover:shadow-md transition-all"
            >
              <div
                className="flex items-center gap-1 sm:gap-2 text-base sm:text-lg font-medium"
                style={{ color: item.color }}
              >
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                {item.status}
              </div>
              <p className="text-text-secondary font-medium text-sm sm:text-base">
                {item.totalValue.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
              <p className="text-text-secondary text-[0.65rem] sm:text-xs">
                Valor em estoque
              </p>
              <ToggleButton
                initialActive={isActive}
                onToggle={() => toggleStatus(item.status)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
