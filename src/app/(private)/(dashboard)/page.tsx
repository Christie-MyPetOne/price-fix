"use client";

import { useState } from "react";
import { DashFilter } from "@/components/dashboard/DashFilter";
import KpiCard from "@/components/dashboard/kpiCard";
import KpiCardPlus from "@/components/dashboard/kpiCardPlus";
import GraficoBar from "@/components/dashboard/GraficoBar";
import GraficoPeR from "@/components/dashboard/GraficoPeR";
import GraficoMargem from "@/components/dashboard/GraficoMargen";
import { Card } from "@/components/ui/Card"; 
import ListaKpi from "@/components/dashboard/ListaKpi";
import {
  kpiData,
  kpiData2,
  kpiDataPlus,
  receitaPorCanal,
  series,
  pedidosReceita,
  dataMargem,
  topMarketplacesData,
} from  "@/components/dashboard/Data"

export default function DashboardPage() {
  // 👇 Estado e função devem estar DENTRO do componente
  const [mostrarLista, setMostrarLista] = useState(false);

  const toggleLista = () => {
    setMostrarLista((prev) => !prev); // alterna entre true e false
  };

  return (
    <div className="max-w-7xl mx-auto w-full container p-4 sm:p-6 md:p-8 space-y-8">
      <DashFilter />

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* GRÁFICOS */}
      <GraficoBar
        title="Receita por canal"
        data={receitaPorCanal}
        xKey="date"
        series={series}
      />

      <div className="flex gap-4 w-full">
        <div className="flex-1">
          <GraficoPeR
            title="Pedidos x Receita"
            data={pedidosReceita}
            xKey="mes"
            series={[{ key: "pedidos", label: "Pedidos", color: "#413ea0" }]}
            line={{
              key: "receita",
              label: "Receita (R$)",
              color: "#ff7300",
              dot: true,
            }}
          />
        </div>

        <div className="flex-1">
          <GraficoMargem title="Margem Bruta (%)" data={dataMargem} xKey="date" />
        </div>
      </div>

      {/* KPI PLUS + LISTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiDataPlus.map((kpiP) => (
          <KpiCardPlus
            key={kpiP.title}
            {...kpiP}
            onToggleLista={toggleLista}
            listaAtiva={mostrarLista}
          />
        ))}

        {kpiData2.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Lista visível somente quando mostrarLista for true */}
      {mostrarLista && <ListaKpi />}
    </div>
  );
}
