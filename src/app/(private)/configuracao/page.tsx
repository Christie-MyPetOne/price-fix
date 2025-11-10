"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";

/* ============ Select estilizado (embutido) ============ */
type UiSelectProps = {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
  placeholder?: string;
};

function UiSelect({
  value,
  onChange,
  options,
  className = "",
  placeholder = "Selecionar",
}: UiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const buttonClasses =
    "appearance-none w-full h-10 px-3 pr-8 rounded-md border border-[var(--color-border-dark)] bg-transparent text-sm text-[var(--color-text)] text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";

  return (
    <div ref={ref} className={`relative inline-block w-full ${className}`}>
      {/* Botão */}
      <button
        type="button"
        className={buttonClasses}
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value || placeholder}
      </button>

      {/* Chevron */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
        aria-hidden="true"
      >
        <path
          d="M7 10l5 5 5-5"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Menu */}
      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-20 border border-border-dark min-w-full"
          role="listbox"
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-[var(--color-text-secondary)]">
              Sem opções
            </div>
          ) : (
            options.map((opt) => {
              const active = opt === value;
              return (
                <button
                  key={opt}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--color-primary-light)]/10 ${
                    active ? "font-medium" : ""
                  }`}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                >
                  {opt}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

/* ============ Página ============ */
export default function ConfiguracaoPage() {
  const [regime, setRegime] = useState("");
  const [possuiRegimeEspecial, setPossuiRegimeEspecial] = useState("Sim");
  const [aplicaVendas, setAplicaVendas] = useState("Ambos");
  const [zeraICMS, setZeraICMS] = useState("Sim");

  // Campos por tipo de regime
  const camposPorRegime: Record<string, { label: string; value?: number }[]> = {
    "Lucro real": [
      { label: "PIS", value: 1.65 },
      { label: "COFINS", value: 7.6 },
      { label: "IRPJ pago no mês", value: 0.0 },
      { label: "CSLL pago no mês", value: 0.0 },
      { label: "Outros créditos tributários", value: 0.0 },
    ],
    "Lucro presumido": [
      { label: "PIS", value: 0.65 },
      { label: "COFINS", value: 3.0 },
      { label: "IRPJ pago no mês", value: 0.0 },
      { label: "CSLL pago no mês", value: 0.0 },
      { label: "Outros créditos tributários", value: 0.0 },
      { label: "CSLL", value: 9.0 },
    ],
    Simples: [
      { label: "IRPJ pago no mês", value: 0.0 },
      { label: "CSLL pago no mês", value: 0.0 },
      { label: "Outros créditos tributários", value: 0.0 },
      { label: "Simples", value: 0.0 },
    ],
    MEI: [
      { label: "IRPJ pago no mês", value: 0.0 },
      { label: "CSLL pago no mês", value: 0.0 },
      { label: "Outros créditos tributários", value: 0.0 },
      { label: "Contribuição mensal", value: 45.0 },
    ],
  };

  const campos = regime ? camposPorRegime[regime] : [];

  // Opções dos selects
  const regimeOptions = useMemo(
    () => ["Lucro real", "Lucro presumido", "Simples", "MEI"],
    []
  );
  const simNaoOptions = useMemo(() => ["Sim", "Não"], []);
  const aplicaOptions = useMemo(
    () => ["Ambos", "Não contribuintes", "Contribuintes"],
    []
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[var(--color-background)] to-[var(--color-primary-light)]/10 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-[var(--color-card)] shadow-lg rounded-2xl border border-[var(--color-border-dark)] p-8">
        {/* Cabeçalho */}
        <header className="mb-6 border-b border-[var(--color-border-dark)] pb-4">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Configurações básicas</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Outubro, 2025</p>
        </header>

        <section className="space-y-5">
          {/* Regime Tributário */}
          <div>
            <label className="text-[var(--color-text)] text-sm font-medium">
              Qual é seu regime tributário?
            </label>
            <br />
            <div className="mt-1 inline-block min-w-[220px] w-full md:w-auto">
              <UiSelect
                value={regime}
                onChange={setRegime}
                options={["", ...regimeOptions].filter(Boolean)}
                placeholder="Selecionar"
              />
            </div>
          </div>

          {/* Campos tributários dinâmicos */}
          {regime && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {campos.map((item) => (
                <div key={item.label}>
                  <label className="text-[var(--color-text-secondary)] text-sm mb-1 block">
                    {item.label}
                  </label>

                  {/* Campo especial MEI */}
                  {regime === "MEI" && item.label === "Contribuição mensal" ? (
                    <UiSelect
                      value={"R$ 45,00"}
                      onChange={() => {}}
                      options={["R$ 45,00", "R$ 50,00"]}
                    />
                  ) : (
                    <input
                      type="number"
                      defaultValue={item.value}
                      className="w-full border border-[var(--color-border-dark)] rounded-md h-10 px-2 text-sm bg-transparent"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Perguntas */}
          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
              <input type="checkbox" className="accent-[var(--color-primary)]" />
              Os custos de mercadoria em seu ERP contêm os gastos de PIS, COFINS e ICMS na compra?
            </label>

            <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
              <input type="checkbox" className="accent-[var(--color-primary)]" />
              Desconsiderar receita de frete no cálculo da margem percentual
            </label>
          </div>

          {/* Patrimônio */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Patrimônio Líquido
            </label>
            <input
              type="number"
              defaultValue={0.0}
              className=" border border-[var(--color-border-dark)] rounded-md h-10 px-2 text-sm bg-transparent"
            />
          </div>

          {/* Regime especial */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 items-end">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-[var(--color-text)] mb-1 block">
                Possui regime especial?
              </label>
              <UiSelect
                value={possuiRegimeEspecial}
                onChange={setPossuiRegimeEspecial}
                options={simNaoOptions}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-[var(--color-text)] mb-1 block">
                Aplica-se a vendas para
              </label>
              <UiSelect
                value={aplicaVendas}
                onChange={setAplicaVendas}
                options={aplicaOptions}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-[var(--color-text)] mb-1 block leading-tight">
                Desejo zerar crédito de ICMS quando a venda for considerada do Regime especial
              </label>
              <UiSelect
                value={zeraICMS}
                onChange={setZeraICMS}
                options={simNaoOptions}
              />
            </div>
          </div>

          {/* Estado e ICMS */}
          <div className="pt-6 border-t border-[var(--color-border-dark)] mt-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              Estado de expedição
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Estado", value: "MG" },
                { label: "ICMS produtos nacionais (mesmo estado)", value: 6.0 },
                { label: "ICMS produtos importados (mesmo estado)", value: 14.0 },
                { label: "ICMS produtos nacionais (outro estado)", value: 1.3 },
                { label: "ICMS produtos importados (outro estado)", value: 1.3 },
              ].map((item) => (
                <div key={item.label}>
                  <label className="block text-[var(--color-text-secondary)] text-sm mb-1">
                    {item.label}
                  </label>
                  <input
                    type="text"
                    defaultValue={item.value}
                    className="w-full border border-[var(--color-border-dark)] rounded-md h-10 px-2 text-sm bg-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Custos fixos */}
          <div className="pt-6 border-t border-[var(--color-border-dark)] mt-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">
              Custos fixos mensais
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
              Se você souber, pode inserir os custos fixos da sua empresa clicando no ícone do lápis abaixo.
            </p>

            <div className="flex items-center gap-3">
              <input
                type="number"
                defaultValue={226261.8}
                className=" border border-[var(--color-border-dark)] rounded-md h-10 px-2 text-sm bg-transparent"
              />
              <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm px-4 py-2 rounded-md">
                Editar
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
