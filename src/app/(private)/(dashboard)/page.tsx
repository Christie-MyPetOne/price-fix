"use client";

import { useState } from "react";
import { DashFilter } from "@/components/dashboard/DashFilter";
import KpiCard from "@/components/dashboard/kpiCard";
import KpiCardPlus from "@/components/dashboard/kpiCardPlus";
import GraficoBar from "@/components/dashboard/GraficoBar";
import GraficoPeR from "@/components/dashboard/GraficoPeR";
import GraficoMargem from "@/components/dashboard/GraficoMargen";

import ListaKpi from "@/components/dashboard/ListaKpi";
import {
  kpiData,
  kpiData2,
  kpiDataPlus,
  receitaPorCanal,
  series,
  pedidosReceita,
  dataMargem,
} from "@/components/dashboard/Data";

export default function DashboardPage() {
  // Estado para mostrar lista
  const [mostrarLista, setMostrarLista] = useState(false);
  // Estado para modo de exibição
  const [mode, setMode] = useState<"reais" | "percentual">("reais");

  const toggleLista = () => {
    setMostrarLista((prev) => !prev);
  };

  return (
    <div className="max-w-8xl -mt-8 mx-auto w-full container p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex items-center w-full mb-6">
        <h1 className="text-3xl justify-center font-semibold text-text">
          Dashboard
        </h1>
        <div className=" -ml-20">
          <DashFilter />
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} className="bg-card " />
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
          <GraficoMargem
            title="Margem Bruta (%)"
            data={dataMargem}
            xKey="date"
          />
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
            mode={mode}
            setMode={setMode}
          />
        ))}

        {kpiData2.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} className="bg-card " />
        ))}
      </div>

      {/* Lista visível somente quando mostrarLista for true */}
      {mostrarLista && <ListaKpi mode={mode} />}

      {/* GRÁFICOS */}
      <GraficoBar
        title="Margem por canal de venda"
        data={receitaPorCanal}
        xKey="date"
        series={series}
      />
    </div>
  );
}
