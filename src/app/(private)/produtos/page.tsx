"use client";

import React, { useState, useEffect } from "react";
import { PackageCheck, RefreshCcw } from "lucide-react";
import { useProductsStore } from "@/store/useProductsStore";
import { ProductFilters } from "@/components/produtos/ProductFilters";
import { ProductTable } from "@/components/produtos/ProductTable";

export default function ProductsPage() {
  const { sortedProducts, fetchProducts } = useProductsStore();
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredProducts = sortedProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="max-w-5xl mx-auto w-full flex flex-col lg:flex-row gap-6 h-full">
        <div className="flex-1 min-w-0 ">
          <div className="text-2xl sm:text-2xl font-bold my-6 ml-3 text-text">
            <span className="flex items-center gap-2">
              <PackageCheck size={20} className="text-primary" />
              Produtos
            </span>
          </div>

          <ProductFilters
            onSearch={handleSearch}
            onFilterChange={() => {}}
            onSelectAll={() => {}}
          />

          {loading ? (
            <div className="flex justify-center items-center h-48 bg-card mt-6 rounded-lg shadow-md">
              <span className="text-text-secondary flex items-center gap-2 text-sm">
                <RefreshCcw className="animate-spin" /> Carregando...
              </span>
            </div>
          ) : (
            <ProductTable products={filteredProducts} />
          )}
        </div>
      </div>
    </>
  );
}
