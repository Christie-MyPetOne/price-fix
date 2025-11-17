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
  const selectAllRef = useRef<HTMLInputElement | null>(null);
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

  useEffect(() => {
    if (selectAllRef.current)
      selectAllRef.current.indeterminate = isIndeterminate;
  }, [isIndeterminate]);

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
    `transition-transform ${
      localSort.key === key ? "text-primary" : "text-gray-400"
    } ${
      localSort.key === key && localSort.direction === "asc" ? "rotate-180" : ""
    }`;

  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md mt-6 border border-border-dark w-full">
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm text-text-secondary flex items-center gap-2">
          Mostrar
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border border-border-dark rounded px-2 py-1 bg-card focus:ring-1 focus:ring-primary transition"
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
          Selecionados:{" "}
          <span className="font-medium">{selectedIds.length}</span> — Mostrando{" "}
          <span className="font-medium">
            {sortedSales.length ? (currentPage - 1) * rowsPerPage + 1 : 0}
          </span>{" "}
          a{" "}
          <span className="font-medium">
            {Math.min(currentPage * rowsPerPage, sortedSales.length)}
          </span>{" "}
          de <span className="font-medium">{sortedSales.length}</span>
        </p>
      </div>

      <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent">
        <table className="min-w-full divide-y divide-border-dark">
          <thead className="bg-background/80 backdrop-blur sticky top-0 z-20 border-b border-border-dark">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleAll}
                  className="rounded border-border-dark text-primary cursor-pointer"
                />
              </th>

              {[
                { key: "orderId", label: "Pedido / Produto", w: "200px" },
                { key: "date", label: "Data", w: "100px" },
                { key: "marketplace", label: "Canal de Venda", w: "150px" },
                {
                  key: "financials.valor_faturado",
                  label: "Valor",
                  w: "120px",
                  center: true,
                },
                { key: "margin", label: "Margem", w: "90px", center: true },
                { key: "profit", label: "Lucro", w: "120px", center: true },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key as SortKey)}
                  className={`
                    px-4 py-3 text-xs font-semibold text-text-secondary
                    cursor-pointer select-none whitespace-nowrap
                    min-w-[${col.w}]
                    ${col.center ? "text-center" : "text-left"}
                  `}
                >
                  <div
                    className={`flex items-center gap-1 ${
                      col.center ? "justify-center" : ""
                    }`}
                  >
                    {col.label}
                    <ArrowUpDown
                      size={14}
                      className={arrowClass(col.key as SortKey)}
                    />
                  </div>
                </th>
              ))}

              <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary min-w-[80px]">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="bg-card divide-y divide-border-dark">
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
                  className={`
                    transition-all cursor-pointer
                    hover:bg-background/70
                    ${
                      isSelected
                        ? "bg-primary/10 border-l-4 border-primary"
                        : ""
                    }
                  `}
                >
                  <td
                    className="px-4 py-3 w-10"
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
                      className="rounded border-border-dark text-primary cursor-pointer"
                    />
                  </td>

                  <td className="px-4 py-3 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      {sale.items[0]?.image && (
                        <Image
                          src={sale.items[0].image}
                          alt={sale.items[0].name}
                          width={48}
                          height={48}
                          className="rounded-md object-cover border border-border-dark"
                        />
                      )}

                      <div className="flex flex-col">
                        <span className="text-xs text-text-secondary mb-1">
                          <strong>Pedido:</strong> {sale.ecommerce}
                        </span>

                        <span className="text-xs text-text-secondary">
                          <strong>Produto:</strong>{" "}
                          <span className="sm:hidden" title={productNames}>
                            {abbreviatedName}
                          </span>
                          <span className="hidden sm:inline">
                            {productNames}
                          </span>
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-text-secondary min-w-[100px]">
                    {new Date(sale.date).toLocaleDateString("pt-BR")}
                  </td>

                  <td className="px-4 py-3 text-sm text-text-secondary min-w-[150px]">
                    {sale.ecommerce ?? "Loja própria"}
                  </td>

                  <td className="px-4 py-3 text-sm text-center min-w-[120px] font-medium">
                    {sale.financials?.valor_faturado?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }) ?? "R$ 0,00"}
                  </td>

                  <td className="px-4 py-3 text-center min-w-[90px]">
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

                  {/* LUCRO */}
                  <td className="px-4 py-3 text-center min-w-[120px] font-medium">
                    {real.profit.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>

                  {/* AÇÕES */}
                  <td
                    className="px-4 py-3 text-right min-w-[80px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleAbrirCalculadora(sale)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white bg-primary hover:bg-primary/90 transition shadow-sm"
                    >
                      <Calculator size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border-dark bg-card px-4 py-3 mt-2">
        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded-md ring-1 ring-border-dark hover:bg-background transition disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition ${
                page === currentPage
                  ? "bg-primary text-white shadow-sm"
                  : "ring-1 ring-border-dark hover:bg-background"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="px-3 py-2 rounded-md ring-1 ring-border-dark hover:bg-background transition disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

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
