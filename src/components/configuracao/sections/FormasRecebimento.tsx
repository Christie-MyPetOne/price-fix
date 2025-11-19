"use client";

import { useMemo, useState } from "react";
import EditFormaRecebimentoModal, {
  FormaRecebimento,
  FormaRecebimentoPayload,
} from "@/components/configuracao/modalFormasRecebimento";

const inputCls =
  "h-10 rounded-md border border-border-dark bg-card-light/40 px-3 text-sm " +
  "placeholder:text-text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function formatCurrency(value: number | null | undefined) {
  const v = typeof value === "number" ? value : 0;
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export default function FormasRecebimento() {
  const [formas, setFormas] = useState<FormaRecebimento[]>([
    {
      id: 1,
      titulo: "contareceber",
      tipoPagamento: "Outros",
      taxaFixa: 0,
      taxaPercentual: 0,
      canalNome: "Amazon FBA Onsite (10675)",
      creditoPisCofins: "Não",
    },
    {
      id: 2,
      titulo: "credito",
      tipoPagamento: "Cartão de Crédito",
      taxaFixa: 0,
      taxaPercentual: 0,
      canalNome: "Amazon FBA Onsite (10675)",
      creditoPisCofins: "Não",
    },
    {
      id: 3,
      titulo: "Mercado Pago",
      tipoPagamento: "Outros",
      taxaFixa: 0,
      taxaPercentual: 0,
      canalNome: "MY.PET.ONE - FULL (8544)",
      creditoPisCofins: "Não",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [selecionado, setSelecionado] = useState<FormaRecebimento | null>(null);
  const [busca, setBusca] = useState("");

  const data = useMemo(
    () =>
      formas.filter((f) =>
        f.titulo.toLowerCase().includes(busca.trim().toLowerCase())
      ),
    [busca, formas]
  );

  const handleSave = (payload: FormaRecebimentoPayload) => {
    if (!selecionado) return;

    setFormas((prev) =>
      prev.map((f) =>
        f.id === selecionado.id
          ? {
              ...f,
              titulo: payload.titulo.trim(),
              tipoPagamento: payload.tipoPagamento,
              taxaFixa:
                payload.taxaFixa === ""
                  ? null
                  : Number(payload.taxaFixa.replace(",", ".")),
              taxaPercentual:
                payload.taxaPercentual === ""
                  ? null
                  : Number(payload.taxaPercentual.replace(",", ".")),
              creditoPisCofins: payload.creditoPisCofins,
            }
          : f
      )
    );

    setOpen(false);
    setSelecionado(null);
  };

  const canalBadge = (nome: string) => {
    const inicial = nome.trim().charAt(0).toUpperCase() || "?";

    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-card-light/70 px-3 py-1 text-xs">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-sm font-semibold">
          {inicial}
        </span>
        <span className="text-xs font-medium text-text">{nome}</span>
      </div>
    );
  };

  return (
    <div className="-mt-9 min-h-[calc(100vh-64px)] pt-6">
      <div className="mx-auto max-w-6xl">
        {/* Cabeçalho */}
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-semibold text-text">
              Formas de recebimento
            </h1>
            <p className="text-sm text-text-secondary">
              de Outubro de 2025
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              placeholder="Buscar formas de recebimento"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={`${inputCls} w-full sm:w-64 bg-card`}
            />
          </div>
        </div>

        {/* Card principal (tabela) – mesmo estilo de ConfigBasica / Fornecedores */}
        <div className="rounded-xl border border-border-dark bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[960px] w-full">
              <thead className="border-b border-border-dark bg-card-light/40">
                <tr className="text-left text-sm text-text-secondary">
                  <th className="px-4 py-3 font-medium">Título</th>
                  <th className="px-4 py-3 font-medium">Tipo de pagamento</th>
                  <th className="px-4 py-3 font-medium">Taxas de venda</th>
                  <th className="px-4 py-3 font-medium">Canais de venda</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="text-sm text-text">
                {data.map((f) => (
                  <tr key={f.id} className="border-b border-border-dark">
                    <td className="px-4 py-3">{f.titulo}</td>
                    <td className="px-4 py-3">{f.tipoPagamento}</td>
                    <td className="px-4 py-3">
                      {`${formatCurrency(f.taxaFixa)} + ${
                        (f.taxaPercentual ?? 0).toFixed(2)
                      }%`}
                    </td>
                    <td className="px-4 py-3">{canalBadge(f.canalNome)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setSelecionado(f);
                          setOpen(true);
                        }}
                        className="rounded-md border border-border-dark px-3 py-1.5 text-xs font-medium hover:bg-card-light/60"
                      >
                        EDITAR
                      </button>
                    </td>
                  </tr>
                ))}

                {data.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-sm text-text-secondary"
                    >
                      Nenhuma forma de recebimento encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 text-sm text-text-secondary">
            <span>
              Mostrando todos os {data.length} formas de recebimento
            </span>

            <div className="flex gap-1">
              <button className="h-8 w-8 rounded-md border border-border-dark hover:bg-card-light/60">
                «
              </button>
              <button className="h-8 min-w-8 rounded-md border border-border-dark bg-primary px-2 text-white">
                1
              </button>
              <button className="h-8 w-8 rounded-md border border-border-dark hover:bg-card-light/60">
                »
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditFormaRecebimentoModal
        key={selecionado?.id ?? "novo"}
        open={open}
        forma={selecionado}
        onClose={() => {
          setOpen(false);
          setSelecionado(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
