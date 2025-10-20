"use client";
import React, { useState } from "react";
import { Venda } from "../../lib/types";
import { ChevronLeft, ChevronRight, ArrowUpDown, Calculator } from "lucide-react";
import { sortData, toggleSelection, toggleSelectAll } from "../../lib/utils";
import CalculadoraMargem from "./Calculadora";
import Drawer from "../ui/Drawer"; // ajuste caminho

interface VendasTableProps {
  vendas: Venda[];
}

export function VendasTable({ vendas }: VendasTableProps) {
  const [sortedVendas, setSortedVendas] = useState(vendas);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Venda | null; direction: "asc" | "desc" }>({ key: null, direction: "asc" });
  const [selected, setSelected] = useState<string[]>([]);

  // drawer state
  const [openDrawer, setOpenDrawer] = useState(false);
  const [vendaSelecionada, setVendaSelecionada] = useState<Venda | null>(null);

  const allSelected = selected.length === vendas.length;

  const headers: { key: keyof Venda; label: string }[] = [
    { key: "name", label: "Pedidos" },
    { key: "consiliacao", label: "Conciliação" },
    { key: "price", label: "Valor da venda" },
    { key: "margin", label: "Margem" },
    { key: "totalProfit", label: "Lucro" },
  ];

  const handleSort = (key: keyof Venda) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortedVendas(sortData(sortedVendas, key, direction));
    setSortConfig({ key, direction });
  };

  const handleToggleAll = () => setSelected(toggleSelectAll(vendas, selected));
  const handleToggleOne = (id: string) => setSelected(toggleSelection(selected, id));

  return (
    <div className="bg-card p-6 rounded-lg shadow-md mt-6 border border-border-dark overflow-x-auto">
      <table className="min-w-full divide-y divide-border-dark">
        <thead className="bg-background">
          <tr>
            <th className="px-6 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleToggleAll}
                className="rounded border-border-dark bg-background text-primary shadow-sm focus:ring-primary cursor-pointer"
              />
            </th>
            {headers.map(({ key, label }) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
              >
                <div className="flex items-center gap-1">
                  {label}
                  <ArrowUpDown
                    size={14}
                    className={`transition-transform ${
                      sortConfig.key === key ? "text-primary" : "text-gray-400"
                    } ${
                      sortConfig.key === key && sortConfig.direction === "asc" ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>

        <tbody className="bg-card divide-y divide-border-dark">
          {sortedVendas.map((venda) => (
            <tr key={venda.id} className="hover:bg-background transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selected.includes(venda.id)}
                  onChange={() => handleToggleOne(venda.id)}
                  className="rounded border-border-dark bg-background text-primary shadow-sm focus:ring-primary cursor-pointer"
                />
              </td>
              <td className="px-6 py-4 text-sm font-medium text-text">{venda.name}</td>
              <td className="px-6 py-4 text-sm text-text-secondary">{venda.consiliacao}</td>
              <td className="px-6 py-4 text-sm text-text">
                {venda.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </td>
              <td className="px-6 py-4 text-sm text-text">{venda.margin.toFixed(2)}%</td>
              <td className="px-6 py-4 text-sm">
                <span className={venda.totalProfit < 0 ? "text-error" : "text-primary"}>
                  {venda.totalProfit.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </td>

              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => {
                    setVendaSelecionada(venda);
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
      <div className="flex items-center justify-between border-t border-border-dark bg-card px-4 py-3 sm:px-6">
        <p className="text-sm text-text-secondary hidden sm:block">
          Mostrando <span className="font-medium">1</span> a <span className="font-medium">10</span> de{" "}
          <span className="font-medium">99</span> resultados
        </p>
        <div className="flex gap-2">
          <button className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background"><ChevronLeft size={16} /></button>
          <button className="p-2 rounded-md bg-primary text-white font-semibold text-sm">1</button>
          <button className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background">2</button>
          <button className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background"><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* Drawer da Calculadora */}
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        title={vendaSelecionada?.name ?? "Simulador de preços"}
      >
        <CalculadoraMargem
          initialPreco={vendaSelecionada?.price ?? 0}
          initialMargem={vendaSelecionada?.margin ?? 0}
        />
      </Drawer>
    </div>
  );
}
