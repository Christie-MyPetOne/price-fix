"use client";

import React, { useMemo } from "react";
import { calcularDominio } from "@/lib/utils";
import { GraficoMargemProps } from "@/lib/types";
import { ChartGraficoMargem } from "@/components/charts/ChartGraficoMargen";

const GraficoMargem: React.FC<GraficoMargemProps> = ({
  title = "Margem (%)",
  data,
  xKey,
  yKey = "margem",
  height = 305,
}) => {
  const { isFraction, domain } = useMemo(
    () => calcularDominio(data, yKey),
    [data, yKey]
  );

  return (
    <div className="rounded-xl border border-border-dark bg-card text-text shadow-lg p-4 focus:outline-none">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <div className="w-full h-[250px] md:h-[307px]">
        <ChartGraficoMargem
          data={data}
          xKey={xKey}
          yKey={yKey}
          domain={domain}
          isFraction={isFraction}
        />
      </div>
    </div>
  );
};

export default GraficoMargem;
