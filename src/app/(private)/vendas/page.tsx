"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSaleStore } from "@/store/useSaleStore";
import { VendasFilters } from "@/components/vendas/VendasFilters";
import { VendasTable } from "@/components/vendas/VendasTable";
import MargensChart from "@/components/vendas/MargensChart";
import Modal from "@/components/ui/Modal";
import ResumoCards from "@/components/vendas/ResumoCards";
import { ShoppingBag } from "lucide-react";

type FiltersState = {
  date: string;
  empresa: string;
  canal: string;
  produto: string;
};

export default function VendasPage() {
  const { sales, fetchSales, filterSales, clearFilters } = useSaleStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FiltersState>({
    date: "",
    empresa: "",
    canal: "",
    produto: "",
  });

  const [margens, setMargens] = useState({ alta: 20, media: 12 });
  const [selectedMargemIds, setSelectedMargemIds] = useState<string[]>([
    "alta",
    "media",
    "baixa",
    "preju",
    "incompleto",
  ]);
  const [openMarginsModal, setOpenMarginsModal] = useState(false);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);
  const handleSearch = (term: string) => setSearchTerm(term);

  const handleFilterChange = (filterName: string, value: string) => {
    if (filterName === "apply") {
      const allEmpty =
        !searchTerm &&
        !filters.date &&
        !filters.empresa &&
        !filters.canal &&
        !filters.produto;

      if (allEmpty) clearFilters();
      else
        filterSales({
          q: searchTerm,
          date: filters.date,
          empresa: filters.empresa,
          canal: filters.canal,
          produto: filters.produto,
        });
      return;
    }
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedMargemIds(
      checked ? ["alta", "media", "baixa", "preju", "incompleto"] : []
    );
  };

  const buckets = useMemo(() => {
    if (!sales?.length) return [];

    const groups = {
      alta: { id: "alta", titulo: "Margem alta", orders: 0, lucro: 0 },
      media: { id: "media", titulo: "Margem média", orders: 0, lucro: 0 },
      baixa: { id: "baixa", titulo: "Margem baixa", orders: 0, lucro: 0 },
      preju: { id: "preju", titulo: "Prejuízo", orders: 0, lucro: 0 },
      incompleto: {
        id: "incompleto",
        titulo: "Incompletos",
        orders: 0,
        lucro: 0,
      },
    };

    const getBucketId = (faturado: number, custo: number) => {
      const lucro = faturado - custo;
      if (faturado <= 0) return "incompleto";
      if (lucro < 0) return "preju";

      const margem = (lucro / faturado) * 100;
      if (isNaN(margem)) return "incompleto";
      if (margem > margens.alta) return "alta";
      if (margem >= margens.media) return "media";
      if (margem >= 0) return "baixa";
      return "preju";
    };

    for (const sale of sales) {
      const faturado = sale.financials?.valor_faturado ?? 0;
      const custo =
        sale.items?.reduce((acc, item) => acc + (item.totalCost ?? 0), 0) ?? 0;
      const bucketId = getBucketId(faturado, custo);
      const lucro = faturado - custo;

      groups[bucketId].orders++;
      groups[bucketId].lucro += lucro;
    }

    const totalOrders = Object.values(groups).reduce(
      (sum, g) => sum + g.orders,
      0
    );

    return Object.values(groups).map((g) => ({
      ...g,
      percent: totalOrders ? (g.orders / totalOrders) * 100 : 0,
    }));
  }, [sales, margens]);

  const legend = useMemo(
    () => [
      { label: "Alta", range: `> ${margens.alta.toFixed(2)}%` },
      {
        label: "Média",
        range: `${margens.media.toFixed(2)}% - ${margens.alta.toFixed(2)}%`,
      },
      { label: "Baixa", range: `< ${margens.media.toFixed(2)}%` },
    ],
    [margens]
  );

  const handleSaveMargens = (novaAlta: number, novaMedia: number) => {
    setMargens({ alta: novaAlta, media: novaMedia });
    setOpenMarginsModal(false);
  };

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const faturado = sale.financials?.valor_faturado ?? 0;
      const custo =
        sale.items?.reduce((acc, item) => acc + (item.totalCost ?? 0), 0) ?? 0;
      const lucro = faturado - custo;
      const margem = faturado > 0 ? (lucro / faturado) * 100 : NaN;

      if (isNaN(margem)) return selectedMargemIds.includes("incompleto");
      if (lucro < 0) return selectedMargemIds.includes("preju");
      if (margem > margens.alta) return selectedMargemIds.includes("alta");
      if (margem >= margens.media) return selectedMargemIds.includes("media");
      if (margem >= 0) return selectedMargemIds.includes("baixa");
      return false;
    });
  }, [sales, selectedMargemIds, margens]);

  return (
    <>
      <div className="max-w-5xl mx-auto w-full flex flex-col lg:flex-row gap-6 h-full">
        <div className="flex-1 min-w-0">
          <div className="text-2xl sm:text-2xl font-bold my-6 ml-3 text-text">
            <span className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-primary" />
              Vendas
            </span>
          </div>
          <VendasFilters
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onSelectAll={handleSelectAll}
          />

          <ResumoCards sales={sales} />

          <div className="my-8">
            <MargensChart
              buckets={buckets}
              legend={legend}
              onEditRanges={() => setOpenMarginsModal(true)}
              onChangeSelection={setSelectedMargemIds}
              selectedMargemIds={selectedMargemIds}
            />
          </div>

          <Modal
            open={openMarginsModal}
            onClose={() => setOpenMarginsModal(false)}
            title="Configurar margens"
            size="sm"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const novaAlta = parseFloat(
                  (form.elements.namedItem("alta") as HTMLInputElement).value
                );
                const novaMedia = parseFloat(
                  (form.elements.namedItem("media") as HTMLInputElement).value
                );
                handleSaveMargens(novaAlta, novaMedia);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    Margem alta (%)
                  </label>
                  <input
                    type="number"
                    name="alta"
                    defaultValue={margens.alta}
                    step="0.1"
                    className="mt-1 w-full rounded-md border border-border-dark bg-background px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Margem média (%)
                  </label>
                  <input
                    type="number"
                    name="media"
                    defaultValue={margens.media}
                    step="0.1"
                    className="mt-1 w-full rounded-md border border-border-dark bg-background px-2 py-1"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </form>
          </Modal>

          <VendasTable
            selectedMargemIds={selectedMargemIds}
            sales={filteredSales}
          />
        </div>
      </div>
    </>
  );
}
