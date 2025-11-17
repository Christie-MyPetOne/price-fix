"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ProductDetailModal } from "./ProductDetailModal";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Snowflake,
} from "lucide-react";
import { Product, ProductTableProps } from "@/lib/types";
import {
  sortData,
  toggleSelection,
  toggleSelectAll,
  handleShiftSelection,
  paginate,
} from "@/lib/utils";

const RechartsSparkline = dynamic(
  () => import("../charts/Charts").then((mod) => mod.RechartsSparkline),
  { ssr: false }
);

export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const orderedProducts = useMemo(() => {
    if (!products) return [];
    if (sortConfig.key)
      return sortData(products, sortConfig.key, sortConfig.direction);
    return products;
  }, [products, sortConfig]);

  const { pageData: displayedProducts, totalPages } = useMemo(
    () => paginate(orderedProducts, currentPage, rowsPerPage),
    [orderedProducts, currentPage, rowsPerPage]
  );

  const allSelected =
    selectedIds.length === displayedProducts.length &&
    displayedProducts.length > 0;
  const isIndeterminate =
    selectedIds.length > 0 && !allSelected && displayedProducts.length > 0;

  const handleToggleOne = (id: string, index: number, shiftKey?: boolean) => {
    setSelectedIds((prev) => {
      const updated = shiftKey
        ? handleShiftSelection(id, displayedProducts, prev, lastSelectedIndex)
        : toggleSelection(prev, id);
      return updated;
    });
    setLastSelectedIndex(index);
  };

  const handleToggleAll = () => {
    setSelectedIds((prev) => toggleSelectAll(displayedProducts, prev));
  };

  const handleSort = (key: keyof Product) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const StockHealthBadge = ({ status }: { status?: string }) => {
    const healthConfig: Record<
      string,
      { color: string; icon: React.ElementType; label: string }
    > = {
      Excelente: {
        color: "text-green-500",
        icon: CheckCircle2,
        label: "Excelente",
      },
      Moderado: {
        color: "text-yellow-500",
        icon: AlertTriangle,
        label: "Moderado",
      },
      Risco: { color: "text-red-500", icon: XCircle, label: "Risco" },
      Parado: { color: "text-blue-400", icon: Snowflake, label: "Parado" },
    };

    const config = healthConfig[status || "Moderado"];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.color}`}
      >
        <Icon size={14} /> {config.label}
      </span>
    );
  };

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-card rounded-lg border border-border-dark shadow-sm p-4 w-full">
      <ProductDetailModal
        product={selectedProduct}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />
      {/* Cabeçalho superior */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
        <label className="text-xs sm:text-sm font-semibold text-text-secondary flex items-center gap-2">
          Mostrar
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-border-dark text-xs rounded px-1 py-1"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          itens
        </label>

        <p className="text-[0.65rem] sm:text-xs text-text-secondary text-center sm:text-right">
          Selecionados:{" "}
          <span className="font-medium">{selectedIds.length}</span> - Mostrando{" "}
          <span className="font-medium">
            {(currentPage - 1) * rowsPerPage + 1}
          </span>{" "}
          a{" "}
          <span className="font-medium">
            {Math.min(currentPage * rowsPerPage, orderedProducts.length)}
          </span>{" "}
          de <span className="font-medium">{orderedProducts.length}</span>{" "}
          produtos
        </p>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left divide-border-dark min-w-[900px] lg:min-w-full">
          <thead className="bg-background text-xs text-text uppercase">
            <tr>
              <th className="px-3 py-3 w-10 text-center sticky left-0 bg-background z-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={handleToggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer bg-white"
                />
              </th>

              {[
                { key: "name", label: "Produto" },
                { key: "status", label: "Status" },
                { key: "stockHealthStatus", label: "Saúde" },
                { key: "sales", label: "Vendas" },
                { key: "price", label: "Preço" },
                { key: "margin", label: "Margem" },
                { key: "totalProfit", label: "Lucro Total" },
              ].map(({ key, label }) => (
                <th
                  key={String(key)}
                  onClick={() => handleSort(key as keyof Product)}
                  className={`px-3 py-3 text-left font-medium text-text-secondary cursor-pointer select-none ${
                    key === "name" ? "min-w-[200px]" : "whitespace-nowrap"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <ArrowUpDown
                      size={14}
                      className={`${
                        sortConfig.key === key
                          ? "text-green-500"
                          : "text-gray-400 opacity-50"
                      }`}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border-dark cursor-pointer">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product, index) => (
                <tr
                  key={product.id}
                  onClick={() => handleRowClick(product)}
                  className="hover:bg-background transition-colors"
                >
                  <td
                    className="px-3 py-2 text-center sticky left-0 bg-card z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      readOnly
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleOne(product.id, index, e.shiftKey);
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-orange-500 cursor-pointer bg-white"
                    />
                  </td>

                  <td className="px-3 py-2 flex items-center gap-2 min-w-[200px]">
                    <div className="w-9 h-9 relative flex-shrink-0">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-border-dark rounded" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text">
                        {product.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        SKU: {product.sku}
                      </p>
                    </div>
                  </td>

                  <td className="px-3 py-2 text-xs font-semibold whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-[0.65rem] ${
                        product.status === "Precificado"
                          ? "bg-green-500"
                          : product.status === "Pendente"
                          ? "bg-yellow-500 text-black"
                          : "bg-red-500"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    <StockHealthBadge status={product.stockHealthStatus} />
                  </td>

                  <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                    {product.sales}
                  </td>

                  <td className="px-3 py-2 text-xs text-right">
                    R$ {product.price.toFixed(2)}
                  </td>

                  <td className="px-3 py-2 text-xs text-right">
                    {product.margin.toFixed(2)}%
                  </td>

                  <td className="px-3 py-2 text-xs text-right">
                    R$ {product.totalProfit.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="text-center py-10 text-text-secondary"
                >
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border-dark bg-card px-4 py-3 mt-2">
          <div className="flex gap-2">
            <button
              className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`p-2 rounded-md text-xs font-semibold ${
                  page === currentPage
                    ? "bg-primary text-white"
                    : "ring-1 ring-border-dark hover:bg-background"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
