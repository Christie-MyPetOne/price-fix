"use client";

import React, { useState } from "react";

interface CalculadoraMargemProps {
  initialPreco?: number;
  initialCusto?: number;
  initialMargem?: number;
}

export default function CalculadoraMargem({
  initialPreco = 0,
  initialCusto = 0,
  initialMargem = 0,
}: CalculadoraMargemProps) {
  const [preco, setPreco] = useState(initialPreco);
  const [margem, setMargem] = useState(initialMargem);
  const [custoMercadoria, setCustoMercadoria] = useState(initialCusto);
  const [taxaFrete, setTaxaFrete] = useState(0);
  const [receitaFrete, setReceitaFrete] = useState(0);
  const [custoEnvio, setCustoEnvio] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [subsidio, setSubsidio] = useState(0);
  const [imposto, setImposto] = useState(0.23);
  const [comissao, setComissao] = useState(14);
  const [taxaVenda, setTaxaVenda] = useState(0);
  const [outrosCustos, setOutrosCustos] = useState(0);
  const [ignorarReceitaFrete, setIgnorarReceitaFrete] = useState(false);

  // cálculo simples da margem
  const receitaTotal = preco + (ignorarReceitaFrete ? 0 : receitaFrete);
  const custosTotais =
    custoMercadoria +
    taxaFrete +
    custoEnvio +
    desconto -
    subsidio +
    (preco * imposto) / 100 +
    (preco * comissao) / 100 +
    (preco * taxaVenda) / 100 +
    (preco * outrosCustos) / 100;

  const margemFinal = receitaTotal - custosTotais;

  return (
    <div className="bg-card rounded-lg shadow-md p-4 border border-border-dark">
      <h2 className="text-lg font-semibold mb-4">Simulador de preços</h2>

      {/* Preço e Margem desejada */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1">Preço</label>
          <input
            type="number"
            value={preco}
            onChange={(e) => setPreco(parseFloat(e.target.value))}
            className="w-full h-10 px-3 rounded-md border border-border-dark bg-background text-text"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">Margem desejada (%)</label>
          <input
            type="number"
            value={margem}
            onChange={(e) => setMargem(parseFloat(e.target.value))}
            className="w-full h-10 px-3 rounded-md border border-border-dark bg-background text-text"
          />
        </div>
      </div>

      {/* Custos e taxas */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1">Custo da mercadoria</label>
          <input
            type="number"
            value={custoMercadoria}
            onChange={(e) => setCustoMercadoria(parseFloat(e.target.value))}
            className="w-full h-10 px-3 rounded-md border border-border-dark bg-background text-text"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">Taxa de frete</label>
          <input
            type="number"
            value={taxaFrete}
            onChange={(e) => setTaxaFrete(parseFloat(e.target.value))}
            className="w-full h-10 px-3 rounded-md border border-border-dark bg-background text-text"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">Receita de frete</label>
          <input
            type="number"
            value={receitaFrete}
            onChange={(e) => setReceitaFrete(parseFloat(e.target.value))}
            className="w-full h-10 px-3 rounded-md border border-border-dark bg-background text-text"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">Custo de envio</label>
          <input
            type="number"
            value={custoEnvio}
            onChange={(e) => setCustoEnvio(parseFloat(e.target.value))}
            className="w-full h-10 px-3 rounded-md border border-border-dark bg-background text-text"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">Desconto</label>
          <input
            type="number"
            value={desconto}
            onChange={(e) => setDesconto(parseFloat(e.target.value))}
            className="w-full h-10 px-3 rounded-md border border-border-dark bg-background text-text"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">Subsídio de desconto</label>
          <input
            type="number"
            value={subsidio}
            onChange={(e) => setSubsidio(parseFloat(e.target.value))}
            className="w-full h-10 px-3 rounded-md border border-border-dark bg-background text-text"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">% de imposto efetivo</label>
          <input
            type="number"
            value={imposto}
            onChange={(e) => setImposto(parseFloat(e.target.value))}
            className="w-full h-10 px-3 rounded-md border border-border-dark bg-background text-text"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">% de comissão</label>
          <input
            type="number"
            value={comissao}
            onChange={(e) => setComissao(parseFloat(e.target.value))}
            className="w-full h-10 px-3 rounded-md border border-border-dark bg-background text-text"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">% taxa de venda</label>
          <input
            type="number"
            value={taxaVenda}
            onChange={(e) => setTaxaVenda(parseFloat(e.target.value))}
            className="w-full h-10 px-3 rounded-md border border-border-dark bg-background text-text"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">% outros custos</label>
          <input
            type="number"
            value={outrosCustos}
            onChange={(e) => setOutrosCustos(parseFloat(e.target.value))}
            className="w-full h-10 px-3 rounded-md border border-border-dark bg-background text-text"
          />
        </div>
      </div>

      {/* Opção ignorar receita frete */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            checked={ignorarReceitaFrete}
            onChange={(e) => setIgnorarReceitaFrete(e.target.checked)}
          />
          Desconsiderar receita de frete no cálculo da margem percentual
        </label>
      </div>

      {/* Resultado */}
      <div className="bg-background p-3 rounded-md border border-border-dark">
        <p className="text-sm text-text-secondary">Margem de contribuição nominal estimada:</p>
        <p className="text-2xl font-bold text-primary">
          {margemFinal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>
    </div>
  );
}
