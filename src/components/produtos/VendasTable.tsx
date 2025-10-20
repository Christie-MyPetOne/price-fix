"use client";

import React from "react";
import { Venda } from "../../lib/types"; // Supondo que você tenha esse type
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductTableProps {
  Vendas: Venda[];
}

export function VendasTable({ Vendas }: ProductTableProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md mt-6 border border-border-dark ">
      <table className="min-w-full divide-y divide-border-dark">
        {/* Fundo do cabeçalho da tabela mais escuro */}
        <thead className="bg-background ">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              <input
                type="checkbox"
                className="rounded border-border-dark bg-background text-primary shadow-sm focus:ring-primary"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Pedidos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Conciliação 
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Valor da venda
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Margem
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Lucro
            </th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border-dark">
          {Vendas.map((Venda) => (
            // Linhas com hover
            <tr
              key={Venda.id}
              className="hover:bg-background transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  className="rounded border-border-dark bg-background text-primary shadow-sm focus:ring-primary"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">
                {Venda.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                {Venda.consiliacao}
              </td>
            
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                {Venda.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                {Venda.margin.toFixed(2)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={
                    Venda.totalProfit < 0 ? "text-error" : "text-primary"
                  }
                >
                  {/* primary para positivo */}
                  {Venda.totalProfit.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="flex items-center justify-between border-t border-border-dark bg-card px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <a
            href="#"
            className="relative inline-flex items-center rounded-md border border-border-dark bg-background px-4 py-2 text-sm font-medium text-text-secondary hover:bg-card"
          >
            Anterior
          </a>
          <a
            href="#"
            className="relative ml-3 inline-flex items-center rounded-md border border-border-dark bg-background px-4 py-2 text-sm font-medium text-text-secondary hover:bg-card"
          >
            Próximo
          </a>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-text-secondary">
              Mostrando <span className="font-medium">1</span> a{" "}
              <span className="font-medium">10</span> de{" "}
              <span className="font-medium">99</span> resultados
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <a
                href="#"
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-text-secondary ring-1 ring-inset ring-border-dark hover:bg-background focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="#"
                aria-current="page"
                className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                1
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-text ring-1 ring-inset ring-border-dark hover:bg-background focus:z-20 focus:outline-offset-0"
              >
                2
              </a>
              <a
                href="#"
                className="relative hidden items-center px-4 py-2 text-sm font-semibold text-text ring-1 ring-inset ring-border-dark hover:bg-background focus:z-20 focus:outline-offset-0 md:inline-flex"
              >
                3
              </a>
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-text-secondary ring-1 ring-inset ring-border-dark focus:outline-offset-0">
                ...
              </span>
              <a
                href="#"
                className="relative hidden items-center px-4 py-2 text-sm font-semibold text-text ring-1 ring-inset ring-border-dark hover:bg-background focus:z-20 focus:outline-offset-0 md:inline-flex"
              >
                8
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-text ring-1 ring-inset ring-border-dark hover:bg-background focus:z-20 focus:outline-offset-0"
              >
                9
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-text ring-1 ring-inset ring-border-dark hover:bg-background focus:z-20 focus:outline-offset-0"
              >
                10
              </a>
              <a
                href="#"
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-text-secondary ring-1 ring-inset ring-border-dark hover:bg-background focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
