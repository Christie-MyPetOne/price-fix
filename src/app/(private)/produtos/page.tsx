"use client";

import React, { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { Product } from "@/lib/types";
import { useProductStore } from "@/store/useProductStore";
import { ProductFilters } from "@/components/produtos/ProductFilters";
import { ProductTable } from "@/components/produtos/ProductTable";
import { ProductDetailModal } from "@/components/produtos/ProductModal";

export default function ProductsPage() {
  const { sortedProducts, fetchProducts } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const filteredProducts = sortedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 h-full w-full px-3 sm:px-4 md:px-6 pb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-text">
            Meus produtos
          </h1>

          <ProductFilters
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onSelectAll={handleSelectAll}
          />

          {loading ? (
            <div className="flex justify-center items-center h-48 bg-card mt-6 rounded-lg shadow-md">
              <span className="text-text-secondary flex items-center gap-2 text-sm">
                <RefreshCcw className="animate-spin" /> Carregando...
              </span>
            </div>
          ) : (
            <ProductTable
              products={filteredProducts}
              onRowClick={handleRowClick}
            />
          )}
        </div>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        onClose={handleCloseModal}
      />
    </>
  );
}
