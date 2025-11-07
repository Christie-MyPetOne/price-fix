"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useSaleStore } from "@/store/useSaleStore";
import type { Sale } from "@/lib/types";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Calculator,
} from "lucide-react";
import { sortData, toggleSelection } from "@/lib/utils";
import Drawer from "../ui/Drawer";
import CalculadoraMargem from "./Calculadora";
import { VendasInfo, VendasInfoData } from "@/components/vendas/VendasInfo";

type SortDir = "asc" | "desc";
type SortKey = keyof Sale | "clientName" | "margin" | "profit";

export function VendasTable() {
  const { fetchSales, sales, loading } = useSaleStore();

  const [localSort, setLocalSort] = useState<{
    key: SortKey;
    direction: SortDir;
  }>({
    key: "date",
    direction: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [vendaSelecionada, setVendaSelecionada] = useState<Sale | null>(null);
  const [openInfo, setOpenInfo] = useState(false);
  const [infoData, setInfoData] = useState<VendasInfoData | null>(null);
  const selectAllRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (key: SortKey) => {
    const direction =
      localSort.key === key && localSort.direction === "asc" ? "desc" : "asc";
    setLocalSort({ key, direction });
  };

  const fakeById = (s: Sale) => {
    const id = (s as any)?.id?.toString?.() ?? "";
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
    const rng = Math.abs(h % 1000) / 1000;
    const margin = 5 + rng * 25;
    const profit = (rng - 0.2) * 2500;
    return { margin, profit };
  };

  const sortedSales = useMemo(() => {
    if (!localSort.key) return sales;

    if (localSort.key === "clientName") {
      const dir = localSort.direction === "asc" ? 1 : -1;
      return [...sales].sort(
        (a, b) => a.client.nome.localeCompare(b.client.nome, "pt-BR") * dir
      );
    }

    if (localSort.key === "margin" || localSort.key === "profit") {
      const dir = localSort.direction === "asc" ? 1 : -1;
      return [...sales].sort((a, b) => {
        const aValues = fakeById(a);
        const bValues = fakeById(b);
        const key = localSort.key as "margin" | "profit";
        return (aValues[key] - bValues[key]) * dir;
      });
    }

    return sortData<Sale>(
      sales,
      localSort.key as keyof Sale,
      localSort.direction
    );
  }, [sales, localSort]);

  const totalPages = Math.max(1, Math.ceil(sortedSales.length / rowsPerPage));
  const displayedSales = sortedSales.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const visibleIds = useMemo(
    () => displayedSales.map((s, idx) => s.id ?? String(idx)),
    [displayedSales]
  );

  const toggleOne = (id: string) => setSelected(toggleSelection(selected, id));
  const allSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));
  const someSelected =
    visibleIds.some((id) => selected.includes(id)) && !allSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const toggleAll = () => {
    setSelected((prev) => {
      if (allSelected) return prev.filter((id) => !visibleIds.includes(id));
      const merged = new Set([...prev, ...visibleIds]);
      return Array.from(merged);
    });
  };

  const mapSaleToVendasInfoData = (sale: Sale): VendasInfoData => ({
    numeroPedido: sale.id ?? "—",
    dataPedido: sale.date,
    status:
      sale.status === "PAID"
        ? "Pago"
        : sale.status === "PENDING"
        ? "Aguardando pagamento"
        : sale.status === "CANCELLED"
        ? "Cancelado"
        : sale.status === "SHIPPED"
        ? "Enviado"
        : sale.status === "INVOICED"
        ? "Faturado"
        : sale.status === "COMPLETED"
        ? "Concluído"
        : "Aguardando pagamento",
    marketplaceId: sale.originERP,
    valorVenda: sale.financials.valor_nota ?? 0,
    receitaProdutos: sale.financials.valor_produtos ?? 0,
    receitaFrete: sale.financials.valor_frete ?? 0,
    descontos: sale.financials.valor_desconto ?? 0,
    nfeEmitida: false,
    estadoDestino: sale.client.uf ?? "—",
    produtos: sale.items.map((it) => ({
      qtd: it.quantity,
      nome: it.name,
      sku: it.sku,
      codigo: it.productId,
      imagemUrl: it.image,
      valorVenda: it.totalPrice,
      precoVenda: it.unitPrice,
      receitaFrete: 0,
      desconto: 0,
    })),
    originalSale: sale, 
  });

  const handleAbrirInfo = (sale: Sale) => {
    setInfoData(mapSaleToVendasInfoData(sale));
    setOpenInfo(true);
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
          Mostrando{" "}
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

      {loading ? (
        <div className="mt-6 p-6 rounded-xl bg-card shadow-lg">
          Carregando...
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-border-dark">
            <thead className="bg-background">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded border-border-dark text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Pedido
                    <ArrowUpDown size={14} className={arrowClass("status")} />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-1">
                    Data
                    <ArrowUpDown size={14} className={arrowClass("date")} />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("clientName")}
                >
                  <div className="flex items-center gap-1">
                    Cliente
                    <ArrowUpDown
                      size={14}
                      className={arrowClass("clientName")}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Valor de Venda
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                  Margem
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                  Lucro
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="bg-card divide-y divide-border-dark">
              {displayedSales.map((sale, index) => {
                const id = sale.id ?? String(index);
                const fake = fakeById(sale);
                const isSelected = selected.includes(id);

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
                        checked={isSelected}
                        onChange={() => toggleOne(id)}
                        className="rounded border-border-dark text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>

                    {/* Produto + imagem */}
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
                      {sale.client?.nome ?? "N/A"}
                    </td>

                    <td className="px-4 py-3 text-sm text-text text-center">
                      {sale.financials?.valor_nota?.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>

                    <td className="px-4 py-3 text-sm text-text text-center">
                      {`${fake.margin.toFixed(2)}%`}
                    </td>

                    <td className="px-4 py-3 text-sm text-text text-center">
                      {fake.profit.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>

                    <td
                      className="px-4 py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          setVendaSelecionada(sale);
                          setOpenDrawer(true);
                        }}
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

          {/* Paginação */}
          <div className="flex items-center justify-between border-t border-border-dark bg-card px-4 py-3 mt-2">
            <div className="flex gap-2">
              <button
                className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}
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
        <CalculadoraMargem
          initialPreco={vendaSelecionada?.financials?.valor_nota ?? 0}
          initialMargem={0}
          initialCusto={0}
        />
      </Drawer>

      {infoData && (
        <VendasInfo
          open={openInfo}
          onClose={() => setOpenInfo(false)}
          data={infoData}
        />
      )}
    </div>
  );
}
