"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, TrendingUp, History, Users } from "lucide-react";
import { Product, ProductDetailModalProps, type Tab } from "@/lib/types";
import { PerformanceChart } from "./RechartsSparkline";
import { TabButton } from "../ui/TabButton";
import { CalculationInputField } from "../ui/CalculationInputField";

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("calculator");
  const [editableProduct, setEditableProduct] = useState<Product | null>(
    product
  );
  const [price, setPrice] = useState(product?.price || 0);
  const [cost, setCost] = useState(product?.cost || 0);
  const [shipping, setShipping] = useState(15);
  const [marketplaceFee, setMarketplaceFee] = useState(16);
  const [targetMargin, setTargetMargin] = useState("");
  const [targetProfit, setTargetProfit] = useState("");

  useEffect(() => {
    if (product) {
      setEditableProduct(product);
      setPrice(product.price);
      setCost(product.cost || 0);
      setTargetMargin("");
      setTargetProfit("");
    }
  }, [product]);

  const { profit, margin } = useMemo(() => {
    const feeValue = price * (marketplaceFee / 100);
    const totalCosts = cost + shipping + feeValue;
    const calculatedProfit = price - totalCosts;
    const calculatedMargin = price > 0 ? (calculatedProfit / price) * 100 : 0;
    return { profit: calculatedProfit, margin: calculatedMargin };
  }, [price, cost, shipping, marketplaceFee]);

  const requiredPriceForMargin = useMemo(() => {
    const marginNum = parseFloat(targetMargin);
    if (isNaN(marginNum) || marginNum >= 100) return null;
    const feePercentage = marketplaceFee / 100;
    const requiredPrice =
      (cost + shipping) / (1 - feePercentage - marginNum / 100);
    return requiredPrice;
  }, [targetMargin, cost, shipping, marketplaceFee]);

  const salesNeededForProfit = useMemo(() => {
    const profitNum = parseFloat(targetProfit);
    if (isNaN(profitNum) || profit <= 0) return null;
    return Math.ceil(profitNum / profit);
  }, [targetProfit, profit]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card text-text rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-border-dark">
          <div>
            <h2 className="text-xl font-bold">
              {editableProduct?.name || product.name}
            </h2>
            <p className="text-xs text-text-secondary">SKU: {product.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-background"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center px-6 border-b border-border-dark">
          <TabButton
            label="Calculadora e Simulador"
            icon={TrendingUp}
            isActive={activeTab === "calculator"}
            onClick={() => setActiveTab("calculator")}
          />
          <TabButton
            label="Concorrência"
            icon={Users}
            isActive={activeTab === "competitors"}
            onClick={() => setActiveTab("competitors")}
          />
          <TabButton
            label="Histórico"
            icon={History}
            isActive={activeTab === "history"}
            onClick={() => setActiveTab("history")}
          />
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          {activeTab === "calculator" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Precificação</h3>
                <CalculationInputField
                  label="Preço de Venda"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  unit="R$"
                />
                <CalculationInputField
                  label="Custo do Produto"
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  unit="R$"
                />
                <CalculationInputField
                  label="Custo de Frete (Envio)"
                  value={shipping}
                  onChange={(e) => setShipping(Number(e.target.value))}
                  unit="R$"
                />
                <CalculationInputField
                  label="Taxa do Marketplace"
                  value={marketplaceFee}
                  onChange={(e) => setMarketplaceFee(Number(e.target.value))}
                  unit="%"
                />
              </div>

              <div className="space-y-4 bg-background p-4 rounded-md">
                <h3 className="font-semibold text-lg">Resultados</h3>
                <div className="text-center py-2">
                  <p className="text-sm text-text-secondary">Lucro por Venda</p>
                  <p
                    className={`text-3xl font-bold ${
                      profit < 0 ? "text-error" : "text-primary"
                    }`}
                  >
                    {profit.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
                <div className="text-center py-2 border-t border-border-dark">
                  <p className="text-sm text-text-secondary">Margem de Lucro</p>
                  <p
                    className={`text-3xl font-bold ${
                      margin < 0 ? "text-error" : "text-primary"
                    }`}
                  >
                    {margin.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Simulador de Metas</h3>
                <CalculationInputField
                  label="Para ter X% de margem..."
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(e.target.value)}
                  unit="%"
                  placeholder="Ex: 25"
                />
                {requiredPriceForMargin !== null && (
                  <div className="bg-primary-dark/20 p-3 rounded-md text-center">
                    <p className="text-xs text-primary">
                      Preço de venda sugerido:
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {requiredPriceForMargin.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                )}
                <CalculationInputField
                  label="Para lucrar R$ Y..."
                  value={targetProfit}
                  onChange={(e) => setTargetProfit(e.target.value)}
                  unit="R$"
                  placeholder="Ex: 500"
                />
                {salesNeededForProfit !== null && (
                  <div className="bg-primary-dark/20 p-3 rounded-md text-center">
                    <p className="text-xs text-primary">Vendas necessárias:</p>
                    <p className="text-lg font-bold text-primary">
                      {salesNeededForProfit} unidades
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "competitors" && (
            <div className="text-center bg-background p-8 rounded-md border border-dashed border-border-dark">
              <h3 className="font-semibold text-lg mb-2">
                Análise de Concorrência
              </h3>
              <p className="text-text-secondary">
                Funcionalidade em desenvolvimento. Em breve será possível
                comparar preços e margens automaticamente.
              </p>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Histórico de Performance
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-background p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2 text-text-secondary">
                    Vendas (últimos 7 dias)
                  </p>
                  <PerformanceChart
                    data={(product.salesHistory || []).map((value, index) => ({
                      name: `Dia ${index + 1}`,
                      value,
                    }))}
                    color="var(--color-info)"
                    yAxisLabel="Vendas"
                  />
                </div>
                <div className="bg-background p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2 text-text-secondary">
                    Lucro (últimos 7 dias)
                  </p>
                  <PerformanceChart
                    data={(product.profitHistory || []).map((value, index) => ({
                      name: `Dia ${index + 1}`,
                      value,
                    }))}
                    color="var(--color-primary)"
                    yAxisLabel="Lucro (R$)"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end items-center p-4 border-t border-border-dark gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-background hover:bg-opacity-80 transition-colors text-text-secondary"
          >
            FECHAR
          </button>
          <button className="px-4 py-2 rounded-md bg-primary hover:bg-primary-dark transition-colors text-white font-semibold">
            SALVAR ALTERAÇÕES
          </button>
        </div>
      </div>
    </div>
  );
};
