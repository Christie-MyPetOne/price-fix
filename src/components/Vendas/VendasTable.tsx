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
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isIndeterminate;
    }
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
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm text-text-secondary flex items-center gap-2">
          Mostrar
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border border-border-dark rounded px-2 py-1 bg-card"
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
          <span className="font-medium">{selectedIds.length}</span> - Mostrando{" "}
          <span className="font-medium">
            {sortedSales.length ? (currentPage - 1) * rowsPerPage + 1 : 0}
          </span>{" "}
          a{" "}
          <span className="font-medium">
            {Math.min(currentPage * rowsPerPage, sortedSales.length)}
          </span>{" "}
          de <span className="font-medium">{sortedSales.length}</span>{" "}
          resultados
        </p>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-border-dark">
          <thead className="bg-background">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleAll}
                  className="rounded border-border-dark text-primary focus:ring-primary cursor-pointer"
                />
              </th>
              <th
                onClick={() => handleSort("orderId" as SortKey)}
                className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  Pedido
                  <ArrowUpDown
                    size={14}
                    className={arrowClass("orderId" as SortKey)}
                  />
                </div>
              </th>
              <th
                onClick={() => handleSort("date")}
                className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  Data
                  <ArrowUpDown size={14} className={arrowClass("date")} />
                </div>
              </th>
              <th
                onClick={() => handleSort("marketplace")}
                className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  Canal de Venda
                  <ArrowUpDown
                    size={14}
                    className={arrowClass("marketplace")}
                  />
                </div>
              </th>
              <th
                onClick={() =>
                  handleSort("financials.valor_faturado" as SortKey)
                }
                className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase cursor-pointer"
              >
                <div className="flex items-center justify-center gap-1">
                  Valor de Venda
                  <ArrowUpDown
                    size={14}
                    className={arrowClass(
                      "financials.valor_faturado" as SortKey
                    )}
                  />
                </div>
              </th>
              <th
                onClick={() => handleSort("margin")}
                className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase cursor-pointer"
              >
                <div className="flex items-center justify-center gap-1">
                  Margem
                  <ArrowUpDown size={14} className={arrowClass("margin")} />
                </div>
              </th>
              <th
                onClick={() => handleSort("profit")}
                className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase cursor-pointer"
              >
                <div className="flex items-center justify-center gap-1">
                  Lucro
                  <ArrowUpDown size={14} className={arrowClass("profit")} />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="bg-card divide-y divide-border-dark">
            {displayedSales.map((sale, index) => {
              const id = sale.id;
              const real = calcProfitAndMargin(sale);
              const isSelected = selectedIds.includes(id);

              return (
                <tr
                  key={id}
                  className={`hover:bg-background transition-colors cursor-pointer ${
                    isSelected ? "bg-background/60" : ""
                  }`}
                  onClick={() => handleAbrirInfo(sale)}
                >
                  <td
                    className="px-4 py-3 w-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(id)}
                      readOnly
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleOne(id, index, e.shiftKey);
                      }}
                      className="rounded border-border-dark text-primary focus:ring-primary cursor-pointer"
                    />
                  </td>

                  <td className="px-4 py-3 text-sm font-medium text-text">
                    <div className="flex items-center gap-3">
                      {sale.items[0]?.image && (
                        <Image
                          src={sale.items[0].image}
                          alt={sale.items[0].name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover border border-border-dark"
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="text-xs text-text-secondary">
                          <strong>Status:</strong> {sale.status}
                        </span>
                        <span className="text-xs text-text-secondary">
                          <strong>Produto:</strong>{" "}
                          {sale.items.map((i) => i.name).join(", ")}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {new Date(sale.date).toLocaleDateString("pt-BR")}
                  </td>

                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {sale.ecommerce ?? "Loja própria"}
                  </td>

                  <td className="px-4 py-3 text-sm text-center">
                    {sale.financials?.valor_nota?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>

                  <td className="px-4 py-3 text-sm text-center">
                    {`${real.margin.toFixed(2)}%`}
                  </td>

                  <td className="px-4 py-3 text-sm text-center">
                    {real.profit.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>

                  <td
                    className="px-4 py-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleAbrirCalculadora(sale)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white bg-[#10b97c] hover:bg-[#0d9d6b]"
                    >
                      <Calculator size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-border-dark bg-card px-4 py-3 mt-2">
          <div className="flex gap-2">
            <button
              className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
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
              className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
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
