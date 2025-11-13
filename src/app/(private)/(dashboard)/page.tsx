"use client";

import { useState, useEffect } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";

import { DashFilter } from "@/components/dashboard/DashFilter";
import KpiCard from "@/components/dashboard/kpiCard";
import KpiCardPlus from "@/components/dashboard/kpiCardPlus";
import GraficoBar from "@/components/dashboard/GraficoBar";
import GraficoPeR from "@/components/dashboard/GraficoPeR";
import GraficoMargem from "@/components/dashboard/GraficoMargen";
import ListaKpi from "@/components/dashboard/ListaKpi";

export default function DashboardPage() {
  const [mostrarLista, setMostrarLista] = useState(false);
  const [mode, setMode] = useState<"reais" | "percentual">("reais");

  const dashboardData = useDashboardStore((state: any) => state.dashboardData);
  const isLoading = useDashboardStore((state: any) => state.isLoading);
  const error = useDashboardStore((state: any) => state.error);

  const fetchDashboardData = useDashboardStore(
    (state: any) => state.fetchDashboardData
  );

  useEffect(() => {
    if (!dashboardData) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, dashboardData]);

  const toggleLista = () => {
    setMostrarLista((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full min-h-[calc(100vh-200px)]">
        <p className="text-xl font-medium text-text">Carregando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full min-h-[calc(100vh-200px)] p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">
          <strong className="font-bold">Erro ao carregar os dados!</strong>
          <span className="block sm:inline">
            {" "}
            Por favor, tente novamente mais tarde.
          </span>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center w-full min-h-[calc(100vh-200px)]">
        <p className="text-lg text-gray-500">
          Nenhum dado encontrado para exibir.
        </p>
      </div>
    );
  }

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData.kpiData.map((kpi: any) => (
          <KpiCard key={kpi.title} {...kpi} className="bg-card " />
        ))}
      </div>

      <GraficoBar
        title="Receita por canal"
        data={dashboardData.receitaPorCanal}
        xKey="date"
        series={dashboardData.series}
      />

      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="flex-1">
          <GraficoPeR
            title="Pedidos x Receita"
            data={dashboardData.pedidosReceita}
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
            data={dashboardData.dataMargem}
            xKey="date"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData.kpiDataPlus.map((kpiP: any) => (
          <KpiCardPlus
            key={kpiP.title}
            {...kpiP}
            onToggleLista={toggleLista}
            listaAtiva={mostrarLista}
            mode={mode}
            setMode={setMode}
          />
        ))}

        {dashboardData.kpiData2.map((kpi: any) => (
          <KpiCard key={kpi.title} {...kpi} className="bg-card " />
        ))}
      </div>

      {mostrarLista && <ListaKpi mode={mode} />}

      <GraficoBar
        title="Margem por canal de venda"
        data={dashboardData.receitaPorCanal}
        xKey="date"
        series={dashboardData.series}
      />
    </div>
  );
}
