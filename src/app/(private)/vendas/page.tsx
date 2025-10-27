"use client";

import React, { useState } from "react";
import { VendasFilters } from "@/components/vendas/VendasFilters";
import { VendasTable } from "@/components/vendas/VendasTable";
import { Card } from "@/components/ui/Card";
import CardVendas from "@/components/ui/CardVendas";
import MargensChart from "@/components/vendas/MargensChart";
import { useSalesStore } from "@/store/useSalesStore";

type FiltersState = {
  date: string;
  empresa: string;
  canal: string;
  produto: string;
};

export default function VendasPage() {
  const { filterSales, clearFilters } = useSalesStore();

  // estado local dos filtros do TOPO
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FiltersState>({
    date: "",
    empresa: "",
    canal: "",
    produto: "",
  });

  // handlers do VendasFilters (TOPO)
  const handleSearch = (term: string) => setSearchTerm(term);

  const handleFilterChange = (filterName: string, value: string) => {
    if (filterName === "apply") {
      const allEmpty =
        !searchTerm &&
        !filters.date &&
        !filters.empresa &&
        !filters.canal &&
        !filters.produto;

      if (allEmpty) {
        clearFilters();
      } else {
        filterSales({
          q: searchTerm,
          date: filters.date,
          empresa: filters.empresa,
          canal: filters.canal,
          produto: filters.produto,
        });
      }
      return;
    }

    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleSelectAll = (checked: boolean) => {
    // opcional: sincronizar com a tabela via store/contexto
    console.log("Selecionar todos (topo):", checked);
  };

  // Dados do gráfico (exemplo)
  const buckets = [
    {
      id: "alta",
      titulo: "Margem alta",
      orders: 43175,
      percent: 56.52,
      lucro: 620760.73,
      color: "bg-blue-600",
    },
    {
      id: "media",
      titulo: "Margem média",
      orders: 8323,
      percent: 10.9,
      lucro: 105290.26,
      color: "bg-green-600",
    },
    {
      id: "baixa",
      titulo: "Margem baixa",
      orders: 14575,
      percent: 19.08,
      lucro: 80552.51,
      color: "bg-amber-500",
    },
    {
      id: "preju",
      titulo: "Prejuízo",
      orders: 5891,
      percent: 7.71,
      lucro: -33317.38,
      color: "bg-red-600",
    },
    {
      id: "incompleto",
      titulo: "Incompletos",
      orders: 4420,
      percent: 5.79,
      lucro: 0,
      color: "bg-gray-600",
    },
  ];

  const legend = [
    { label: "Alta", range: "> 20,00%" },
    { label: "Média", range: "12,00% - 20,00%" },
    { label: "Baixa", range: "< 12,00%" },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col lg:flex-row gap-6 h-full">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-4 text-color-text">Vendas</h1>

        {/* FILTROS DO TOPO — únicos */}
        <VendasFilters
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onSelectAll={handleSelectAll}
        />

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardVendas Nome="Faturamento" Valor="R$ 150,00" />
          </Card>
          <Card>
            <CardVendas Nome="Margem" Valor="15%" />
          </Card>
          <Card>
            <CardVendas Nome="Pedidos Realizados" Valor="75000" />
          </Card>
        </div>

        {/* Gráfico de Margens (mantido) */}
        <div className="mt-8">
          <MargensChart
            buckets={buckets}
            legend={legend}
            onChangeSelection={(ids) => console.log("Selecionados:", ids)}
            onEditRanges={() => console.log("Editar faixas de margens")}
          />
        </div>

        {/* Tabela (sem filtros próprios) */}
        <VendasTable />
      </div>
    </div>
  );
}
