"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ShoppingCart, CalendarDays, Settings2 } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { PurchaseConfigModal } from "@/components/comprar/PurchaseConfigModal";
import { PurchaseTable } from "@/components/comprar/PurchaseTable";
import { PurchaseFilters } from "@/components/comprar/PurchaseFilters";
import { Product } from "@/lib/types";
import { PurchaseStatusCard } from "@/components/comprar/PurchaseStatusCard";

const Button = ({
  children,
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "default";
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-gray-800 text-white hover:bg-gray-700",
    outline: "border border-border-dark hover:bg-background",
    ghost: "hover:bg-background",
  };
  const sizes = { default: "h-10 px-4", sm: "h-9 px-3" };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function OtimizarComprasPage() {
  const { sortedProducts, fetchProducts } = useProductStore();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockHealthFilter, setStockHealthFilter] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isStockConfigModalOpen, setIsStockConfigModalOpen] = useState(false);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Buscar produtos
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };
    load();
  }, [fetchProducts]);

  // Lógica de filtro
  const filteredProducts = useMemo(() => {
    let products = sortedProducts;

    if (searchTerm) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (stockHealthFilter) {
      products = products.filter(
        (p) => getStockHealth(p) === stockHealthFilter
      );
    }

    return products;
  }, [sortedProducts, searchTerm, stockHealthFilter]);

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / rowsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSelectAll = () => {
    if (selectedItems.length === totalProducts) setSelectedItems([]);
    else setSelectedItems(filteredProducts.map((p) => p.id));
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // Regras
  const getPurchaseStatus = (product: Product) => {
    const salesHistory = product.salesHistory ?? [];
    const totalSales = salesHistory.reduce((a, b) => a + b, 0);
    const salesPerDay = totalSales / (salesHistory.length || 1);
    const daysLeft =
      product.stockLevel && salesPerDay > 0
        ? product.stockLevel / salesPerDay
        : Infinity;
    if ((product.stockLevel ?? 0) <= 0 && salesPerDay > 0) return "Sem Estoque";
    if (daysLeft < 40) return "Comprar";
    return "Ok";
  };

  const getStockHealth = (product: Product) => {
    const totalSales = product.salesHistory?.reduce((a, b) => a + b, 0) || 0;
    const salesPerDay = totalSales / (product.salesHistory?.length || 1);
    const daysLeft =
      product.stockLevel && salesPerDay > 0
        ? product.stockLevel / salesPerDay
        : Infinity;
    if (daysLeft > 60) return "Congelado";
    if (daysLeft > 50) return "Ruim";
    if (daysLeft > 40) return "Média";
    return "Bom";
  };

  return (
    <>
      <div className="container mx-auto p-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-text flex items-center gap-2">
            <ShoppingCart className="w-7 h-7" /> Comprar
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarDays size={18} /> Jul 2025 - Out 2025
            </Button>
            <Button
              variant="secondary"
              className="flex items-center gap-2"
              onClick={() => setIsStockConfigModalOpen(true)}
            >
              <Settings2 size={18} /> Configurar Saúde de Estoque
            </Button>
          </div>
        </div>

        <PurchaseStatusCard
          products={filteredProducts}
          getPurchaseStatus={getPurchaseStatus}
        />

        {/* Filtros extraídos */}
        <PurchaseFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          stockHealthFilter={stockHealthFilter}
          setStockHealthFilter={setStockHealthFilter}
          onFilter={() => setCurrentPage(1)}
        />

        {/* Tabela */}
        <PurchaseTable
          loading={loading}
          displayedProducts={displayedProducts}
          filteredProducts={filteredProducts}
          selectedItems={selectedItems}
          handleSelectAll={handleSelectAll}
          handleSelectItem={handleSelectItem}
          totalProducts={totalProducts}
          searchTerm={searchTerm}
          getPurchaseStatus={getPurchaseStatus}
          getStockHealth={getStockHealth}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      <PurchaseConfigModal
        open={isStockConfigModalOpen}
        onClose={() => setIsStockConfigModalOpen(false)}
      />
    </>
  );
}
