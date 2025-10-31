"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Product, ProductTableProps } from "@/lib/types";
import {
  sortData,
  toggleSelection,
  toggleSelectAll,
  handleShiftSelection,
  paginate,
} from "@/lib/utils";
import { StockStatusIcons } from "../ui/StockStatusIcons";

const RechartsSparkline = dynamic(
  () => import("../ui/Charts").then((mod) => mod.RechartsSparkline),
  { ssr: false }
);

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onRowClick,
}) => {
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

  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md mt-6 border border-border-dark w-full">
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

      <div className="w-full rounded-md">
        <table className="w-full table-auto divide-y divide-border-dark">
          <thead className="bg-background">
            <tr>
              <th className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleAll}
                  className="rounded border-border-dark text-primary cursor-pointer"
                />
              </th>
              {[
                { key: "name", label: "Nome" },
                { key: "status", label: "Status" },
                { key: "alerts", label: "Alertas" },
                { key: "sales", label: "Vendas", hideOnMobile: true },
                { key: "price", label: "Faturamento", hideOnMobile: true },
                { key: "margin", label: "Margem", hideOnMobile: true },
                {
                  key: "totalProfit",
                  label: "Lucro total",
                  hideOnMobile: true,
                },
              ].map(({ key, label, hideOnMobile }) => (
                <th
                  key={String(key)}
                  onClick={() =>
                    key !== "alerts" && handleSort(key as keyof Product)
                  }
                  className={`px-3 py-3 text-left text-[0.65rem] font-medium text-text-secondary uppercase tracking-wider ${
                    hideOnMobile ? "hidden sm:table-cell" : ""
                  } ${
                    key !== "alerts"
                      ? "cursor-pointer select-none"
                      : "text-center"
                  }`}
                >
                  <div
                    className={`flex items-center gap-1 ${
                      key === "alerts" ? "justify-center" : ""
                    }`}
                  >
                    {label}
                    {key !== "alerts" && (
                      <ArrowUpDown
                        size={13}
                        className={`transition-transform ${
                          sortConfig.key === key
                            ? "text-primary"
                            : "text-gray-400"
                        } ${
                          sortConfig.key === key &&
                          sortConfig.direction === "asc"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-card divide-y divide-border-dark text-xs sm:text-sm">
            {displayedProducts.length ? (
              displayedProducts.map((product, index) => (
                <tr
                  key={product.id}
                  onClick={() => onRowClick(product)}
                  className="hover:bg-background transition-colors cursor-pointer"
                >
                  <td
                    className="px-2 py-2"
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
                      className="rounded border-border-dark text-primary cursor-pointer"
                    />
                  </td>

                  <td className="py-3 text-xs font-medium text-text flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="w-9 h-9 flex-shrink-0 relative mr-2">
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
                    <div className="flex flex-col">
                      <span className="truncate max-w-[120px] sm:max-w-none">
                        {product.name}
                      </span>
                      <span className="text-[0.6rem] text-text-secondary mt-0.5">
                        SKU: {product.sku}
                      </span>
                    </div>
                  </td>

                  <td className="px-2 py-1.5 text-[0.65rem] sm:text-xs">
                    <span
                      className={`px-1.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                        product.status === "Precificado"
                          ? "bg-primary-dark text-white"
                          : product.status === "Pendente"
                          ? "bg-warning text-gray-900"
                          : "bg-error text-white"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-center">
                    <StockStatusIcons product={product} />
                  </td>

                  <td className="px-3 py-3 hidden sm:table-cell text-xs text-text-secondary">
                    <div className="flex items-center justify-between min-w-[80px]">
                      <span>{product.sales}</span>
                      <div className="flex items-center justify-center w-[3rem]">
                        <RechartsSparkline
                          data={(product.salesHistory || []).map((value) => ({
                            value,
                          }))}
                          color="var(--color-info)"
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3 hidden sm:table-cell text-xs text-text">
                    {product.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>

                  <td className="px-3 py-3 hidden sm:table-cell text-xs text-text">
                    {product.margin.toFixed(2)}%
                  </td>

                  <td className="px-3 py-3 hidden sm:table-cell text-xs">
                    <div className="flex items-center justify-between min-w-[80px]">
                      <span
                        className={`${
                          product.totalProfit < 0
                            ? "text-error"
                            : "text-primary"
                        }`}
                      >
                        {product.totalProfit.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      <div className="flex items-center justify-center w-[3rem]">
                        <RechartsSparkline
                          data={(product.profitHistory || []).map((value) => ({
                            value,
                          }))}
                          color={
                            product.totalProfit < 0
                              ? "var(--color-error)"
                              : "var(--color-primary)"
                          }
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-sm text-text-secondary"
                >
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-dark bg-card px-4 py-3 mt-2">
        <div className="flex gap-2">
          <button
            className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-xs sm:hidden">
            {currentPage}/{totalPages}
          </span>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(0, 5)
            .map((page) => (
              <button
                key={page}
                className={`hidden sm:inline p-2 rounded-md text-xs font-semibold ${
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
            className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background disabled:opacity-40"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
