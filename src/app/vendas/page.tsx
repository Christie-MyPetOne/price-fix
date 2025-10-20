"use client"; // Necessário para usar hooks como useState

import React, { useState } from "react";
import { VendasFilters } from "../../components/Vendas/VendasFilters";
import { VendasTable } from "../../components/Vendas/VendasTable";
import { Venda } from "../../lib/types";
import { RefreshCcw } from "lucide-react";
import { Card } from '../../components/ui/Card';
import CardVendas from "@/components/ui/CardVendas";

const MOCK_PRODUCTS: Venda[] = [
  {
    id: "prod1",
    imagens: "fdsds",
    name: "2 Difusores de Ambiente Canela E Cravo Magiland 250ml",
    sales: 2,
    status: "Precificado",
    price: 39.06,
    margin: 15.1,
    totalProfit: 11.8,
    workingCapital: -15.62,
    consiliacao: "!",
  },
  {
    id: "prod2",
    imagens: "fdsds",
    name: "3 Brinquedo Mordedor Osso Bambu Floresta Para Cães Tam M Verde",
    sales: 1,
    status: "Precificado",
    price: 119.34,
    margin: 66.16,
    totalProfit: 78.95,
    workingCapital: -47.74,
    consiliacao: "!",
  },
  {
    id: "prod3",
    imagens: "fdsds",
    name: "Açopragifia Paraguaçues - 802",
    sales: 9,
    status: "Precificado",
    price: 74.4,
    margin: 0.59,
    totalProfit: 4.08,
    workingCapital: -25.47,
    consiliacao: "!",
  },
  {
    id: "prod4",
    imagens: "fdsds",
    name: "Açopragifia Paraguaçues - 802",
    sales: 9,
    status: "Precificado",
    price: 88.22,
    margin: 12.05,
    totalProfit: 96.66,
    workingCapital: -20.38,
    consiliacao: "!",
  },
  {
    id: "prod5",
    imagens: "fdsds",
    name: "Adaptil Coleira Refil - 48 ML",
    sales: 8,
    status: "Precificado",
    price: 138.98,
    margin: -7.49,
    totalProfit: -83.31,
    workingCapital: -92.6,
    consiliacao: "!",
  },
  {
    id: "prod6",
    imagens: "fdsds",
    name: "Ração Seca Royal Canin Maxi Light Weight Care Para Cães Adultos De Raças Grandes",
    sales: 5,
    status: "Pendente",
    price: 250.0,
    margin: 10.0,
    totalProfit: 125.0,
    workingCapital: -50.0,
    consiliacao: "!",
  },
  {
    id: "prod7",
    imagens: "fdsds",
    name: "Brinquedo Bola Maciça Super Resistente Para Cães Duraball",
    sales: 15,
    status: "Erro",
    price: 45.9,
    margin: -2.0,
    totalProfit: -10.0,
    workingCapital: 10.0,
    consiliacao: "!",
  },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const filteredProducts = MOCK_PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter((product) => {
    return true; //
  });

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

        {/* Botão "Selecionar Todos" abaixo dos filtros, como na imagem */}
        <div className="mt-4">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            SELECIONAR TODOS
          </button>
        </div>
        
        {/* Indicador de carregamento */}
        {loading ? (
          <div className="flex justify-center items-center h-48 bg-white mt-6 rounded-lg shadow-md">
            <span className="text-gray-500 flex items-center gap-2">
              <RefreshCcw className="animate-spin" /> Carregando...
            </span>
          </div>
        ) : (
          <VendasTable vendas />
        )}

      </div>
    </div>
  );
}
