"use client";

import { useMemo, useState } from "react";
import EditCanalModal, { Canal } from "@/components/configuracao/modalVendas";

const inicial: Canal[] = [
  { id: 9804, nome: "Amazon (9804)", comissao: 12, prazo: 20, aplicaComFrete: "Não", produtos: 353, fulfillment: "Não", ignoraImpostos: "Não" },
  { id: 10675, nome: "Amazon FBA Onsite (10675)", comissao: 12, prazo: 20, aplicaComFrete: "Não", produtos: 26, fulfillment: "Não", ignoraImpostos: "Não" },
  { id: 11513, nome: "Base (11513)", comissao: null, prazo: null, aplicaComFrete: null, produtos: 1150, fulfillment: "Não", ignoraImpostos: "Não" },
  { id: 11427, nome: "Magalu Marketplace (11427)", comissao: 14.8, prazo: 7, aplicaComFrete: "Não", produtos: 160, fulfillment: "Não", ignoraImpostos: "Não" },
  { id: 7706, nome: "MY.PET.ONE (7706)", comissao: "Automático", prazo: 12, aplicaComFrete: "Não", produtos: 1112, fulfillment: "Automático", ignoraImpostos: "Não" },
  { id: 8544, nome: "MY.PET.ONE - FULL (8544)", comissao: "Automático", prazo: 10, aplicaComFrete: "Não", produtos: 87, fulfillment: "Automático", ignoraImpostos: "Não" },
  { id: 11114, nome: "Shein (11114)", comissao: 16, prazo: 30, aplicaComFrete: "Não", produtos: 66, fulfillment: "Não", ignoraImpostos: "Não" },
  { id: 9566, nome: "Shopee (9566)", comissao: 20, prazo: 2, aplicaComFrete: "Não", produtos: 1563, fulfillment: "Não", ignoraImpostos: "Não" },
  { id: 11518, nome: "TikTok Shop (11518)", comissao: 0.06, prazo: 5, aplicaComFrete: "Não", produtos: 3, fulfillment: "Não", ignoraImpostos: "Não" },
];

export default function CanaisDeVendaPage() {
  const [canais, setCanais] = useState<Canal[]>(inicial);
  const [open, setOpen] = useState(false);
  const [selecionado, setSelecionado] = useState<Canal | null>(null);
  const [busca, setBusca] = useState("");

  const inputCls =
    "h-10 rounded-md border border-border-dark bg-card-light/40 px-3 text-sm " +
    "placeholder:text-text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

  const data = useMemo(
    () =>
      canais.filter((c) =>
        c.nome.toLowerCase().includes(busca.trim().toLowerCase())
      ),
    [busca, canais]
  );

  const ValorOuAlerta = ({ valor }: { valor?: number | string | null }) => {
    if (valor === null || valor === undefined) {
      return (
        <div className="flex items-center gap-2 text-text-secondary">
          <span>---</span>
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
            ▲
          </span>
        </div>
      );
    }
    return <span>{typeof valor === "number" ? valor.toFixed(Number.isInteger(valor) ? 0 : 2) : valor}</span>;
  };

  return (
    <div className="-mt-9 min-h-[calc(100vh-64px)] pt-6">
      <div className="mx-auto max-w-6xl">
        {/* header */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text">Canais de Venda</h1>
            <p className="text-sm text-text-secondary">de Outubro de 2025</p>
          </div>
          <input
            placeholder="Buscar canal..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className={`${inputCls} w-64 bg-card`}
          />
        </div>

        {/* tabela */}
        <div className="rounded-xl border border-border-dark bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[960px] w-full">
              <thead className="bg-card-light/40 border-b border-border-dark">
                <tr className="text-left text-sm text-text-secondary">
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">Comissão (%)</th>
                  <th className="px-4 py-3 font-medium">Prazo de Recebimento (dias)</th>
                  <th className="px-4 py-3 font-medium">Aplicar comissão no frete?</th>
                  <th className="px-4 py-3 font-medium">Produtos no canal</th>
                  <th className="px-4 py-3 font-medium">Fulfillment</th>
                  <th className="px-4 py-3 font-medium">Ignora impostos</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="text-sm text-text">
                {data.map((c) => (
                  <tr key={c.id} className="border-b border-border-dark">
                    <td className="px-4 py-3">{c.nome}</td>
                    <td className="px-4 py-3">
                      {c.comissao === "Automático" ? "Automático" : <ValorOuAlerta valor={c.comissao} />}
                    </td>
                    <td className="px-4 py-3"><ValorOuAlerta valor={c.prazo} /></td>
                    <td className="px-4 py-3">{c.aplicaComFrete ?? <ValorOuAlerta valor={null} />}</td>
                    <td className="px-4 py-3">{c.produtos?.toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3">{c.fulfillment}</td>
                    <td className="px-4 py-3">{c.ignoraImpostos}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setSelecionado(c); setOpen(true); }}
                        className="rounded-md border border-border-dark px-3 py-1.5 text-sm hover:bg-card-light/60"
                      >
                        EDITAR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4 text-sm text-text-secondary">
            <span>Mostrando todos os {data.length} canais de venda</span>
            <div className="flex gap-1">
              <button className="h-8 w-8 rounded-md border border-border-dark hover:bg-card-light/60">«</button>
              <button className="h-8 min-w-8 rounded-md border border-border-dark bg-primary text-white px-2">1</button>
              <button className="h-8 w-8 rounded-md border border-border-dark hover:bg-card-light/60">»</button>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      <EditCanalModal
        key={selecionado?.id ?? "novo"}
        open={open}
        onClose={() => { setOpen(false); setSelecionado(null); }}
        canal={selecionado}
        onSave={(payload) => {
          if (!selecionado) return;

          setCanais((prev) =>
            prev.map((c) =>
              c.id === selecionado.id
                ? {
                    ...c,
                    nome: payload.nomeCanal,
                    comissao:
                      payload.comissao === "" ? null : Number(payload.comissao),
                    prazo:
                      payload.prazo === "" ? null : Number(payload.prazo),
                    aplicaComFrete: payload.aplicarFrete,
                    fulfillment: payload.fulfillment === "Sim" ? "Automático" : "Não",
                    ignoraImpostos: payload.ignoraImpostos,
                    // os demais campos da modal (difal, cep etc.) não aparecem na listagem,
                    // mas você já os recebe em `payload` para salvar na API.
                  }
                : c
            )
          );

          setOpen(false);
          setSelecionado(null);
        }}
      />
    </div>
  );
}
