"use client";

import React, { useState } from "react";
import { VendasFilters } from "../../components/Vendas/VendasFilters";
import { VendasTable } from "../../components/Vendas/VendasTable";
import { Card } from "../../components/ui/Card";
import CardVendas from "@/components/ui/CardVendas";

export default function VendasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleSelectAll = () => {
    console.log("Selecionar todos os produtos");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Vendas</h1>

        <VendasFilters
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onSelectAll={handleSelectAll}
        />

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

        <div className="mt-4">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            SELECIONAR TODOS
          </button>
        </div>

        {/* Tabela de vendas */}
        <VendasTable />
      </div>
    </div>
  );
}
