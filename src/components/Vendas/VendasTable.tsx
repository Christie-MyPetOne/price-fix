"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSalesStore } from "../../store/useSalesStore";
import type { Sale } from "../../store/useSalesStore";
import { ChevronLeft, ChevronRight, ArrowUpDown, Calculator } from "lucide-react";
import { sortData, toggleSelection, toggleSelectAll } from "../../lib/utils";
import Drawer from "../ui/Drawer";
import CalculadoraMargem from "./Calculadora";

// 👉 importe o componente da modal de informações de venda
import { VendasInfo, VendasInfoData } from "@/components/vendas/VendasInfo";

type SortDir = "asc" | "desc";
type SortKey = keyof Sale;

export function VendasTable() {
  const { sales, fetchSales, loading } = useSalesStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: SortDir }>({
    key: "totalAmount",
    direction: "desc",
  });

  const [openDrawer, setOpenDrawer] = useState(false);
  const [vendaSelecionada, setVendaSelecionada] = useState<Sale | null>(null);

  // 👉 estados da modal VendasInfo
  const [openInfo, setOpenInfo] = useState(false);
  const [infoData, setInfoData] = useState<VendasInfoData | null>(null);

  useEffect(() => {
    fetchSales(120);
  }, [fetchSales]);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedSales = useMemo(() => {
    if (!sortConfig.key) return sales;
    return sortData<Sale>(sales, sortConfig.key, sortConfig.direction);
  }, [sales, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedSales.length / rowsPerPage));
  const displayedSales = sortedSales.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const toggleOne = (id: string) => setSelected(toggleSelection(selected, id));
  const toggleAll = () => setSelected(toggleSelectAll(displayedSales, selected));
  const allSelected = displayedSales.length > 0 && selected.length === displayedSales.length;

  // ---------- NOVO: função de mapeamento Sale -> VendasInfoData ----------
  const mapSaleToVendasInfoData = (sale: Sale): VendasInfoData => {
    const items = sale.items ?? [];
    return {
      numeroPedido: (sale.id as any)?.toString?.() ?? "—",
      dataPedido: sale.orderDate ?? new Date().toISOString(),
      // tenta mapear para os status aceitos; se vier algo diferente, uso "Pago" como neutro
      status:
        (["Pago","Aguardando pagamento","Cancelado","Enviado","Faturado","Concluído"] as const)
          .includes((sale.status ?? "Pago") as any)
          ? (sale.status as any)
          : "Pago",

      marketplaceId: (sale as any).marketplaceId ?? undefined,

      // Totais básicos (ajuste aqui se tiver campos próprios na sua store)
      valorVenda: sale.totalAmount ?? 0,
      receitaProdutos: sale.totalAmount ?? 0,
      receitaFrete: 0,
      descontos: 0,

      // Se tiver esses números no Sale, preencha. Caso contrário, deixa como undefined para "Faltam dados".
      custosVariaveis: undefined,
      custoEnvio: undefined,
      custoProdutos: undefined,
      comissaoCanal: undefined,
      taxaFixaMktplace: undefined,
      taxaFrete: undefined,
      impostos: undefined,
      gastosFixosPedido: undefined,
      gastosFreteAdicionais: undefined,
      descontosAdicionais: undefined,
      impostosAdicionais: undefined,

      nfeEmitida: false,
      estadoDestino: (sale as any)?.shippingAddress?.state ?? undefined,

      produtos: items.map((it: any) => ({
        qtd: it.quantity ?? 1,
        nome: it.productName ?? "Produto",
        sku: it.sku ?? undefined,
        codigo: it.sku ?? undefined,
        valorVenda: it.price ?? undefined,
        precoVenda: it.price ?? undefined,
        receitaFrete: 0,
        desconto: 0,
        // custos/impostos por item — se você tiver, preencha aqui
        custosVariaveis: undefined,
        custoEnvio: undefined,
        custoProdutos: undefined,
        comissaoCanal: undefined,
        taxaFixaMktplace: undefined,
        taxaFrete: undefined,
        gastosFixosPedido: undefined,
        gastosFreteAdicionais: undefined,
        descontosAdicionais: undefined,
        impostosAdicionais: undefined,
        impostos: undefined,
        impostosDetalhe: undefined,
      })),
    };
  };

  // ---------- NOVO: handler ao clicar no produto ----------
  const handleAbrirInfo = (sale: Sale) => {
    const data = mapSaleToVendasInfoData(sale);
    setInfoData(data);
    setOpenInfo(true);
  };

  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md mt-6 border border-border-dark w-full">
      {/* header topo */}
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm text-text-secondary flex items-center gap-2">
          Mostrar
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border border-border-dark rounded px-2 py-1 bg-card"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
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
          de <span className="font-medium">{sortedSales.length}</span> resultados
        </p>
      </div>

      {loading ? (
        <div className="mt-6 rounded-xl bg-card shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-text-secondary">Carregando pedidos…</span>
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 w-full rounded-lg bg-background overflow-hidden relative">
                <div className="absolute inset-0 shine" />
              </div>
            ))}
          </div>
        </div>
      ) : (
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
                    aria-label="Selecionar todos"
                  />
                </th>

                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Pedido
                    <ArrowUpDown size={14}
                      className={`transition-transform ${sortConfig.key === "status" ? "text-primary" : "text-gray-400"} ${sortConfig.key === "status" && sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                    />
                  </div>
                </th>

                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("orderDate")}
                >
                  <div className="flex items-center gap-1">
                    Data
                    <ArrowUpDown size={14}
                      className={`transition-transform ${sortConfig.key === "orderDate" ? "text-primary" : "text-gray-400"} ${sortConfig.key === "orderDate" && sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                    />
                  </div>
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Cliente
                </th>

                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("totalAmount")}
                >
                  <div className="flex items-center gap-1">
                    Valor de Venda
                    <ArrowUpDown size={14}
                      className={`transition-transform ${sortConfig.key === "totalAmount" ? "text-primary" : "text-gray-400"} ${sortConfig.key === "totalAmount" && sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                    />
                  </div>
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Margem</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Lucro</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Ações</th>
              </tr>
            </thead>

            <tbody className="bg-card divide-y divide-border-dark">
              {displayedSales.map((sale: any, index: number) => (
                <tr key={sale.id ?? index} className="hover:bg-background transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(sale.id)}
                      onChange={() => toggleOne(sale.id)}
                      className="rounded border-border-dark text-primary focus:ring-primary cursor-pointer"
                    />
                  </td>

                  <td className="px-4 py-3 text-sm font-medium text-text flex flex-col gap-1">
                    <span><strong>Status:</strong> {sale.status}</span>

                    {/* 👉 clique no(s) produto(s) para abrir a modal */}
                    <button
                      type="button"
                      onClick={() => handleAbrirInfo(sale)}
                      className="text-primary underline underline-offset-4 decoration-dotted text-left hover:opacity-80"
                      title="Ver detalhes financeiros da venda"
                    >
                      <strong>Produto:</strong>{" "}
                      {(sale.items?.map((i: any) => i.productName).join(", ")) ?? "N/A"}
                    </button>
                  </td>

                  <td className="px-4 py-3 text-sm text-text-secondary">
                    <strong>Data:</strong>{" "}
                    {sale.orderDate ? new Date(sale.orderDate).toLocaleDateString("pt-BR") : "N/A"}
                  </td>

                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {sale.customer ? `${sale.customer.firstName} ${sale.customer.lastName}` : "N/A"}
                  </td>

                  <td className="px-4 py-3 text-sm text-text text-center">
                    {sale.totalAmount?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ?? "R$ 0,00"}
                  </td>

                  {/* placeholders */}
                  <td className="px-4 py-3 text-sm text-text text-center">
                    {`${(Math.random() * (30 - 5) + 5).toFixed(2)}%`}
                  </td>
                  <td className="px-4 py-3 text-sm text-text text-center">
                    {Math.random() > 0.2
                      ? (Math.random() * 2000).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                      : (-Math.random() * 500).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => { setVendaSelecionada(sale); setOpenDrawer(true); }}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white bg-[#10b97c] hover:bg-[#0d9d6b] transition"
                    >
                      <Calculator size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* paginação */}
          <div className="flex items-center justify-between border-t border-border-dark bg-card px-4 py-3 mt-2">
            <div className="flex gap-2">
              <button
                className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`p-2 rounded-md text-sm font-semibold ${page === currentPage ? "bg-primary text-white" : "ring-1 ring-border-dark hover:bg-background"}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer da calculadora (já existia) */}
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        title={vendaSelecionada ? `Simulador - ${vendaSelecionada.items?.[0]?.productName ?? ""}` : "Simulador de preços"}
      >
        <CalculadoraMargem
          initialPreco={vendaSelecionada?.totalAmount ?? 0}
          initialMargem={0}
          initialCusto={0}
        />
      </Drawer>

      {/* 👉 Modal de informações da venda */}
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
