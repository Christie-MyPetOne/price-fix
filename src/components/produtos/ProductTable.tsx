"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Product, ProductTableProps } from "@/lib/types";
import { sortData, toggleSelection, toggleSelectAll } from "@/lib/utils";
import { useProductStore } from "@/store/useProductStore";
import { ProductHealthIcons } from "./ProductHealthIcons";

const RechartsSparkline = dynamic(
  () => import("../produtos/Charts").then((mod) => mod.RechartsSparkline),
  {
    ssr: false,
    loading: () => (
      <div style={{ width: 60, height: 20 }} className="inline-block ml-2" />
    ),
  }
);

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onRowClick,
}) => {
  const {
    sortedProducts: storeSorted,
    selected: storeSelected,
    sortConfig: storeSortConfig,
    toggleOne: storeToggleOne,
    toggleAll: storeToggleAll,
    sortBy: storeSortBy,
    fetchProducts,
  } = useProductStore();

  const sourceProducts = products ?? storeSorted;

  const [localSelected, setLocalSelected] = useState<string[]>(
    products ? [] : storeSelected
  );

  const [localSort, setLocalSort] = useState<{
    key: keyof Product | null;
    direction: "asc" | "desc";
  }>(products ? { key: null, direction: "asc" } : storeSortConfig);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (!products) fetchProducts();
  }, [products, fetchProducts]);

  useEffect(() => {
    if (products) {
      setLocalSelected([]);
      setCurrentPage(1);
    }
  }, [products]);

  const toggleOne = (id: string) => {
    if (products) {
      setLocalSelected((prev) => toggleSelection(prev, id));
    } else {
      storeToggleOne(id);
    }
  };

  const toggleAll = () => {
    if (products) {
      setLocalSelected((prev) =>
        toggleSelectAll(sourceProducts as Product[], prev)
      );
    } else {
      storeToggleAll();
    }
  };

  const handleSort = (key: keyof Product) => {
    if (products) {
      const direction =
        localSort.key === key && localSort.direction === "asc" ? "desc" : "asc";
      setLocalSort({ key, direction });
    } else {
      storeSortBy(key);
    }
  };

  const orderedProducts = useMemo(() => {
    if (!sourceProducts) return [];
    if (products && localSort.key) {
      return sortData(sourceProducts, localSort.key, localSort.direction);
    }
    return sourceProducts;
  }, [sourceProducts, products, localSort]);

  const totalPages = Math.max(
    1,
    Math.ceil(orderedProducts.length / rowsPerPage)
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const displayedProducts = orderedProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const selected = products ? localSelected : storeSelected;
  const allSelected =
    selected.length === displayedProducts.length &&
    displayedProducts.length > 0;

  const headers: {
    key: keyof Product | "alerts";
    label: string;
    hideOnMobile?: boolean;
  }[] = [
    { key: "name", label: "Nome" },
    { key: "status", label: "Status" },
    { key: "alerts", label: "Alertas" },
    { key: "sales", label: "Vendas", hideOnMobile: true },
    { key: "price", label: "Faturamento", hideOnMobile: true },
    { key: "margin", label: "Margem", hideOnMobile: true },
    { key: "totalProfit", label: "Lucro total", hideOnMobile: true },
  ];

  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md mt-6 border border-border-dark w-full">
      {/* TOPO CONTROLES */}
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
          Mostrando{" "}
          <span className="font-medium">
            {(currentPage - 1) * rowsPerPage + 1}
          </span>{" "}
          a{" "}
          <span className="font-medium">
            {Math.min(currentPage * rowsPerPage, orderedProducts.length)}
          </span>{" "}
          de <span className="font-medium">{orderedProducts.length}</span>{" "}
          resultados
        </p>
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto w-full rounded-md">
        <table className="min-w-full divide-y divide-border-dark">
          <thead className="bg-background">
            <tr>
              <th className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="rounded border-border-dark text-primary cursor-pointer"
                />
              </th>
              {headers.map(({ key, label, hideOnMobile }) => (
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
                          (
                            products
                              ? localSort.key === key
                              : storeSortConfig.key === key
                          )
                            ? "text-primary"
                            : "text-gray-400"
                        } ${
                          (
                            products
                              ? localSort.key === key &&
                                localSort.direction === "asc"
                              : storeSortConfig.key === key &&
                                storeSortConfig.direction === "asc"
                          )
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
            {displayedProducts.map((product) => (
              <tr
                key={product.id}
                onClick={() => onRowClick(product)}
                className="hover:bg-background transition-colors cursor-pointer"
              >
                <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={() => toggleOne(product.id)}
                    className="rounded border-border-dark text-primary cursor-pointer"
                  />
                </td>

                <td className="py-3 text-xs font-medium text-text flex items-center gap-2">
                  <div className="w-9 h-9 flex-shrink-0 relative">
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
                  <span className="truncate max-w-[120px] sm:max-w-none">
                    {product.name}
                  </span>
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
                  <ProductHealthIcons product={product} />
                </td>

                <td className="px-3 py-3 hidden sm:table-cell text-xs text-text-secondary">
                  {product.sales}
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
                  <span
                    className={`whitespace-nowrap ${
                      product.totalProfit < 0 ? "text-error" : "text-primary"
                    }`}
                  >
                    {product.totalProfit.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </td>
              </tr>
            ))}

            {displayedProducts.length === 0 && (
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

      {/* PAGINAÇÃO */}
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
