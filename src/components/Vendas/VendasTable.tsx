"use client";
import React, { useEffect, useState } from "react";
import { useSalesStore } from "../../store/useSalesStore";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Calculator,
} from "lucide-react";
import { sortData, toggleSelection, toggleSelectAll } from "../../lib/utils";
import Drawer from "../ui/Drawer";
import CalculadoraMargem from "../Vendas/Calculadora";

export function VendasTable() {
  const { sales, fetchSales, loading } = useSalesStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof sales)[0] | null;
    direction: "asc" | "desc";
  }>({ key: "totalAmount", direction: "desc" });

  const [openDrawer, setOpenDrawer] = useState(false);
  const [vendaSelecionada, setVendaSelecionada] = useState<
    (typeof sales)[0] | null
  >(null);

  useEffect(() => {
    fetchSales(); // busca dados reais do endpoint
  }, [fetchSales]);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (key: keyof (typeof sales)[0]) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleOne = (id: string) => setSelected(toggleSelection(selected, id));
  const toggleAll = () =>
    setSelected(toggleSelectAll(displayedSales, selected));

  const sortedSales = React.useMemo(() => {
    if (!sortConfig.key) return sales;
    return sortData(sales, sortConfig.key, sortConfig.direction);
  }, [sales, sortConfig]);

  const totalPages = Math.ceil(sortedSales.length / rowsPerPage);
  const displayedSales = sortedSales.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const allSelected = selected.length === displayedSales.length;

  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md mt-6 border border-border-dark w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm text-text-secondary flex items-center gap-2">
          Mostrar
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border border-border-dark rounded px-2 py-1"
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
            {Math.min(currentPage * rowsPerPage, sortedSales.length)}
          </span>{" "}
          de <span className="font-medium">{sortedSales.length}</span>{" "}
          resultados
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48 bg-white mt-6 rounded-lg shadow-md">
          <span className="text-gray-500 flex items-center gap-2">
            <Calculator className="animate-spin" /> Carregando...
          </span>
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
                  />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("orderDate")}
                >
                  <div className="flex items-center gap-1">
                    Pedido
                    <ArrowUpDown
                      size={14}
                      className={`transition-transform ${
                        sortConfig.key === "orderDate"
                          ? "text-primary"
                          : "text-gray-400"
                      } ${
                        sortConfig.key === "orderDate" &&
                        sortConfig.direction === "asc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("customer")}
                >
                  Cliente
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("totalAmount")}
                >
                  Valor da venda
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("totalAmount")}
                >
                  Margem
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("totalAmount")}
                >
                  Lucro
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border-dark">
              {displayedSales.map((sale, index) => (
                <tr
                  key={sale.id ?? index} // fallback para index se id não existir
                  className="hover:bg-background transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(sale.id)}
                      onChange={() => toggleOne(sale.id)}
                      className="rounded border-border-dark text-primary focus:ring-primary cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-text flex flex-col gap-1">
                    <span>
                      <strong>Status:</strong> {sale.status}
                    </span>
                    <span>
                      <strong>Data:</strong>{" "}
                      {sale.orderDate
                        ? new Date(sale.orderDate).toLocaleDateString("pt-BR")
                        : "N/A"}
                    </span>
                    <span>
                      <strong>Produto:</strong>{" "}
                      {sale.items?.map((item) => item.productName).join(", ") ??
                        "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {sale.customer
                      ? `${sale.customer.firstName} ${sale.customer.lastName}`
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-text">
                    {sale.totalAmount?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }) ?? "R$ 0,00"}
                  </td>
                  {/* Margem */}
                  <td className="px-4 py-3 text-sm text-text text-center">faltam dados!</td>

                  {/* Lucro */}
                  <td className="px-4 py-3 text-sm text-text text-center">faltam dados!</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setVendaSelecionada(sale);
                        setOpenDrawer(true);
                      }}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white bg-[#10b97c] hover:bg-[#0d9d6b] transition"
                    >
                      <Calculator size={16} />
                      
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginação */}
          <div className="flex items-center justify-between border-t border-border-dark bg-card px-4 py-3 mt-2">
            <div className="flex gap-2">
              <button
                className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
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
                className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer com a Calculadora */}
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        title={
          vendaSelecionada
            ? `Simulador - ${vendaSelecionada.items[0].productName}`
            : "Simulador de preços"
        }
      >
        <CalculadoraMargem
          initialPreco={vendaSelecionada?.totalAmount ?? 0}
          initialMargem={0}
          initialCusto={0}
        />
      </Drawer>
    </div>
  );
}
