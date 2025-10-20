"use client";

import React, { useState, useEffect } from "react";
import { ProductFilters } from "../../components/produtos/ProductFilters";
import { ProductTable } from "../../components/produtos/ProductTable";
import { useProductStore } from "../../store/useProductStore";
import { RefreshCcw } from "lucide-react";

export default function ProductsPage() {
  const { sortedProducts, fetchProducts } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };
    loadProducts();
  }, [fetchProducts]);

  const handleSearch = (term: string) => setSearchTerm(term);
  const handleFilterChange = (filterName: string, value: string) =>
    setFilters((prev) => ({ ...prev, [filterName]: value }));

  const handleSelectAll = () => console.log("Selecionar todos os produtos");

  // Filtra produtos pelo termo de busca
  const filteredProducts = sortedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full w-full px-3 sm:px-4 md:px-6 pb-6">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
          Meus produtos
        </h1>

        <ProductFilters
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onSelectAll={handleSelectAll}
        />

        <div className="mt-4">
          <button
            onClick={handleSelectAll}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            SELECIONAR TODOS
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48 bg-white mt-6 rounded-lg shadow-md">
            <span className="text-gray-500 flex items-center gap-2 text-sm">
              <RefreshCcw className="animate-spin" /> Carregando...
            </span>
          </div>
        ) : (
          <ProductTable />
        )}
      </div>
    </div>
  );
}
