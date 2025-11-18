"use client";

import { useMemo, useState } from "react";

export default function ConfigBasica() {
  const [regime, setRegime] = useState("");
  const [possuiRegimeEspecial, setPossuiRegimeEspecial] = useState("Sim");
  const [aplicaVendas, setAplicaVendas] = useState("Ambos");
  const [zeraICMS, setZeraICMS] = useState("Sim");
  const [estadoUF, setEstadoUF] = useState("MG");
  const [custoFixo, setCustoFixo] = useState("226.261,80");

  // largura padrão dos campos (inputs + selects)
  const fieldWidth = "w-[clamp(160px,40vw,355px)]";

  const baseInputCls =
    "h-10 rounded-md border border-border-dark bg-[var(--color-card)] px-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-secondary)] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";

  const inputNarrow = `${fieldWidth} ${baseInputCls}`;

  const sectionTitle = "text-base font-semibold text-text";

  const camposPorRegime: Record<string, { label: string; value?: number }[]> = {
    "Lucro real": [
      { label: "PIS", value: 1.65 },
      { label: "COFINS", value: 7.6 },
      { label: "IRPJ pago no mês", value: 0 },
      { label: "CSLL pago no mês", value: 0 },
      { label: "Outros créditos tributários", value: 0 },
    ],
    "Lucro presumido": [
      { label: "PIS", value: 0.65 },
      { label: "COFINS", value: 3 },
      { label: "IRPJ pago no mês", value: 0 },
      { label: "CSLL pago no mês", value: 0 },
      { label: "Outros créditos tributários", value: 0 },
      { label: "CSLL", value: 9 },
    ],
    Simples: [
      { label: "IRPJ pago no mês", value: 0 },
      { label: "CSLL pago no mês", value: 0 },
      { label: "Outros créditos tributários", value: 0 },
      { label: "Simples", value: 0 },
    ],
    MEI: [
      { label: "IRPJ pago no mês", value: 0 },
      { label: "CSLL pago no mês", value: 0 },
      { label: "Outros créditos tributários", value: 0 },
      { label: "Contribuição mensal", value: 45 },
    ],
  };

  const campos = regime ? camposPorRegime[regime] : [];

  const regimeOptions = useMemo(
    () => ["Lucro real", "Lucro presumido", "Simples", "MEI"],
    []
  );

  const simNaoOptions = useMemo(() => ["Sim", "Não"], []);

  const aplicaOptions = useMemo(
    () => ["Ambos", "Não contribuintes", "Contribuintes"],
    []
  );

  const estadosBrasil = useMemo(
    () => [
      "AC",
      "AL",
      "AP",
      "AM",
      "BA",
      "CE",
      "DF",
      "ES",
      "GO",
      "MA",
      "MT",
      "MS",
      "MG",
      "PA",
      "PB",
      "PR",
      "PE",
      "PI",
      "RJ",
      "RN",
      "RS",
      "RO",
      "RR",
      "SC",
      "SP",
      "SE",
      "TO",
    ],
    []
  );

  function formatCurrencyBR(value: string) {
    const onlyNumbers = value.replace(/\D/g, "");
    if (!onlyNumbers) return "";
    const number = parseFloat(onlyNumbers) / 100;
    return number.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="-mt-9 min-h-[calc(100vh-64px)] p-6">
      <div className="mx-auto max-w-6xl px-4">
        {/* Cabeçalho da página */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-text">Configurações básicas</h1>
          <p className="text-sm text-text-secondary">
            Ajuste regras fiscais e custos da empresa.
          </p>
        </div>

        {/* Card principal */}
        <div className="rounded-xl border border-border-dark bg-card shadow-sm">
          <div className="p-6 grid gap-2">
            
            {/* Regime */}
            <section className="grid gap-4">
              <h2 className={sectionTitle}>Regime tributário</h2>

              <select
                value={regime}
                onChange={(e) => setRegime(e.target.value)}
                className={`${inputNarrow} `}
              >
                <option value="" disabled>Selecionar</option>
                {regimeOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>

              {regime && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  {campos.map((item) => (
                    <div key={item.label} className="flex flex-col gap-1">
                      <label className="text-text-secondary text-sm">
                        {item.label}
                      </label>

                      {regime === "MEI" && item.label === "Contribuição mensal" ? (
                        <select className={`${baseInputCls} w-full`}>
                          {["R$ 45,00", "R$ 50,00"].map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="number"
                          defaultValue={item.value}
                          className={`${baseInputCls} w-full`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="h-px bg-border-dark/60" />

            {/* Perguntas */}
            <section className="grid gap-3">
              <label className="flex items-start sm:items-center gap-2 text-sm text-text">
                <input type="checkbox" className="accent-primary" />
                Os custos de mercadoria em seu ERP contêm PIS, COFINS e ICMS?
              </label>
              <label className="flex items-start sm:items-center gap-2 text-sm text-text">
                <input type="checkbox" className="accent-primary" />
                Desconsiderar receita de frete no cálculo da margem percentual
              </label>
            </section>

            <div className="h-px bg-border-dark/60" />

            {/* Patrimônio */}
            <section className="grid gap-2">
              <label className="text-sm font-medium text-text">Patrimônio Líquido</label>
              <input type="number" defaultValue={0} className={`${inputNarrow} `} />
            </section>

            {/* Regime especial */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-text mb-1 block">
                  Possui regime especial?
                </label>
                <select
                  value={possuiRegimeEspecial}
                  onChange={(e) => setPossuiRegimeEspecial(e.target.value)}
                  className={`${inputNarrow} w-full`}
                >
                  {simNaoOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-text mb-1 block">
                  Aplica-se a vendas para:
                </label>
                <select
                  value={aplicaVendas}
                  onChange={(e) => setAplicaVendas(e.target.value)}
                  className={`${inputNarrow} w-full`}
                >
                  {aplicaOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-text mb-1 block">
                  Zerar crédito de ICMS no regime especial
                </label>
                <select
                  value={zeraICMS}
                  onChange={(e) => setZeraICMS(e.target.value)}
                  className={`${inputNarrow} w-full`}
                >
                  {simNaoOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </section>

            <div className="h-px bg-border-dark/60" />

            {/* Estado */}
            <section className="grid gap-4">
              <h2 className={sectionTitle}>Estado de expedição</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-secondary text-sm mb-1">Estado</label>
                  <select
                    value={estadoUF}
                    onChange={(e) => setEstadoUF(e.target.value)}
                    className={`${inputNarrow} w-full`}
                  >
                    {estadosBrasil.map((uf) => (
                      <option key={uf}>{uf}</option>
                    ))}
                  </select>
                </div>

                {[
                  { label: "ICMS produtos nacionais (mesmo estado)", value: 6 },
                  { label: "ICMS produtos importados (mesmo estado)", value: 14 },
                  { label: "ICMS produtos nacionais (outro estado)", value: 1.3 },
                  { label: "ICMS produtos importados (outro estado)", value: 1.3 },
                ].map((item) => (
                  <div key={item.label}>
                    <label className="block text-text-secondary text-sm mb-1">
                      {item.label}
                    </label>
                    <input
                      type="number"
                      defaultValue={item.value}
                      className={`${inputNarrow} w-full`}
                    />
                  </div>
                ))}
              </div>
            </section>

            <div className="h-px bg-border-dark/60" />

            {/* Custos fixos */}
            <section className="grid gap-3">
              <h2 className={sectionTitle}>Custos fixos mensais</h2>
              <p className="text-sm text-text-secondary">
                Se preferir, insira os custos fixos da empresa.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  value={custoFixo}
                  onChange={(e) => {
                    const formatted = formatCurrencyBR(e.target.value);
                    setCustoFixo(formatted);
                  }}
                  className={`${inputNarrow} `}
                />

                <button className="
                  bg-[var(--color-primary)]
                  hover:bg-[var(--color-primary-dark)]
                  text-white text-sm px-4 py-2 rounded-md
                  transition-colors
                  w-full sm:w-auto
                ">
                  Editar
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

    </div>
  );
}
