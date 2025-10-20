"use client";

import React, { useState } from "react";
import { Product } from "../../lib/types";
import { sortData, toggleSelectAll, toggleSelection } from "../../lib/utils";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const [selected, setSelected] = useState<string[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>(products);

  const allSelected = selected.length === products.length;

  const handleSort = (key: keyof Product) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortedProducts(sortData<Product>(sortedProducts, key, direction));
    setSortConfig({ key, direction });
  };

  const handleToggleAll = () =>
    setSelected(toggleSelectAll(products, selected));

  const handleToggleOne = (id: string) =>
    setSelected(toggleSelection(selected, id));

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
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-border-dark">
          <thead className="bg-background">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleAll}
                  className="rounded border-border-dark text-primary focus:ring-primary cursor-pointer"
                />
              </th>

              {headers.map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <ArrowUpDown
                      size={14}
                      className={`transition-transform ${
                        sortConfig.key === key
                          ? "text-primary"
                          : "text-gray-400"
                      } ${
                        sortConfig.key === key && sortConfig.direction === "asc"
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
            {sortedProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-background transition-colors"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={() => handleToggleOne(product.id)}
                    className="rounded border-border-dark text-primary focus:ring-primary cursor-pointer"
                  />
                </td>

                <td className="px-4 py-3 text-sm font-medium text-text">
                  {product.name}
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-dark text-white">
                    {product.origin || "N/A"}
                  </span>
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
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border-dark bg-card px-4 py-3">
        <p className="text-sm text-text-secondary hidden sm:block">
          Mostrando <span className="font-medium">1</span> a{" "}
          <span className="font-medium">10</span> de{" "}
          <span className="font-medium">99</span> resultados
        </p>

        <div className="flex gap-2">
          <button className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background">
            <ChevronLeft size={16} />
          </button>
          <button className="p-2 rounded-md bg-primary text-white font-semibold text-sm">
            1
          </button>
          <button className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background">
            2
          </button>
          <button className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
