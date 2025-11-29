"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Sale, Product, SaleItem } from "@/lib/types";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Calculator,
} from "lucide-react";
import {
  sortData,
  toggleSelection,
  toggleSelectAll,
  handleShiftSelection,
  paginate,
} from "@/lib/utils";
import Drawer from "../ui/Drawer";
import { VendasModal } from "./VendasModal";
import CalculadoraMargem from "./Calculadora";

type SortDir = "asc" | "desc";
type SortKey = keyof Sale | "clientName" | "margin" | "profit" | "marketplace";

export interface VendasTableProps {
  sales: Sale[];
  selectedMargemIds: string[];
}

const abbreviateProductName = (name: string, maxLength: number = 30) => {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + "...";
};

export function VendasTable({ sales }: VendasTableProps) {
  const [localSort, setLocalSort] = useState<{
    key: SortKey | null;
    direction: SortDir;
  }>({
    key: "date",
    direction: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [vendaSelecionada, setVendaSelecionada] = useState<Sale | null>(null);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (key: SortKey) => {
    const direction =
      localSort.key === key && localSort.direction === "asc" ? "desc" : "asc";
    setLocalSort({ key, direction });
  };

  const calcProfitAndMargin = (sale: Sale) => {
    const faturado = sale.financials?.valor_faturado ?? 0;
    const custoTotal =
      sale.items?.reduce((acc, item) => acc + (item.totalCost ?? 0), 0) ?? 0;
    const lucro = faturado - custoTotal;
    const margem = faturado > 0 ? (lucro / faturado) * 100 : 0;
    return { profit: lucro, margin: margem };
  };

  const sortedSales = useMemo(() => {
    if (!localSort.key) return sales;

    const accessor = (sale: Sale) => {
      const key = localSort.key as SortKey;
      if (key === "margin" || key === "profit") {
        const values = calcProfitAndMargin(sale);
        return values[key];
      }
      return (sale as any)[key];
    };

    return sortData<Sale>(
      sales,
      localSort.key === "margin" || localSort.key === "profit"
        ? accessor
        : (localSort.key as keyof Sale),
      localSort.direction,
      { dateKeys: ["date"] }
    );
  }, [sales, localSort]);

  const { pageData: displayedSales, totalPages } = useMemo(
    () => paginate(sortedSales, currentPage, rowsPerPage),
    [sortedSales, currentPage, rowsPerPage]
  );

  const allSelected =
    displayedSales.length > 0 &&
    displayedSales.every((sale) => selectedIds.includes(sale.id));

  const isIndeterminate =
    selectedIds.length > 0 && !allSelected && displayedSales.length > 0;

  const handleToggleOne = (id: string, index: number, shiftKey?: boolean) => {
    setSelectedIds((prev) => {
      const updated = shiftKey
        ? handleShiftSelection(id, displayedSales, prev, lastSelectedIndex)
        : toggleSelection(prev, id);
      return updated;
    });
    setLastSelectedIndex(index);
  };

  const handleToggleAll = () => {
    setSelectedIds((prev) => toggleSelectAll(displayedSales, prev));
  };

  const handleAbrirCalculadora = (sale: Sale) => {
    const item: SaleItem | undefined = sale.items?.[0];
    if (!item) return;

    const produtoConvertido: Product = {
      id: item.id ?? "",
      sku: item.sku ?? "SEM-SKU",
      name: item.name ?? "Produto sem nome",
      price: (item as any).price ?? item.unitPrice ?? 0,
      cost: item.totalCost ?? 0,
      margin: 0,
      totalProfit: 0,
      workingCapital: 0,
      sales: 0,
      status: "Pendente",
      createdAt: new Date().toISOString(),
      freight: 0,
      freightRevenue: 0,
      shipping: 0,
      discount: 0,
      subsidy: 0,
      tax: 0.23,
      commission: 14,
      saleFee: 0,
      otherCosts: 0,
      image: item.image ?? "",
      marketplace: sale.marketplace ?? "",
    };

    setSelectedProduct(produtoConvertido);
    setVendaSelecionada(sale);
    setOpenDrawer(true);
  };

  const handleAbrirInfo = (sale: Sale) => {
    setSelectedSale(sale);
    setShowDetails(true);
  };

  const arrowClass = (key: SortKey) =>
    `transition-transform duration-200 ${
      localSort.key === key ? "text-primary" : "text-gray-400"
    } ${
      localSort.key === key && localSort.direction === "asc" ? "rotate-180" : ""
    }`;

  const headers: { key: SortKey; label: string; width: string }[] = [
    { key: "orderId", label: "Pedido / Produto", width: "w-[35%]" },
    { key: "date", label: "Data", width: "w-[12%]" },
    { key: "marketplace", label: "Canal de Venda", width: "w-[15%]" },
    {
      key: "financials.valor_faturado",
      label: "Valor",
      width: "w-[10%]",
    },
    { key: "margin", label: "Margem", width: "w-[8%]" },
    { key: "profit", label: "Lucro", width: "w-[10%]" },
  ];

  return (
    <div className="bg-card rounded-xl border border-border-dark shadow-lg p-4 w-full">
      <div className="flex justify-between items-center pb-3 ">
        <label className="text-xs font-semibold text-text-secondary flex items-center gap-2">
          Itens por página:
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border border-border-dark text-xs rounded-md px-2 py-1 bg-background text-text-primary cursor-pointer"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <p className="text-[11px] text-text-secondary">
          Selecionados:{" "}
          <span className="font-semibold text-primary">
            {selectedIds.length}
          </span>
        </p>
      </div>

      <div className="border border-border-dark rounded-lg bg-card">
        <table className="w-full table-fixed text-xs">
          <thead className="bg-background-light border-b border-border-dark">
            <tr>
              <th className="w-[3%] px-2 py-2 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleAll}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  className="h-3.5 w-3.5 cursor-pointer"
                />
              </th>

              {headers.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => handleSort(col.key as SortKey)}
                  className={`${col.width} px-3 py-3 text-sm font-semibold text-text-secondary cursor-pointer select-none`}
                >
                  <div
                    className={`flex items-center gap-1 ${
                      col.key === "margin" || col.key === "profit" || col.key === "financials.valor_faturado"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {col.label}
                    <ArrowUpDown
                      size={10}
                      className={arrowClass(col.key as SortKey)}
                    />
                  </div>
                </th>
              ))}

              <th className="w-[7%] px-4 py-3 text-right text-xs font-semibold text-text-secondary">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="cursor-pointer divide-y divide-border-dark">
            {displayedSales.map((sale, index) => {
              const id = sale.id;
              const real = calcProfitAndMargin(sale);
              const isSelected = selectedIds.includes(id);
              const productNames = sale.items.map((i) => i.name).join(", ");
              const abbreviatedName = abbreviateProductName(productNames, 30);

              return (
                <tr
                  key={id}
                  onClick={() => handleAbrirInfo(sale)}
                  className={`border-b border-border-dark transition-colors
                    ${
                      isSelected
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
                      checked={isSelected}
                      readOnly
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleOne(id, index, e.shiftKey);
                      }}
                      className="h-3.5 w-3.5 cursor-pointer"
                    />
                  </td>

                  <td className="px-2 py-2 flex items-center gap-2 truncate">
                    <div className="w-12 h-12 rounded-md overflow-hidden border border-border-dark bg-background-light flex-shrink-0">
                      {sale.items[0]?.image ? (
                        <Image
                          src={sale.items[0].image}
                          alt={sale.items[0].name}
                          width={48}
                          height={48}
                          objectFit="cover"
                        />
                      ) : (
                         <div className="w-full h-full text-[10px] flex items-center justify-center text-text-secondary">
                            IMG
                          </div>
                      )}
                    </div>

                    <div className="truncate">
                      <p className="text-sm font-semibold truncate">
                        <strong>Pedido:</strong> {sale.ecommerce}
                      </p>
                      <p className="text-[10px] text-xs text-text-secondary truncate" title={productNames}>
                        <strong>Prod:</strong> {abbreviatedName}
                      </p>
                    </div>
                  </td>

                  <td className="px-2 py-2 text-sm text-text-secondary">
                    {new Date(sale.date).toLocaleDateString("pt-BR")}
                  </td>

                  <td className="px-2 py-2 text-sm text-text-secondary">
                    {sale.marketplace ?? "Loja própria"}
                  </td>

                  <td className="px-2 py-2 text-right font-mono text-base whitespace-nowrap">
                    {sale.financials?.valor_faturado?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }) ?? "R$ 0,00"}
                  </td>

                  <td className="px-2 py-2 text-right font-mono text-base">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        real.margin >= 20
                          ? "bg-green-100 text-green-700"
                          : real.margin >= 10
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {real.margin.toFixed(2)}%
                    </span>
                  </td>

                  <td className="px-2 py-2 text-right font-mono text-base whitespace-nowrap">
                    {real.profit.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>

                  <td
                    className="px-2 py-2 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      title="Analisar Margens"
                      onClick={() => handleAbrirCalculadora(sale)}
                      className="p-1.5 rounded border border-border-dark bg-background-light hover:bg-background"
                    >
                      <Calculator size={13} className="text-primary" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-1 mt-3">
          <button
            className="p-1.5 border border-border-dark rounded disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
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
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        title={
          vendaSelecionada
            ? `Simulador - ${vendaSelecionada?.items?.[0]?.name ?? ""}`
            : "Simulador de preços"
        }
      >
        {selectedProduct && <CalculadoraMargem product={selectedProduct} />}
      </Drawer>

      <VendasModal
        open={showDetails}
        onClose={() => setShowDetails(false)}
        sale={selectedSale}
      />
    </div>
  );
}
