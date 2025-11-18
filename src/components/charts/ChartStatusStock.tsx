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
  // Estado para saber se o componente já foi montado no cliente
  const [clientRendered, setClientRendered] = useState(false);
  // Estado para detectar se está em um dispositivo móvel
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Indica que estamos no cliente, habilitando a lógica de responsividade
    setClientRendered(true);

    const checkMobile = () => {
      // Usamos 768px como breakpoint padrão (md do Tailwind)
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile(); // Checa imediatamente
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Lógica de Label Condicional e "Guarda de Cliente"
  const getLabelText = (entry: any) => {
    // Durante a primeira renderização (SSR), ou se o cliente for mobile:
    const mobileCondition = !clientRendered || isMobile;

    return mobileCondition
      ? `${entry.count} (${entry.value.toFixed(1)}%)` // Mobile: Sem a palavra "Produtos"
      : `${entry.count} Produtos (${entry.value.toFixed(1)}%)`; // Desktop: Com a palavra "Produtos"
  };

  return (
    <div
      // Altura responsiva (ajustada para garantir que o chart caiba no celular)
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
            // Força a dimensão menor no mobile usando porcentagem (ou o valor desktop original)
            outerRadius={isMobile ? "70%" : outerRadius}
            innerRadius={isMobile ? "40%" : innerRadius}
            paddingAngle={3}
            labelLine={false}
            label={getLabelText} // Usando a função condicional
            style={{ fontSize: isMobile ? "11px" : "12px" }}
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
