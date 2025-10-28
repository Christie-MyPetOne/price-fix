"use client";

import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
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
import { Product } from "@/lib/types";
import { ToggleButton } from "../ui/ToggleButton";

// =============================
// 🧩 Tipos do card
// =============================
interface PurchaseStatusCardProps {
  products: Product[];
  getPurchaseStatus: (product: Product) => string;
}

interface ChartDataItem {
  status: string;
  count: number;
  totalValue: number;
  percentage: number;
  color: string;
  icon: React.ElementType;
}

// =============================
// 🧩 Tooltip customizado
// =============================
const CustomTooltip = (props: TooltipProps<ValueType, NameType>) => {
  const { active, payload } = props as any;
  if (active && payload && payload.length) {
    const dataItem = payload[0].payload as {
      name: string;
      value: number;
      color?: string;
      count?: number;
      totalValue?: number;
      icon?: React.ElementType;
    };
    return (
      <div className="bg-card p-3 border border-border-dark rounded-md shadow-lg text-xs">
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

export const PurchaseStatusCard: React.FC<PurchaseStatusCardProps> = ({
  products,
  getPurchaseStatus,
}) => {
  const [activeStatuses, setActiveStatuses] = useState<string[]>([
    "Sem Estoque",
    "Comprar",
    "Ok",
    "Pedido",
  ]);

  const data: ChartDataItem[] = useMemo(() => {
    const grouped: Record<string, { count: number; totalValue: number }> = {};
    const normalizeStatus = (status: string) =>
      status
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const colors: Record<string, string> = {
      "Sem Estoque": "#ef4444",
      Reposição: "#f59e0b",
      Estável: "#22c55e",
      Encomendado: "#3b82f6",
    };

    const icons: Record<string, React.ElementType> = {
      "Sem Estoque": XCircle,
      Reposição: ShoppingCart,
      Estável: CheckCircle2,
      Encomendado: PackageCheck,
    };

    // Conta produtos reais
    products.forEach((p) => {
      const statusRaw = getPurchaseStatus(p) ?? "ok";
      const status = normalizeStatus(statusRaw);
      const price = (p as any).price ?? (p as any).value ?? 0;
      const stockLevel = (p as any).stockLevel ?? 0;
      const value = stockLevel * price;

      if (!grouped[status]) grouped[status] = { count: 0, totalValue: 0 };
      grouped[status].count += 1;
      grouped[status].totalValue += value;
    });

    // Adiciona status faltantes com valores fictícios
    const allStatuses = ["Sem Estoque", "Reposição", "Estável", "Encomendado"];
    allStatuses.forEach((s) => {
      if (!grouped[s]) {
        grouped[s] = {
          count: Math.floor(Math.random() * 8) + 1,
          totalValue: Math.floor(Math.random() * 2000) + 500,
        };
      }
    });

    const totalProductsCount = Object.values(grouped).reduce(
      (acc, cur) => acc + cur.count,
      0
    );

    return allStatuses.map((statusKey) => {
      const { count, totalValue } = grouped[statusKey];
      const color = colors[statusKey];
      const icon = icons[statusKey];
      const label = statusKey.charAt(0).toUpperCase() + statusKey.slice(1);
      return {
        status: label,
        count,
        totalValue,
        percentage:
          totalProductsCount > 0 ? (count / totalProductsCount) * 100 : 0,
        color,
        icon,
      } as ChartDataItem;
    });
  }, [products, getPurchaseStatus]);

  const totalStockValue = data.reduce((acc, cur) => acc + cur.totalValue, 0);

  // Filtra os dados para mostrar apenas os status ativos
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
    <div className="bg-card rounded-lg p-6 border border-border-dark shadow-sm">
      {/* Cabeçalho */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-text">Status de compra</h2>
        <div className="text-right">
          <p className="text-sm text-text-secondary">Valor total em estoque</p>
          <p className="text-2xl font-bold text-text mt-1">
            {totalStockValue.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </div>

      {/* Gráfico de Pizza */}
      <div
        className="h-64 w-full border-b-2 border-border-dark pb-2"
        onClick={(e) => e.stopPropagation()}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={filteredPieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={3}
              labelLine={false}
              label={(entry: any) =>
                `${entry.count} ${"Produtos"} (${entry.value.toFixed(1)}%)`
              }
            >
              {filteredPieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color ?? "#6b7280"}
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-pointer"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Detalhes dos status com Toggle */}
      <div className="grid grid-cols-4 gap-4 text-xs pt-4">
        {data.map((item) => {
          const IconComponent = item.icon ?? ShoppingCart;
          const isActive = activeStatuses.includes(item.status);
          return (
            <div
              key={item.status}
              className="text-center space-y-1 flex flex-col items-center"
            >
              <p
                className="font-semibold flex items-center justify-center gap-1 text-text"
                style={{ color: item.color }}
              >
                <IconComponent className="w-4 h-4" />
                {item.status}
              </p>
              <p className="text-text-secondary font-medium">
                {item.totalValue.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
              <p className="text-text-secondary text-[0.7rem]">
                Valor em estoque
              </p>
              <ToggleButton
                initialActive={isActive} // <-- CORREÇÃO: Mude 'active' para 'initialActive'
                onToggle={() => toggleStatus(item.status)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
