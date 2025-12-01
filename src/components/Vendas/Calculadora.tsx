"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { CalculadoraMargemProps } from "./lib/types";
import { formatBRL } from "./lib/utils";

export default function CalculadoraMargem({ product }: CalculadoraMargemProps) {
  const [preco, setPreco] = useState(0);
  const [margem, setMargem] = useState(0);
  const [custoMercadoria, setCustoMercadoria] = useState(0);
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

  useEffect(() => {
    if (product) {
      setPreco(product.price || 0);
      setCustoMercadoria(product.cost || 0);
      setMargem(product.margin || 0);
      setTaxaFrete(product.shipping || 0);
      setComissao(product.marketplaceFee || 14);
      setOutrosCustos(product.coverage || 0);
    }
  }, [product]);

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

  const inputBase =
    "no-spinner w-full h-10 px-3 rounded-md border border-border-dark bg-background text-text focus:ring-2 focus:ring-primary focus:outline-none";

  return (
    <div className="bg-card rounded-lg shadow-md p-6 border border-border-dark">
      <h2 className="text-xl font-bold mb-6 text-primary">
        Simulador de Preços
      </h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Preço
          </label>
          <input
            type="number"
            value={preco}
            onChange={(e) => setPreco(parseFloat(e.target.value) || 0)}
            className={`${inputBase} text-lg font-semibold`}
            placeholder="R$ 0,00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Margem desejada (%)
          </label>
          <input
            type="number"
            value={margem}
            onChange={(e) => setMargem(parseFloat(e.target.value) || 0)}
            className={`${inputBase} text-lg font-semibold`}
            placeholder="0%"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            Custo da mercadoria
          </label>
          <input
            type="number"
            value={custoMercadoria}
            onChange={(e) =>
              setCustoMercadoria(parseFloat(e.target.value) || 0)
            }
            className={inputBase}
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            Taxa de frete
          </label>
          <input
            type="number"
            value={taxaFrete}
            onChange={(e) => setTaxaFrete(parseFloat(e.target.value) || 0)}
            className={inputBase}
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            Receita de frete
          </label>
          <input
            type="number"
            value={receitaFrete}
            onChange={(e) => setReceitaFrete(parseFloat(e.target.value) || 0)}
            className={inputBase}
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            Custo de envio
          </label>
          <input
            type="number"
            value={custoEnvio}
            onChange={(e) => setCustoEnvio(parseFloat(e.target.value) || 0)}
            className={inputBase}
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            Desconto
          </label>
          <input
            type="number"
            value={desconto}
            onChange={(e) => setDesconto(parseFloat(e.target.value) || 0)}
            className={inputBase}
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            Subsídio de desconto
          </label>
          <input
            type="number"
            value={subsidio}
            onChange={(e) => setSubsidio(parseFloat(e.target.value) || 0)}
            className={inputBase}
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            % de imposto efetivo
          </label>
          <input
            type="number"
            value={imposto}
            onChange={(e) => setImposto(parseFloat(e.target.value) || 0)}
            className={inputBase}
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            % de comissão
          </label>
          <input
            type="number"
            value={comissao}
            onChange={(e) => setComissao(parseFloat(e.target.value) || 0)}
            className={inputBase}
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            % taxa de venda
          </label>
          <input
            type="number"
            value={taxaVenda}
            onChange={(e) => setTaxaVenda(parseFloat(e.target.value) || 0)}
            className={inputBase}
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            % outros custos
          </label>
          <input
            type="number"
            value={outrosCustos}
            onChange={(e) => setOutrosCustos(parseFloat(e.target.value) || 0)}
            className={inputBase}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            checked={ignorarReceitaFrete}
            onChange={(e) => setIgnorarReceitaFrete(e.target.checked)}
          />
          Desconsiderar receita de frete no cálculo da margem percentual
        </label>
      </div>

      <div className="bg-background p-4 rounded-md border border-border-dark">
        <p className="text-sm text-text-secondary mb-1">
          Margem de contribuição nominal estimada:
        </p>
        <p
          className={`text-3xl font-bold ${
            margemFinal >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {formatBRL(margemFinal)}
        </p>
      </div>
    </div>
  );
}
