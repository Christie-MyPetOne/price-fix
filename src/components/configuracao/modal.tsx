"use client";

import { useMemo, useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import UiSelect from "@/components/ui/UiSelect";
import { Percent } from "lucide-react";

export type Canal = {
  id: number | string;
  nome: string;
  comissao?: number | "Automático" | null;
  prazo?: number | null;
  aplicaComFrete?: "Sim" | "Não" | null;
  produtos?: number | null;
  fulfillment?: "Não" | "Automático";
  ignoraImpostos?: "Sim" | "Não";
};

type EditData = {
  canalSelecao: string;
  nomeCanal: string;
  comissao: string | number;
  prazo: string | number;
  aplicarFrete: "Sim" | "Não";
  fulfillment: "Sim" | "Não";
  ignoraImpostos: "Sim" | "Não";
  creditoPisCofinsVenda: "Sim" | "Não";
  creditoPisCofinsFrete: "Sim" | "Não";
  creditoIcmsFrete: string | number;
  gastoFixoAbs: string | number;
  gastoFixoPct: string | number;
  difalEstados: string;
  tipoEntrega: string;
  regiaoCep: string;
  estadoExpedicao: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave?: (data: EditData) => void;
  /** dados do canal selecionado para pré-preencher */
  canal?: Canal | null;
};

const labelSm = "text-sm text-text-secondary";
const inputCls =
  "w-full h-10 rounded-md border border-border-dark bg-card px-3 text-sm " +
  "placeholder:text-text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function EditCanalModal({ open, onClose, onSave, canal }: Props) {
  // opções
  const simNao = useMemo(() => ["Sim", "Não"], []);
  const canais = useMemo(
    () => ["Amazon", "Amazon FBA Onsite", "Magalu", "Shopee", "Shein", "TikTok Shop", "Base"],
    []
  );
  const tiposEntrega = useMemo(() => ["DBA", "FBA", "FBM"], []);

  // estado
  const [form, setForm] = useState<EditData>({
    canalSelecao: "Amazon",
    nomeCanal: "Amazon (9804)",
    comissao: 12,
    prazo: 20,
    aplicarFrete: "Não",
    fulfillment: "Não",
    ignoraImpostos: "Não",
    creditoPisCofinsVenda: "Sim",
    creditoPisCofinsFrete: "Sim",
    creditoIcmsFrete: 0,
    gastoFixoAbs: 4.5,
    gastoFixoPct: "",
    difalEstados: "Desejo ignorar ICMS Difal nas vendas para esses estados",
    tipoEntrega: "DBA",
    regiaoCep: "30622-213",
    estadoExpedicao: "Minas Gerais",
  });

  // quando abrir com um canal, preenche
  useEffect(() => {
    if (!canal) return;
    setForm((prev) => ({
      ...prev,
      canalSelecao: (canal.nome.split(" ")[0] ?? "Canal"),
      nomeCanal: canal.nome,
      comissao: typeof canal.comissao === "number" ? canal.comissao : 0,
      prazo: canal.prazo ?? 0,
      aplicarFrete: canal.aplicaComFrete ?? "Não",
      fulfillment: canal.fulfillment === "Automático" ? "Sim" : "Não",
      ignoraImpostos: canal.ignoraImpostos ?? "Não",
    }));
  }, [canal]);

  const handle = <K extends keyof EditData>(key: K, value: EditData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const salvar = () => {
    onSave?.(form);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="xl" title="Editando canal de venda">
      <div className="grid gap-6">
        <h3 className="text-xs font-semibold tracking-wide text-text-secondary">
          CONFIGURAÇÕES BÁSICAS DO CANAL
        </h3>

        {/* primeira linha */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelSm}>Canal de venda</label>
            <UiSelect
              value={form.canalSelecao}
              onChange={(v) => handle("canalSelecao", v as EditData["canalSelecao"])}
              options={canais}
              placeholder="Selecionar"
            />
          </div>

          <div>
            <label className={labelSm}>Comissão</label>
            <div className="relative">
              <input
                className={`${inputCls} pr-8`}
                inputMode="decimal"
                value={form.comissao}
                onChange={(e) => handle("comissao", e.target.value)}
              />
              <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70" />
            </div>
          </div>

          <div>
            <label className={labelSm}>Prazo de recebimento</label>
            <div className="flex items-center gap-2">
              <input
                className={`${inputCls} w-28`}
                inputMode="numeric"
                value={form.prazo}
                onChange={(e) => handle("prazo", e.target.value)}
              />
              <div className="flex h-10 items-center rounded-md border border-border-dark bg-card-light/40 px-3 text-sm">
                DIAS
              </div>
            </div>
          </div>
        </div>

        {/* nome */}
        <div>
          <label className={labelSm}>Nome do canal</label>
          <input className={inputCls} value={form.nomeCanal} onChange={(e) => handle("nomeCanal", e.target.value)} />
        </div>

        {/* selects pares */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelSm}>Aplicar comissão no frete?</label>
            <UiSelect
              value={form.aplicarFrete}
              onChange={(v) => handle("aplicarFrete", v as EditData["aplicarFrete"])}
              options={simNao}
            />
          </div>
          <div>
            <label className={labelSm}>Fulfillment?</label>
            <UiSelect
              value={form.fulfillment}
              onChange={(v) => handle("fulfillment", v as EditData["fulfillment"])}
              options={simNao}
            />
          </div>
        </div>

        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelSm}>Ignora impostos?</label>
            <UiSelect
              value={form.ignoraImpostos}
              onChange={(v) => handle("ignoraImpostos", v as EditData["ignoraImpostos"])}
              options={simNao}
            />
          </div>
          <div className="-mt-6">
            <label className={labelSm}>Crédito de PIS e COFINS sobre comissão e taxa de venda?</label>
            <UiSelect
              value={form.creditoPisCofinsVenda}
              onChange={(v) => handle("creditoPisCofinsVenda", v as EditData["creditoPisCofinsVenda"])}
              options={simNao}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelSm}>Crédito de PIS e COFINS sobre taxa de frete?</label>
            <UiSelect
              value={form.creditoPisCofinsFrete}
              onChange={(v) => handle("creditoPisCofinsFrete", v as EditData["creditoPisCofinsFrete"])}
              options={simNao}
            />
          </div>

          <div>
            <label className={labelSm}>Crédito de ICMS no frete</label>
            <div className="relative">
              <input
                className={`${inputCls} pr-8`}
                inputMode="decimal"
                value={form.creditoIcmsFrete}
                onChange={(e) => handle("creditoIcmsFrete", e.target.value)}
              />
              <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70" />
            </div>
          </div>
        </div>

        {/* gastos fixos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelSm}>Valor absoluto de gasto fixo por pedido</label>
            <div className="flex items-center gap-2">
              <div className="flex h-10 items-center rounded-md border border-border-dark bg-card-light/40 px-3 text-sm">
                R$
              </div>
              <input
                className={`${inputCls}`}
                inputMode="decimal"
                value={form.gastoFixoAbs}
                onChange={(e) => handle("gastoFixoAbs", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelSm}>Valor percentual de gasto fixo por pedido</label>
            <div className="relative">
              <input
                className={`${inputCls} pr-8`}
                inputMode="decimal"
                value={form.gastoFixoPct}
                onChange={(e) => handle("gastoFixoPct", e.target.value)}
              />
              <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70" />
            </div>
          </div>
        </div>

        <div>
          <UiSelect
            value={form.difalEstados}
            onChange={(v) => handle("difalEstados", v as string)}
            options={[
              "Desejo ignorar ICMS Difal nas vendas para esses estados",
              "Não ignorar ICMS Difal",
            ]}
          />
        </div>

        <h3 className="text-xs font-semibold tracking-wide text-text-secondary">
          CONFIGURAÇÕES ESPECÍFICAS DO CANAL
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelSm}>Tipo de entrega</label>
            <UiSelect value={form.tipoEntrega} onChange={(v) => handle("tipoEntrega", v as string)} options={tiposEntrega} />
          </div>

          <div>
            <label className={labelSm}>Região de expedição (CEP)</label>
            <input className={inputCls} value={form.regiaoCep} onChange={(e) => handle("regiaoCep", e.target.value)} />
          </div>

          <div>
            <label className={labelSm}>Estado de expedição</label>
            <UiSelect
              value={form.estadoExpedicao}
              onChange={(v) => handle("estadoExpedicao", v as string)}
              options={[
                "Minas Gerais",
                "São Paulo",
                "Rio de Janeiro",
                "Bahia",
                "Paraná",
                "Rio Grande do Sul",
              ]}
            />
          </div>
        </div>

        {/* ações */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
          <button
            onClick={salvar}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm px-5 py-2 rounded-md"
          >
            SALVAR
          </button>
          <button
            onClick={onClose}
            className="border border-border-dark hover:bg-card-light/60 text-sm px-5 py-2 rounded-md"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </Modal>
  );
}
