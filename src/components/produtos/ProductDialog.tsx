"use client";

import React from "react";
import { Product } from "../../lib/types";
import { X } from "lucide-react";

// Props que o componente do modal espera receber
interface ProductDetailModalProps {
  product: Product | null; // O produto a ser exibido, ou null para não mostrar o modal
  onClose: () => void; // Função para fechar o modal
}

// Componente auxiliar para os campos de input (apenas para exibição)
const InfoField = ({
  label,
  value,
  unit,
  placeholder = "N/A",
}: {
  label: string;
  value: string | number | undefined;
  unit?: "R$" | "%" | "dias";
  placeholder?: string;
}) => (
  <div>
    <label className="block text-xs font-medium text-text-secondary mb-1">
      {label}
    </label>
    <div className="relative">
      {unit && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-text-secondary">
          {unit}
        </span>
      )}
      <input
        type="text"
        readOnly
        value={value ?? ""}
        placeholder={placeholder}
        className={`w-full p-2 border border-border-dark rounded-md bg-background text-text text-sm ${
          unit ? "pl-10" : ""
        }`}
      />
    </div>
  </div>
);

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  // Se não houver produto selecionado, não renderiza nada
  if (!product) {
    return null;
  }

  return (
    // Overlay de fundo
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose} // Fecha o modal ao clicar fora
    >
      {/* Conteúdo do Modal */}
      <div
        className="bg-card text-text rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()} // Impede que o clique no modal o feche
      >
        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center p-4 border-b border-border-dark">
          <h2 className="text-xl font-bold">Detalhes do Produto</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-background"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Modal (com scroll) */}
        <div className="flex-grow overflow-y-auto p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Seção Principal de Dados */}
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coluna 1: Dados Básicos */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border-dark pb-2">
                  Dados básicos
                </h3>
                <InfoField label="Nome do produto" value={product.name} />
                <InfoField label="Código do produto" value={product.id} />
                <InfoField
                  label="Unidades vendidas no mês"
                  value={product.sales}
                />
                <InfoField label="Linha de produto" value={product.line} />
                <InfoField label="Origem" value={product.origin} />
                <InfoField
                  label="Canal de Venda"
                  value={product.salesChannel}
                />
              </div>

              {/* Coluna 2: Informações Financeiras */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border-dark pb-2">
                  Informações Financeiras
                </h3>
                <InfoField label="Preço" value={product.price} unit="R$" />
                <InfoField label="Margem" value={product.margin} unit="%" />
                <InfoField
                  label="Lucro Total"
                  value={product.totalProfit}
                  unit="R$"
                />
                <InfoField
                  label="Capital de Giro"
                  value={product.workingCapital}
                  unit="R$"
                />
              </div>
            </div>

            {/* Sidebar de Resumo (Direita) */}
            <div className="lg:w-64 flex-shrink-0 bg-background p-4 rounded-md space-y-3">
              <div className="text-center pb-2 border-b border-border-dark">
                <p className="text-sm text-text-secondary">Margem calculada</p>
                <p className="text-2xl font-bold text-primary">
                  {product.margin.toFixed(2)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-text-secondary">
                  Preço de venda sugerido
                </p>
                <p className="text-2xl font-bold text-primary">
                  {product.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-text-secondary">
                  Capital de giro unitário
                </p>
                <p
                  className={`text-lg font-bold ${
                    product.workingCapital < 0 ? "text-error" : "text-primary"
                  }`}
                >
                  {product.workingCapital.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>

              {/* Detalhamento de custos e impostos */}
              <div className="text-sm space-y-1 pt-3">
                <h4 className="font-semibold mb-2">Resumo</h4>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Preço de venda</span>
                  <span>
                    {product.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-border-dark mt-2">
                  <span className="text-text-secondary">Lucro Total</span>
                  <span>
                    {product.totalProfit.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé do Modal com Ações */}
        <div className="flex justify-end items-center p-4 border-t border-border-dark gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-background hover:bg-opacity-80 transition-colors text-text-secondary"
          >
            FECHAR
          </button>
          <button className="px-4 py-2 rounded-md bg-primary hover:bg-primary-dark transition-colors text-white font-semibold">
            CALCULAR
          </button>
        </div>
      </div>
    </div>
  );
};
