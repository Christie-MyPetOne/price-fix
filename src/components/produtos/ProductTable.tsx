"use client";

import React from "react";
import { Product } from "../../lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md mt-6 border border-border-dark w-full">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-border-dark">
          <thead className="bg-background">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded border-border-dark bg-background text-primary shadow-sm focus:ring-primary"
                />
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Nome
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Vendas
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Preço
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Margem
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Lucro total
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Cap. de giro
              </th>
            </tr>
          </thead>

          <tbody className="bg-card divide-y divide-border-dark">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-background transition-colors duration-150"
              >
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-border-dark bg-background text-primary shadow-sm focus:ring-primary"
                  />
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-text">
                  {product.name}
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-dark text-white">
                    {product.origin || "N/A"}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {product.sales}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-text">
                  {product.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-text">
                  {product.margin.toFixed(2)}%
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
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
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
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

      <div className="flex items-center justify-between border-t border-border-dark bg-card px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button className="relative inline-flex items-center rounded-md border border-border-dark bg-background px-4 py-2 text-sm font-medium text-text-secondary hover:bg-card">
            Anterior
          </button>
          <button className="relative ml-3 inline-flex items-center rounded-md border border-border-dark bg-background px-4 py-2 text-sm font-medium text-text-secondary hover:bg-card">
            Próximo
          </button>
        </div>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <p className="text-sm text-text-secondary">
            Mostrando <span className="font-medium">1</span> a{" "}
            <span className="font-medium">10</span> de{" "}
            <span className="font-medium">99</span> resultados
          </p>

          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-text-secondary ring-1 ring-inset ring-border-dark hover:bg-background focus:z-20">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white">
              1
            </button>
            <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-text ring-1 ring-inset ring-border-dark hover:bg-background">
              2
            </button>
            <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-text-secondary ring-1 ring-inset ring-border-dark">
              ...
            </span>
            <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-text-secondary ring-1 ring-inset ring-border-dark hover:bg-background focus:z-20">
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
