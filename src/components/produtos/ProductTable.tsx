"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Product } from "../../lib/types";
import { useProductStore } from "../../store/useProductStore";
import { sortData, toggleSelection, toggleSelectAll } from "../../lib/utils";

// 1. Adicionamos a prop onRowClick para receber a função do componente pai
interface ProductTableProps {
  products?: Product[];
  onRowClick: (product: Product) => void;
}

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

  const headers: { key: keyof Product; label: string }[] = [
    { key: "name", label: "Nome" },
    { key: "sales", label: "Vendas" },
    { key: "status", label: "Status" },
    { key: "price", label: "Preço" },
    { key: "margin", label: "Margem" },
    { key: "totalProfit", label: "Lucro total" },
    { key: "workingCapital", label: "Cap. de giro" },
  ];

  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md mt-6 border border-border-dark w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm text-text-secondary flex items-center gap-2">
          Mostrar
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-border-dark rounded px-2 py-1 ml-2"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          itens
        </label>

        <p className="text-sm text-text-secondary hidden sm:block">
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

      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-border-dark">
          <thead className="bg-background">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="rounded border-border-dark text-primary focus:ring-primary cursor-pointer"
                />
              </th>

              {headers.map(({ key, label }) => (
                <th
                  key={String(key)}
                  onClick={() => handleSort(key)}
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <ArrowUpDown
                      size={14}
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
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-card divide-y divide-border-dark">
            {displayedProducts.map((product) => (
              <tr
                key={product.id}
                onClick={() => onRowClick(product)}
                className="hover:bg-background transition-colors cursor-pointer"
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={() => toggleOne(product.id)}
                    className="rounded border-border-dark text-primary focus:ring-primary cursor-pointer"
                  />
                </td>

                <td className="px-4 py-3 text-sm font-medium text-text flex items-center gap-2">
                  {/* Container com tamanho fixo para a imagem */}
                  <div className="w-10 h-10 flex-shrink-0 relative">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    ) : (
                      // Placeholder para produtos sem imagem
                      <div className="w-full h-full bg-border-dark rounded flex items-center justify-center">
                        <span className="text-xs text-text-secondary"></span>
                      </div>
                    )}
                  </div>
                  <span>{product.name}</span>
                </td>

                <td className="px-4 py-3 text-sm text-text-secondary">
                  {product.sales}
                </td>

                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${
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

                <td className="px-4 py-3 text-sm text-text">
                  {product.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>

                <td className="px-4 py-3 text-sm text-text">
                  {product.margin.toFixed(2)}%
                </td>

                <td className="px-4 py-3 text-sm">
                  <span
                    className={
                      product.totalProfit < 0 ? "text-error" : "text-primary"
                    }
                  >
                    {product.totalProfit.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </td>

                <td className="px-4 py-3 text-sm">
                  <span
                    className={
                      product.workingCapital < 0 ? "text-error" : "text-primary"
                    }
                  >
                    {product.workingCapital.toLocaleString("pt-BR", {
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

      <div className="flex items-center justify-between border-t border-border-dark bg-card px-4 py-3 mt-2">
        <div className="flex gap-2">
          <button
            className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`p-2 rounded-md text-sm font-semibold ${
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
            className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background"
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
