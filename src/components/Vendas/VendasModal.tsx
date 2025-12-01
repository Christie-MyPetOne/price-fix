"use client";

import React, { useState } from "react";
import Image from "next/image";
import { VendasModalProps } from "@/lib/types";
import Modal from "../ui/Modal";
import { Package, FileText, Info, Percent, ChevronDown } from "lucide-react";

const CollapsibleSection: React.FC<{
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}> = ({ title, icon: Icon, isOpen, setIsOpen, children }) => {
  return (
    <div className="rounded-xl border border-border-dark bg-background/60 backdrop-blur-sm shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center"
      >
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-primary" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <ChevronDown
          size={20}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-border-dark">{children}</div>
      )}
    </div>
  );
};

export const VendasModal: React.FC<VendasModalProps> = ({
  open,
  onClose,
  sale,
}) => {
  const [isFinancialsOpen, setIsFinancialsOpen] = useState(true);
  const [isProductsOpen, setIsProductsOpen] = useState(true);

  if (!sale) return null;

  const formatBRL = (value?: number) =>
    (value ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const financialDetails = [
    { label: "Valor da Nota", value: formatBRL(sale.financials?.valor_nota) },
    {
      label: "Valor Faturado",
      value: formatBRL(sale.financials?.valor_faturado),
    },
    { label: "Produtos", value: formatBRL(sale.financials?.valor_produtos) },
    { label: "Serviços", value: formatBRL(sale.financials?.valor_servicos) },
    { label: "Frete", value: formatBRL(sale.financials?.valor_frete) },
    { label: "Seguro", value: formatBRL(sale.financials?.valor_seguro) },
    { label: "Outras Desp.", value: formatBRL(sale.financials?.valor_outras) },
    { label: "Desconto", value: formatBRL(sale.financials?.valor_desconto) },
    { label: "Base ICMS", value: formatBRL(sale.financials?.base_icms) },
    { label: "Valor ICMS", value: formatBRL(sale.financials?.valor_icms) },
    { label: "Base ICMS ST", value: formatBRL(sale.financials?.base_icms_st) },
    {
      label: "Valor ICMS ST",
      value: formatBRL(sale.financials?.valor_icms_st),
    },
    { label: "Valor IPI", value: formatBRL(sale.financials?.valor_ipi) },
    { label: "Valor ISSQN", value: formatBRL(sale.financials?.valor_issqn) },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Detalhes do Pedido ${sale.id ?? ""}`}
      size="xl"
    >
      <div className="flex flex-col gap-4">
        {/* Identificadores */}
        <div className="rounded-xl border border-border-dark bg-background/60 backdrop-blur-sm shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Info size={18} className="text-primary" />
            <h3 className="text-lg font-semibold">Identificadores</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { label: "ERP ID", value: sale.erpId },
              { label: "Origin ERP", value: sale.originERP },
              { label: "E-commerce", value: sale.ecommerce },
            ].map((item, idx) => (
              <div key={idx}>
                <p className="text-xs text-text-secondary uppercase tracking-wide">
                  {item.label}
                </p>
                <p className="font-medium text-text mt-1">
                  {item.value ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo Financeiro */}
        <CollapsibleSection
          title="Resumo Financeiro e Impostos"
          icon={FileText}
          isOpen={isFinancialsOpen}
          setIsOpen={setIsFinancialsOpen}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
            {financialDetails.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-card border border-border-dark/50"
              >
                <p className="text-xs text-text-secondary">{item.label}</p>
                <p className="font-semibold text-sm mt-1">{item.value}</p>
              </div>
            ))}
            <div className="p-3 rounded-lg bg-card border border-border-dark/50">
              <p className="text-xs text-text-secondary">Frete por Conta</p>
              <p className="font-semibold text-sm mt-1">
                {sale.financials?.fretePorConta ?? "—"}
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* Produtos */}
        <CollapsibleSection
          title="Produtos"
          icon={Package}
          isOpen={isProductsOpen}
          setIsOpen={setIsProductsOpen}
        >
          {sale.items?.length ? (
            <div className="space-y-4 pt-4">
              {sale.items.map((item, idx) => {
                const total = item.totalPrice ?? 0;
                const custo = item.totalCost ?? 0;
                const lucro = total - custo;
                const margem = total > 0 ? (lucro / total) * 100 : 0;

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-card/70 border border-border-dark flex flex-col sm:flex-row gap-4"
                  >
                    <div className="flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="rounded-lg object-cover border border-border-dark shadow-sm"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-background border border-border-dark rounded-lg flex items-center justify-center text-xs text-text-secondary">
                          Sem imagem
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div>
                        <p className="font-semibold text-base">{item.name}</p>
                        <p className="text-xs text-text-secondary mt-1">
                          SKU: {item.sku ?? "—"} | Qtd: {item.quantity}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-center">
                        <div>
                          <p className="text-xs text-text-secondary">Total</p>
                          <p className="font-medium text-sm">
                            {formatBRL(item.totalPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary">Custo</p>
                          <p className="font-medium text-sm">
                            {formatBRL(item.totalCost)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary">Lucro</p>
                          <p
                            className={`font-medium text-sm ${
                              lucro >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {formatBRL(lucro)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary">Margem</p>
                          <p
                            className={`font-medium text-sm ${
                              margem >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {margem.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="pt-4 text-sm text-text-secondary">
              Nenhum produto cadastrado.
            </p>
          )}
        </CollapsibleSection>
      </div>
    </Modal>
  );
};
