"use client";

import React from "react";
import Image from "next/image";
import { VendasModalProps } from "@/lib/types";
import Modal from "../ui/Modal";
import { Package, FileText, Info, Percent } from "lucide-react";

export const VendasModal: React.FC<VendasModalProps> = ({
  open,
  onClose,
  sale,
}) => {
  if (!sale) return null;

  const formatBRL = (value?: number) =>
    (value ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Detalhes do Pedido ${sale.id ?? ""}`}
      size="xl"
    >
      <div className="space-y-8 pb-4">
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

        <div className="rounded-xl border border-border-dark bg-background/60 backdrop-blur-sm shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-primary" />
            <h3 className="text-lg font-semibold">Resumo Financeiro e Taxas</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {[
              { label: "Valor Nota", value: sale.financials?.valor_nota },
              { label: "Produtos", value: sale.financials?.valor_produtos },
              { label: "Frete", value: sale.financials?.valor_frete },
              { label: "ICMS", value: sale.financials?.valor_icms },
              { label: "IPI", value: sale.financials?.valor_ipi },
              { label: "ISSQN", value: sale.financials?.valor_issqn },
            ].map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-card border border-border-dark shadow-sm hover:shadow-md transition"
              >
                <p className="text-xs text-text-secondary">{item.label}</p>
                <p className="font-semibold text-sm mt-1">
                  {formatBRL(item.value)}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Outras</p>
              <p className="font-medium">
                {formatBRL(sale.financials?.valor_outras)}
              </p>
            </div>

            <div>
              <p className="text-sm text-text-secondary">Valor Faturado</p>
              <p className="font-medium">
                {formatBRL(sale.financials?.valor_faturado)}
              </p>
            </div>

            <div>
              <p className="text-sm text-text-secondary">Frete por Conta</p>
              <p className="font-medium">
                {sale.financials?.fretePorConta ?? "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border-dark bg-background/60 backdrop-blur-sm shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package size={18} className="text-primary" />
            <h3 className="text-lg font-semibold">Produtos</h3>
          </div>

          {sale.items?.length ? (
            <div className="space-y-5">
              {sale.items.map((item, idx) => {
                const total = item.totalPrice ?? 0;
                const custo = item.totalCost ?? 0;
                const lucro = total - custo;
                const margem = total > 0 ? (lucro / total) * 100 : 0;

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-card/70 border border-border-dark shadow hover:shadow-lg transition flex flex-col sm:flex-row gap-6"
                  >
                    <div>
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover border border-border-dark shadow-sm"
                        />
                      ) : (
                        <div className="w-28 h-28 bg-background border border-border-dark rounded-lg flex items-center justify-center text-xs text-text-secondary">
                          Sem imagem
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                        <div>
                          <p className="font-semibold text-lg">{item.name}</p>
                          <p className="text-sm text-text-secondary mt-1">
                            SKU: {item.sku ?? "—"}
                          </p>
                          <p className="text-sm text-text-secondary">
                            Quantidade: {item.quantity}
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <span className="text-xs text-text-secondary">
                            Total Vendido
                          </span>
                          <p className="text-base font-semibold">
                            {formatBRL(item.totalPrice)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
                        <div className="p-3 rounded-lg bg-background border border-border-dark">
                          <p className="text-xs text-text-secondary">
                            Preço Unitário
                          </p>
                          <p className="font-semibold">
                            {formatBRL(item.unitPrice)}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-background border border-border-dark">
                          <p className="text-xs text-text-secondary">
                            Custo Total
                          </p>
                          <p className="font-semibold">
                            {formatBRL(item.totalCost)}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-background border border-border-dark">
                          <p className="text-xs text-text-secondary flex items-center gap-1">
                            <Percent size={12} /> Margem
                          </p>
                          <p
                            className={`font-semibold ${
                              margem >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {margem.toFixed(2)}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-border-dark pt-4 text-right">
                        <span className="text-xs text-text-secondary">
                          Lucro Bruto
                        </span>
                        <p
                          className={`text-lg font-bold ${
                            lucro >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {formatBRL(lucro)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-text-secondary">
              Nenhum produto cadastrado.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
