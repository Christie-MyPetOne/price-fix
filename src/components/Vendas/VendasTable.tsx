// VendasTable.tsx

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSalesStore } from "../../store/useSalesStore";
import type { Sale } from "../../store/useSalesStore";
import { ChevronLeft, ChevronRight, ArrowUpDown, Calculator } from "lucide-react";
import { sortData, toggleSelection } from "../../lib/utils";
import Drawer from "../ui/Drawer";
import CalculadoraMargem from "./Calculadora";
import { VendasInfo, VendasInfoData } from "@/components/vendas/VendasInfo";

type SortDir = "asc" | "desc";
// adicionamos chaves virtuais para manter consistência visual
type SortKey = keyof Sale | "customerName" | "margin" | "profit";

type Props = {
  /** Se passar sales por props, o sort vira local (mesmo padrão do ProductTable). */
  sales?: Sale[];
};

export function VendasTable(props: Props = {}) {
  // store base
  const salesStore = useSalesStore();
  const { fetchSales, loading } = salesStore;

  // se vier por props, usamos elas; senão, usamos as da store
  const sales: Sale[] = (props.sales ?? (salesStore.sales as Sale[])) ?? [];

  // suporte opcional a sort via store (se existir na store)
  const storeSortConfig = (salesStore as any).sortConfig as { key: SortKey; direction: SortDir } | undefined;
  const storeSortBy = (salesStore as any).sortBy as ((key: SortKey) => void) | undefined;

  // local sort (usado quando há sales por props)
  const [localSort, setLocalSort] = useState<{ key: SortKey | null; direction: SortDir }>({
    key: "totalAmount",
    direction: "desc",
  });

  const useLocalSort = !!props.sales; // igual seu padrão products ? local : store
  const activeSort = useLocalSort ? localSort : (storeSortConfig ?? localSort); // fallback no local se store não tiver sort

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [vendaSelecionada, setVendaSelecionada] = useState<Sale | null>(null);

  // modal info
  const [openInfo, setOpenInfo] = useState(false);
  const [infoData, setInfoData] = useState<VendasInfoData | null>(null);

  // ref para o checkbox de "selecionar todos" (pra setar indeterminate)
  const selectAllRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!props.sales) {
      fetchSales(120);
    }
  }, [fetchSales, props.sales]);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // === handleSort no mesmo padrão que você mandou ===
  const handleSort = (key: SortKey) => {
    if (useLocalSort) {
      const direction =
        localSort.key === key && localSort.direction === "asc" ? "desc" : "asc";
      setLocalSort({ key, direction });
    } else {
      // delega para a store se disponível; senão, cai no local como fallback
      if (storeSortBy) {
        storeSortBy(key);
      } else {
        const direction =
          localSort.key === key && localSort.direction === "asc" ? "desc" : "asc";
        setLocalSort({ key, direction });
      }
    }
  };

  // valores "fakes" mas determinísticos por linha (para Margem/Lucro ordenarem de forma estável)
  const fakeById = (s: Sale) => {
    const id = (s as any)?.id?.toString?.() ?? "";
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
    const rng = Math.abs(h % 1000) / 1000; // 0..1
    const margin = 5 + rng * 25;          // 5%..30%
    const profit = (rng - 0.2) * 2500;    // pode ser negativo
    return { margin, profit };
  };

  const sortedSales = useMemo(() => {
    if (!activeSort.key) return sales;

    if (activeSort.key === "customerName") {
      const dir = activeSort.direction === "asc" ? 1 : -1;
      return [...sales].sort((a: any, b: any) => {
        const an = `${a?.customer?.firstName ?? ""} ${a?.customer?.lastName ?? ""}`.trim();
        const bn = `${b?.customer?.firstName ?? ""} ${b?.customer?.lastName ?? ""}`.trim();
        return an.localeCompare(bn, "pt-BR") * dir;
      });
    }

    if (activeSort.key === "margin") {
      const dir = activeSort.direction === "asc" ? 1 : -1;
      return [...sales].sort((a, b) => (fakeById(a).margin - fakeById(b).margin) * dir);
    }

    if (activeSort.key === "profit") {
      const dir = activeSort.direction === "asc" ? 1 : -1;
      return [...sales].sort((a, b) => (fakeById(a).profit - fakeById(b).profit) * dir);
    }

    return sortData<Sale>(sales, activeSort.key as keyof Sale, activeSort.direction);
  }, [sales, activeSort]);

  const totalPages = Math.max(1, Math.ceil(sortedSales.length / rowsPerPage));
  const displayedSales = sortedSales.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // IDs visíveis na página atual, em string (caso o id não exista, usa o índice local da página)
  const visibleIds = useMemo(
    () =>
      displayedSales.map((s, idx) =>
        (s as any)?.id?.toString?.() ?? String(idx)
      ),
    [displayedSales]
  );

  const toggleOne = (id: string) => setSelected(toggleSelection(selected, id));

  // --- Selecionar todos apenas sobre as linhas visíveis (página atual) ---
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));
  const someSelected = visibleIds.some((id) => selected.includes(id)) && !allSelected;

  // manter o estado visual "indeterminado"
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const toggleAll = () => {
    setSelected((prev) => {
      if (allSelected) {
        // desmarca todas as visíveis
        return prev.filter((id) => !visibleIds.includes(id));
      }
      // marca todas as visíveis (sem duplicar as já marcadas)
      const merged = new Set([...prev, ...visibleIds]);
      return Array.from(merged);
    });
  };

  // mapeamento para VendasInfo
  const mapSaleToVendasInfoData = (sale: Sale): VendasInfoData => {
    const items = (sale as any).items ?? [];
    return {
      numeroPedido: (sale as any)?.id?.toString?.() ?? "—",
      dataPedido: (sale as any)?.orderDate ?? new Date().toISOString(),
      status:
        (["Pago","Aguardando pagamento","Cancelado","Enviado","Faturado","Concluído"] as const)
          .includes(((sale as any)?.status ?? "Pago") as any)
          ? ((sale as any)?.status as any)
          : "Pago",
      marketplaceId: (sale as any).marketplaceId ?? undefined,
      valorVenda: (sale as any)?.totalAmount ?? 0,
      receitaProdutos: (sale as any)?.totalAmount ?? 0,
      receitaFrete: 0,
      descontos: 0,
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

  const handleAbrirInfo = (sale: Sale) => {
    const data = mapSaleToVendasInfoData(sale);
    setInfoData(data);
    setOpenInfo(true);
  };

  const handleRowKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>, sale: Sale) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAbrirInfo(sale);
    }
  };

  // helper para montar a classe do ArrowUpDown no padrão que você enviou
  const arrowClass = (key: SortKey) =>
    `transition-transform ${
      (useLocalSort
        ? activeSort.key === key
        : activeSort.key === key) // (aqui activeSort já representa store ou local)
        ? "text-primary"
        : "text-gray-400"
    } ${
      (useLocalSort
        ? activeSort.key === key && activeSort.direction === "asc"
        : activeSort.key === key && activeSort.direction === "asc")
        ? "rotate-180"
        : ""
    }`;

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
                {/* Checkbox de Selecionar Todos (permanece no mesmo lugar) */}
                <th className="px-4 py-3 w-10">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-border-dark text-primary focus:ring-primary cursor-pointer"
                    aria-label="Selecionar todas as linhas visíveis"
                  />
                </th>

                {/* Pedido -> status */}
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Pedido
                    <ArrowUpDown size={14} className={arrowClass("status")} />
                  </div>
                </th>

                {/* Data -> orderDate */}
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("orderDate")}
                >
                  <div className="flex items-center gap-1">
                    Data
                    <ArrowUpDown size={14} className={arrowClass("orderDate")} />
                  </div>
                </th>

                {/* Cliente -> customerName */}
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("customerName")}
                >
                  <div className="flex items-center gap-1">
                    Cliente
                    <ArrowUpDown size={14} className={arrowClass("customerName")} />
                  </div>
                </th>

                {/* Valor de Venda -> totalAmount */}
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("totalAmount")}
                >
                    <div className="flex items-center gap-1">
                      Valor de Venda
                      <ArrowUpDown size={14} className={arrowClass("totalAmount")} />
                    </div>
                </th>

                {/* Margem -> margin */}
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("margin")}
                >
                  <div className="flex items-center gap-1">
                    Margem
                    <ArrowUpDown size={14} className={arrowClass("margin")} />
                  </div>
                </th>

                {/* Lucro -> profit */}
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("profit")}
                >
                  <div className="flex items-center gap-1">
                    Lucro
                    <ArrowUpDown size={14} className={arrowClass("profit")} />
                  </div>
                </th>

                <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="bg-card divide-y divide-border-dark">
              {displayedSales.map((sale: any, index: number) => {
                const saleId = sale?.id?.toString?.() ?? String(index);
                const isSelected = selected.includes(saleId);
                const fake = fakeById(sale);

                return (
                  <tr
                    key={saleId}
                    onClick={() => handleAbrirInfo(sale)}   // LINHA INTEIRA CLICÁVEL
                    onKeyDown={(e) => handleRowKeyDown(e, sale)} // Acessibilidade
                    role="button"
                    tabIndex={0}
                    className={`transition-colors hover:bg-background cursor-pointer ${
                      isSelected ? "bg-background/60" : ""
                    }`}
                    aria-selected={isSelected}
                  >
                    {/* Checkbox por linha */}
                    <td
                      className="px-4 py-3 w-10"
                      onClick={(e) => e.stopPropagation()} // não abrir modal ao clicar no checkbox
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(saleId)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-border-dark text-primary focus:ring-primary cursor-pointer"
                        aria-label={`Selecionar venda ${saleId}`}
                      />
                    </td>

                    <td className="px-4 py-3 text-sm font-medium text-text flex flex-col gap-1">
                      <span><strong>Status:</strong> {sale?.status ?? "—"}</span>
                      <span className="text-text-secondary truncate">
                        <strong>Produto:</strong>{" "}
                        {(sale?.items?.map((i: any) => i?.productName).join(", ")) ?? "N/A"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-text-secondary">
                      <strong>Data:</strong>{" "}
                      {sale?.orderDate ? new Date(sale.orderDate).toLocaleDateString("pt-BR") : "N/A"}
                    </td>

                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {sale?.customer ? `${sale.customer.firstName} ${sale.customer.lastName}` : "N/A"}
                    </td>

                    <td className="px-4 py-3 text-sm text-text text-center">
                      {sale?.totalAmount?.toLocaleString?.("pt-BR", { style: "currency", currency: "BRL" }) ?? "R$ 0,00"}
                    </td>

                    {/* placeholders de Margem/Lucro determinísticos (para combinar com a ordenação) */}
                    <td className="px-4 py-3 text-sm text-text text-center">
                      {`${fake.margin.toFixed(2)}%`}
                    </td>
                    <td className="px-4 py-3 text-sm text-text text-center">
                      {fake.profit.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>

                    <td
                      className="px-4 py-3 text-right"
                      onClick={(e) => e.stopPropagation()} // evitar abrir modal ao clicar no botão
                    >
                      <button
                        onClick={() => { setVendaSelecionada(sale); setOpenDrawer(true); }}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white bg-[#10b97c] hover:bg-[#0d9d6b] transition"
                        aria-label="Abrir simulador"
                      >
                        <Calculator size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* paginação */}
          <div className="flex items-center justify-between border-t border-border-dark bg-card px-4 py-3 mt-2">
            <div className="flex gap-2">
              <button
                className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                aria-label="Página anterior"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`p-2 rounded-md text-sm font-semibold ${
                    page === currentPage ? "bg-primary text-white" : "ring-1 ring-border-dark hover:bg-background"
                  }`}
                  onClick={() => setCurrentPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              <button
                className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                aria-label="Próxima página"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer calculadora */}
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        title={vendaSelecionada ? `Simulador - ${vendaSelecionada?.items?.[0]?.productName ?? ""}` : "Simulador de preços"}
      >
        <CalculadoraMargem
          initialPreco={vendaSelecionada?.totalAmount ?? 0}
          initialMargem={0}
          initialCusto={0}
        />
      </Drawer>

      {/* Modal de informações da venda */}
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
