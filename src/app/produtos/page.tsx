"use client"; // Necessário para usar hooks como useState

import React, { useState } from "react";
import { ProductFilters } from "../../components/produtos/ProductFilters";
import { ProductTable } from "../../components/produtos/ProductTable";
import { FinanceIndicators } from "../../components/produtos/FinanceIndicators";
import { Product } from "../../lib/types";
import { RefreshCcw } from "lucide-react";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod1",
    name: "2 Difusores de Ambiente Canela E Cravo Magiland 250ml",
    sales: 2,
    status: "Precificado",
    price: 39.06,
    margin: 15.1,
    totalProfit: 11.8,
    workingCapital: -15.62,
    origin: "MYPETONE",
  },
  {
    id: "prod2",
    name: "3 Brinquedo Mordedor Osso Bambu Floresta Para Cães Tam M Verde",
    sales: 1,
    status: "Precificado",
    price: 119.34,
    margin: 66.16,
    totalProfit: 78.95,
    workingCapital: -47.74,
    origin: "MYPETONE",
  },
  {
    id: "prod3",
    name: "Açopragifia Paraguaçues - 802",
    sales: 9,
    status: "Precificado",
    price: 74.4,
    margin: 0.59,
    totalProfit: 4.08,
    workingCapital: -25.47,
    origin: "MYPETONE - FULL (894)",
  },
  {
    id: "prod4",
    name: "Açopragifia Paraguaçues - 802",
    sales: 9,
    status: "Precificado",
    price: 88.22,
    margin: 12.05,
    totalProfit: 96.66,
    workingCapital: -20.38,
    origin: "MAGALU MARKETPLACE (1143)",
  },
  {
    id: "prod5",
    name: "Adaptil Coleira Refil - 48 ML",
    sales: 8,
    status: "Precificado",
    price: 138.98,
    margin: -7.49,
    totalProfit: -83.31,
    workingCapital: -92.6,
    origin: "AMAZON FBA (8675)",
  },
  {
    id: "prod6",
    name: "Ração Seca Royal Canin Maxi Light Weight Care Para Cães Adultos De Raças Grandes",
    sales: 5,
    status: "Pendente",
    price: 250.0,
    margin: 10.0,
    totalProfit: 125.0,
    workingCapital: -50.0,
    origin: "Petz",
  },
  {
    id: "prod7",
    name: "Brinquedo Bola Maciça Super Resistente Para Cães Duraball",
    sales: 15,
    status: "Erro",
    price: 45.9,
    margin: -2.0,
    totalProfit: -10.0,
    workingCapital: 10.0,
    origin: "Mercado Livre",
  },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const filteredProducts = MOCK_PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter((product) => {
    return true;
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center">
            <p className="text-sm">
              <span className="font-semibold">Sincronização</span> não feita
              ainda, clique no botão para sincronizar.
            </p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50 transition-colors">
              CONFIGURAR CANAIS
            </button>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Meus produtos</h1>
        <ProductFilters
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onSelectAll={handleSelectAll}
        />
        <div className="mt-4">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            SELECIONAR TODOS
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-48 bg-white mt-6 rounded-lg shadow-md">
            <span className="text-gray-500 flex items-center gap-2">
              <RefreshCcw className="animate-spin" /> Carregando...
            </span>
          </div>
        ) : (
          <ProductTable products={filteredProducts} />
        )}
      </div>

      <div className="lg:w-80 flex-shrink-0">
        <FinanceIndicators />
      </div>
    </div>
  );
}
