"use client";

import { useEffect, useState } from "react";
import { X, Percent } from "lucide-react";

export type FormaRecebimento = {
  id: number;
  titulo: string;
  tipoPagamento: string;
  taxaFixa: number | null;
  taxaPercentual: number | null;
  canalNome: string;
  creditoPisCofins?: "Sim" | "Não";
};

export type FormaRecebimentoPayload = {
  titulo: string;
  tipoPagamento: string;
  taxaFixa: string;
  taxaPercentual: string;
  creditoPisCofins: "Sim" | "Não";
};

type Props = {
  open: boolean;
  forma: FormaRecebimento | null;
  onClose: () => void;
  onSave: (payload: FormaRecebimentoPayload) => void;
};

const inputCls =
  "h-10 w-full rounded-md border border-border-dark bg-card px-3 text-sm text-text " +
  "placeholder:text-text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";

export default function EditFormaRecebimentoModal({
  open,
  forma,
  onClose,
  onSave,
}: Props) {
  const [titulo, setTitulo] = useState("");
  const [tipoPagamento, setTipoPagamento] = useState("Outros");
  const [taxaFixa, setTaxaFixa] = useState("");
  const [taxaPercentual, setTaxaPercentual] = useState("");
  const [creditoPisCofins, setCreditoPisCofins] = useState<"Sim" | "Não">(
    "Não"
  );

  useEffect(() => {
    if (!open || !forma) return;

    setTitulo(forma.titulo ?? "");
    setTipoPagamento(forma.tipoPagamento || "Outros");
    setTaxaFixa(
      forma.taxaFixa !== null && forma.taxaFixa !== undefined
        ? String(forma.taxaFixa)
        : ""
    );
    setTaxaPercentual(
      forma.taxaPercentual !== null && forma.taxaPercentual !== undefined
        ? String(forma.taxaPercentual)
        : ""
    );
    setCreditoPisCofins(forma.creditoPisCofins ?? "Não");
  }, [open, forma]);

  if (!open || !forma) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      titulo,
      tipoPagamento,
      taxaFixa: taxaFixa.trim(),
      taxaPercentual: taxaPercentual.trim(),
      creditoPisCofins,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-2xl border border-border-dark bg-card shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-border-dark px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-text">
              Formas de recebimento
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-card-light/70"
          >
            <X className="h-5 w-5 text-text-secondary" />
          </button>
        </div>

        {/* body */}
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">
              Título
            </label>
            <input
              className={inputCls}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">
                Tipo de pagamento
              </label>
              <select
                className={inputCls}
                value={tipoPagamento}
                onChange={(e) => setTipoPagamento(e.target.value)}
              >
                <option value="Outros">Outros</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Pix">Pix</option>
                <option value="Boleto">Boleto</option>
              </select>
            </div>
            {/* espaço vazio só para alinhar layout com a imagem (opcional) */}
            <div className="hidden md:block" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Taxa fixa com R$ dentro do input (prefixo) */}
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">
                Taxa fixa
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-text-secondary">
                  R$
                </span>
                <input
                  className={`${inputCls} pl-9`}
                  value={taxaFixa}
                  onChange={(e) => setTaxaFixa(e.target.value)}
                  placeholder="0,00"
                  inputMode="decimal"
                />
              </div>
            </div>

            {/* Taxa percentual com % dentro do input (sufixo) */}
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">
                Taxa percentual
              </label>
              <div className="relative">
                <input
                  className={`${inputCls} pr-9`}
                  value={taxaPercentual}
                  onChange={(e) => setTaxaPercentual(e.target.value)}
                  placeholder="0,00"
                  inputMode="decimal"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-text-secondary">
                  <Percent className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">
              Crédito de PIS e COFINS sobre taxa de venda
            </label>
            <select
              className={inputCls}
              value={creditoPisCofins}
              onChange={(e) =>
                setCreditoPisCofins(e.target.value as "Sim" | "Não")
              }
            >
              <option value="Não">Não</option>
              <option value="Sim">Sim</option>
            </select>
          </div>

          {/* footer */}
          <div className="mt-4 flex items-center justify-end gap-3 border-t border-border-dark pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border-dark px-4 py-2 text-sm font-medium text-text hover:bg-card-light/70"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
