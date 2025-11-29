"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { ProductDetailModal } from "./ProductDetailModal";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { Product, ProductTableProps } from "@/lib/types";
import {
  sortData,
  toggleSelection,
  toggleSelectAll,
  handleShiftSelection,
  paginate,
} from "@/lib/utils";
import { StockHealthBadge } from "../comprar/ui/StockHealthBadge";

const StatusBadge = ({ status }: { status?: string }) => {
  const statusConfig: Record<string, { base: string; label: string }> = {
    Precificado: {
      base: "border-green-500 bg-[#22c55e] text-white",
      label: "Precificado",
    },
    Pendente: {
      base: "border-yellow-400 bg-yellow-100 text-yellow-800",
      label: "Pendente",
    },
    "Não Precificado": {
      base: "border-red-300 bg-red-100 text-red-800",
      label: "Não Precificado",
    },
  };

  const config = (status && statusConfig[status]) || statusConfig.Pendente;

  return (
    <div className="flex justify-center">
      <span
        className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${config.base}`}
      >
        {config.label}
      </span>
    </div>
  );
};

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
  }>({ key: "name", direction: "asc" });
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
  const arrowClass = (key: keyof Product) =>
    `transition-transform duration-200 ${
      sortConfig.key === key ? "text-primary" : "opacity-40"
    } ${
      sortConfig.key === key && sortConfig.direction === "asc"
        ? "rotate-180"
        : ""
    }`;

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const headers: { key: keyof Product; label: string }[] = [
    { key: "name", label: "Produto" },
    { key: "status", label: "Status" },
    { key: "stockHealthStatus", label: "Saúde" },
    { key: "sales", label: "Vendas" },
    { key: "price", label: "Preço" },
    { key: "margin", label: "Margem" },
    { key: "totalProfit", label: "Lucro Total" },
  ];

  return (
    <div className="bg-card rounded-xl border border-border-dark shadow-lg p-4 w-full">
      <ProductDetailModal
        product={selectedProduct}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />
      <div className="flex justify-between items-center pb-3 ">
        <div className="flex items-center gap-4">
          <label className="text-xs font-semibold text-text-secondary flex items-center gap-2">
            Itens por página:
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-border-dark text-xs rounded-md px-2 py-1 bg-background text-text-primary cursor-pointer"
            >
              {[5, 10, 15, 20].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>

        <p className="text-[11px] text-text-secondary">
          Selecionados:{" "}
          <span className="font-semibold text-primary">
            {selectedIds.length}
          </span>
        </p>
      </div>

      <div className="border border-border-dark rounded-lg bg-card overflow-x-auto">
        <table className="min-w-[900px] md:min-w-full table-fixed text-xs">
          <thead className="bg-background-light border-b border-border-dark">
            <tr>
              <th className="w-6 px-2 py-2 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={handleToggleAll}
                  className="h-3.5 w-3.5 cursor-pointer"
                />
              </th>

              {headers.map(({ key, label }) => (
                <th
                  key={String(key)}
                  onClick={() => handleSort(key as keyof Product)}
                  className="px-3 py-3 text-sm font-semibold text-text-secondary cursor-pointer select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <ArrowUpDown size={10} className={arrowClass(key)} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="cursor-pointer">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product, index) => (
                <tr
                  key={product.id}
                  onClick={() => handleRowClick(product)}
                  className={`border-b border-border-dark transition-colors
                      ${
                        selectedIds.includes(product.id)
                          ? "bg-primary/10"
                          : "even:bg-background-light/50 hover:bg-background dark:hover:bg-background"
                      }`}
                >
                  <td
                    className="px-2 py-2 text-center"
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
                      className="h-3.5 w-3.5 cursor-pointer"
                    />
                  </td>

                  <td className="px-2 py-2 flex items-center gap-2 truncate">
                    <div className="w-8 h-8 rounded-md overflow-hidden border border-border-dark bg-background-light">
                      {product.image ? (
                        <Image
                          src={product.image}
                          width={32}
                          height={32}
                          alt=""
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full text-[10px] flex items-center justify-center text-text-secondary">
                          IMG
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold max-w-[200px] ">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-xs text-text-secondary truncate max-w-[90px]">
                        {product.sku}
                      </p>
                    </div>
                  </td>

                  <td className="px-2 py-2 text-xs font-semibold whitespace-nowrap">
                    <StatusBadge status={product.status} />
                  </td>

                  <td className="px-2 py-2 text-center">
                    <StockHealthBadge status={product.stockHealthStatus} />
                  </td>

                  <td className="px-2 py-2 text-right font-mono text-base">
                    {product.sales}
                  </td>

                  <td className="px-2 py-2 text-right font-mono text-base">
                    R$ {product.price.toFixed(2)}
                  </td>

                  <td className="px-2 py-2 text-right font-mono text-base">
                    {product.margin.toFixed(2)}%
                  </td>

                  <td className="px-2 py-2 text-right font-mono text-base">
                    R$ {product.totalProfit.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-8 text-text-secondary"
                >
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-1 mt-3">
          <button
            className="p-1.5 border border-border-dark rounded disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft size={13} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-2 py-1 rounded text-[11px] border border-border-dark ${
                page === currentPage
                  ? "bg-primary text-white"
                  : "hover:bg-background-light"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="p-1.5 border border-border-dark rounded disabled:opacity-40"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
};
