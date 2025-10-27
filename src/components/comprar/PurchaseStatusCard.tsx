"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip, // 1. Tooltip importado
  TooltipProps, // 1. Tipos para o Tooltip
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent"; // 1. Tipos para o Tooltip
import {
  ShoppingCart,
  CheckCircle2, // Usado para 'Ok'
  XCircle, // Usado para 'Ruptura'
  PackageCheck, // Usado para 'Pedido'
} from "lucide-react";
import { Product } from "@/lib/types";
import { ToggleButton } from "@/components/ui/ToggleButton"; // Preservando seu ToggleButton

interface PurchaseStatusCardProps {
  products: Product[];
  getPurchaseStatus: (product: Product) => string;
}

// Tipagem para os dados do gráfico
interface ChartDataItem {
  status: string;
  count: number;
  totalValue: number;
  percentage: number;
  color: string;
  icon: React.ElementType;
}

// 2. Componente CustomTooltip (para o hover)
const CustomTooltip = (props: TooltipProps<ValueType, NameType>) => {
  // Usando 'as any' para evitar o erro de tipo persistente
  const { active, payload } = props as any;

  if (active && payload && payload.length) {
    const dataItem = payload[0].payload as ChartDataItem; // Pega o payload completo da barra
    return (
      <div className="bg-card p-3 border border-border-dark rounded-md shadow-lg text-xs">
        <p className="font-semibold text-text">{dataItem.status}</p>
        <p className="text-text-secondary">
          {dataItem.count} produtos ({dataItem.percentage.toFixed(2)}%)
        </p>
        <p className="text-text-secondary">
          Valor em estoque:{" "}
          <span className="font-medium text-text">
            {dataItem.totalValue.toLocaleString("pt-BR", {
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
  const data: ChartDataItem[] = useMemo(() => {
    const grouped: Record<string, { count: number; totalValue: number }> = {
      Ruptura: { count: 0, totalValue: 0 },
      Comprar: { count: 0, totalValue: 0 },
      Ok: { count: 0, totalValue: 0 },
      Pedido: { count: 0, totalValue: 0 },
    };

    products.forEach((p) => {
      const status = getPurchaseStatus(p);
      const price = (p as any).price ?? (p as any).value ?? 0;
      const stockLevel = (p as any).stockLevel ?? 0;
      const value = stockLevel * price;

      if (!grouped[status]) grouped[status] = { count: 0, totalValue: 0 };
      grouped[status].count += 1;
      grouped[status].totalValue += value;
    });

    const totalProductsCount = Object.values(grouped).reduce(
      (acc, cur) => acc + cur.count,
      0
    );

    const colors: Record<string, string> = {
      Ruptura: "#ef4444", // Tailwind 'bg-error' -> red-500
      Comprar: "#f59e0b", // Tailwind 'bg-orange-500' -> orange-500
      Ok: "#22c55e", // Tailwind 'bg-primary' -> green-500
      Pedido: "#3b82f6", // Tailwind 'bg-blue-500' -> blue-500
    };

    const icons: Record<string, React.ElementType> = {
      Ruptura: XCircle,
      Comprar: ShoppingCart,
      Ok: CheckCircle2,
      Pedido: PackageCheck,
    };

    return Object.entries(grouped).map(([status, { count, totalValue }]) => ({
      status,
      count,
      totalValue,
      percentage:
        totalProductsCount > 0 ? (count / totalProductsCount) * 100 : 0,
      color: colors[status],
      icon: icons[status],
    }));
  }, [products, getPurchaseStatus]);

  const totalStockValue = data.reduce((acc, cur) => acc + cur.totalValue, 0);

  const maxPercentage = Math.max(...data.map((item) => item.percentage));

  return (
    <div className="bg-card rounded-lg p-6 border border-border-dark shadow-sm">
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

      {/* Seção do gráfico com recharts */}
      <div className="h-48 w-full border-b-2 border-border-dark pb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }} // 3. Margem do topo reduzida
            barCategoryGap="15%"
          >
            <XAxis
              dataKey="status"
              tickLine={false}
              axisLine={false}
              interval={0}
              height={0}
              tick={false}
            />
            <YAxis
              hide
              domain={[0, maxPercentage > 0 ? maxPercentage * 1.2 : 1]}
            />

            {/* 4. Tooltip adicionado de volta */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "var(--color-background)", opacity: 0.5 }}
            />

            <Bar
              dataKey="percentage"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
              cursor="pointer"
            >
              {/* 5. LabelList removido */}
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Seção dos detalhes com toggles */}
      <div className="grid grid-cols-4 gap-4 text-xs pt-4">
        {data.map((item) => {
          const IconComponent = item.icon;
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
                onToggle={(active) =>
                  console.log(`Status ${item.status} Ativo?`, active)
                }
              
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
