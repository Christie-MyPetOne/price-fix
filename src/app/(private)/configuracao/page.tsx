"use client";

import React, { useState } from "react";

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
            <select
              value={regime}
              onChange={(e) => setRegime(e.target.value)}
              className="mt-1 w-full border border-[var(--color-border-dark)] rounded-md h-10 px-3 text-sm bg-transparent"
            >
              <option value="" disabled>
                Selecionar
              </option>
              <option>Lucro real</option>
              <option>Lucro presumido</option>
              <option>Simples</option>
              <option>MEI</option>
            </select>
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
                    <select className="w-full border border-[var(--color-border-dark)] rounded-md h-10 px-2 text-sm bg-transparent">
                      <option>R$ 45,00</option>
                      <option>R$ 50,00</option>
                    </select>
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
              <select
                value={possuiRegimeEspecial}
                onChange={(e) => setPossuiRegimeEspecial(e.target.value)}
                className="w-full border border-[var(--color-border-dark)] rounded-md h-10 px-3 text-sm bg-transparent"
              >
                <option>Sim</option>
                <option>Não</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-[var(--color-text)] mb-1 block">
                Aplica-se a vendas para
              </label>
              <select
                value={aplicaVendas}
                onChange={(e) => setAplicaVendas(e.target.value)}
                className="w-full border border-[var(--color-border-dark)] rounded-md h-10 px-3 text-sm bg-transparent"
              >
                <option>Ambos</option>
                <option>Não contribuintes</option>
                <option>Contribuintes</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-[var(--color-text)] mb-1 block leading-tight">
                Desejo zerar crédito de ICMS quando a venda for considerada do Regime especial
              </label>
              <select
                value={zeraICMS}
                onChange={(e) => setZeraICMS(e.target.value)}
                className="w-full border border-[var(--color-border-dark)] rounded-md h-10 px-3 text-sm bg-transparent"
              >
                <option>Sim</option>
                <option>Não</option>
              </select>
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
