"use client";

import { useMemo, useState } from "react";
import UiSelect from "@/components/ui/UiSelect";

export default function ConfigBasica() {
  const [regime, setRegime] = useState("");
  const [possuiRegimeEspecial, setPossuiRegimeEspecial] = useState("Sim");
  const [aplicaVendas, setAplicaVendas] = useState("Ambos");
  const [zeraICMS, setZeraICMS] = useState("Sim");

  // campos por regime
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

  // opções
  const regimeOptions = useMemo(
    () => ["Lucro real", "Lucro presumido", "Simples", "MEI"],
    []
  );
  const simNaoOptions = useMemo(() => ["Sim", "Não"], []);
  const aplicaOptions = useMemo(
    () => ["Ambos", "Não contribuintes", "Contribuintes"],
    []
  );

  // estilos reutilizáveis
  const inputCls =
    "w-full h-10 rounded-md border border-border-dark bg-card-light/40 px-3 text-sm " +
    "placeholder:text-text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
  const sectionTitle = "text-base font-semibold text-text";

  return (
    <div className="-mt-9 min-h-[calc(100vh-64px)] p-6">
      <div className="mx-auto max-w-6xl">
        {/* Cabeçalho da página */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-text">
            Configurações básicas
          </h1>
          <p className="text-sm text-text-secondary">
            Ajuste regras fiscais e custos da empresa.
          </p>
        </div>

        {/* Card principal */}
        <div className="rounded-xl border border-border-dark bg-card shadow-sm">
          <div className="p-6 grid gap-8">
            {/* Regime */}
            <section className="grid gap-3">
              <h2 className={sectionTitle}>Regime tributário</h2>

              <UiSelect
                value={regime}
                onChange={setRegime}
                options={regimeOptions}
                placeholder="Selecionar"
              />

              {regime && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  {campos.map((item) => (
                    <div key={item.label}>
                      <label className="text-text-secondary text-sm mb-1 block">
                        {item.label}
                      </label>

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
                          className={inputCls}
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
              <label className="flex items-center gap-2 text-sm text-text">
                <input type="checkbox" className="accent-primary" />
                Os custos de mercadoria em seu ERP contêm PIS, COFINS e ICMS?
              </label>
              <label className="flex items-center gap-2 text-sm text-text">
                <input type="checkbox" className="accent-primary" />
                Desconsiderar receita de frete no cálculo da margem percentual
              </label>
            </section>

            <div className="h-px bg-border-dark/60" />

            {/* Patrimônio */}
            <section className="grid gap-2">
              <label className="text-sm font-medium text-text">
                Patrimônio Líquido
              </label>
              <input type="number" defaultValue={0} className={inputCls} />
            </section>

            {/* Regime especial */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-text mb-1 block">
                  Possui regime especial?
                </label>
                <UiSelect
                  value={possuiRegimeEspecial}
                  onChange={setPossuiRegimeEspecial}
                  options={simNaoOptions}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text mb-1 block">
                  Aplica-se a vendas para:
                </label>
                <UiSelect
                  value={aplicaVendas}
                  onChange={setAplicaVendas}
                  options={aplicaOptions}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text mb-1 block leading-tight">
                  Zerar crédito de ICMS no Regime especial
                </label>
                <UiSelect
                  value={zeraICMS}
                  onChange={setZeraICMS}
                  options={simNaoOptions}
                />
              </div>
            </section>

            <div className="h-px bg-border-dark/60" />

            {/* Estado */}
            <section className="grid gap-4">
              <h2 className={sectionTitle}>Estado de expedição</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Estado", value: "MG" },
                  {
                    label: "ICMS produtos nacionais (mesmo estado)",
                    value: 6,
                  },
                  {
                    label: "ICMS produtos importados (mesmo estado)",
                    value: 14,
                  },
                  {
                    label: "ICMS produtos nacionais (outro estado)",
                    value: 1.3,
                  },
                  {
                    label: "ICMS produtos importados (outro estado)",
                    value: 1.3,
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <label className="block text-text-secondary text-sm mb-1">
                      {item.label}
                    </label>
                    <input
                      type="text"
                      defaultValue={item.value}
                      className={inputCls}
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
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  defaultValue={226261.8}
                  className={inputCls}
                />
                <button className="bg-primary hover:bg-primary-dark text-white text-sm px-4 py-2 rounded-md">
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
