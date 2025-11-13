"use client";

import React from "react";
import Image from "next/image";
import { VendasModalProps } from "@/lib/types";
import Modal from "../ui/Modal";

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
      <div className="space-y-6">
        <div className="bg-background p-4 rounded-lg border border-border-dark">
          <h3 className="text-lg font-semibold mb-4">Identificadores</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-text-secondary">ERP ID</p>
              <p className="font-medium">{sale.erpId ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Origin ERP</p>
              <p className="font-medium">{sale.originERP ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">E-commerce</p>
              <p className="font-medium">{sale.ecommerce ?? "—"}</p>
            </div>
          </div>
        </div>

        <div className="bg-background p-4 rounded-lg border border-border-dark">
          <h3 className="text-lg font-semibold mb-4">
            Resumo Financeiro e Taxas
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Valor Nota</p>
              <p className="font-medium">
                {formatBRL(sale.financials?.valor_nota)}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Valor Produtos</p>
              <p className="font-medium">
                {formatBRL(sale.financials?.valor_produtos)}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Valor Frete</p>
              <p className="font-medium">
                {formatBRL(sale.financials?.valor_frete)}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-text-secondary">ICMS</p>
              <p className="font-medium">
                {formatBRL(sale.financials?.valor_icms)}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">IPI</p>
              <p className="font-medium">
                {formatBRL(sale.financials?.valor_ipi)}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">ISSQN</p>
              <p className="font-medium">
                {formatBRL(sale.financials?.valor_issqn)}
              </p>
            </div>
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
              <p className="text-sm text-text-secondary">Frete por conta</p>
              <p className="font-medium">
                {sale.financials?.fretePorConta ?? "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background p-4 rounded-lg border border-border-dark">
          <h3 className="text-lg font-semibold mb-4">Produtos</h3>

          {sale.items?.length ? (
            <div className="space-y-4">
              {sale.items.map((item, idx) => {
                const total = item.totalPrice ?? 0;
                const custo = item.totalCost ?? 0;
                const lucro = total - custo;
                const margem = total > 0 ? (lucro / total) * 100 : 0;

                return (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 bg-card rounded-lg border border-border-dark"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="rounded-md object-cover border border-border-dark"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-background rounded-md flex items-center justify-center border border-border-dark text-xs text-text-secondary">
                        Sem imagem
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-text-secondary">
                            SKU: {item.sku ?? "—"}
                          </p>
                          <p className="text-sm text-text-secondary">
                            Quantidade: {item.quantity ?? 1}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-text-secondary">
                            Total Vendido
                          </p>
                          <p className="font-medium">
                            {formatBRL(item.totalPrice)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div>
                          <p className="text-sm text-text-secondary">
                            Preço Unitário
                          </p>
                          <p className="font-medium">
                            {formatBRL(item.unitPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-text-secondary">
                            Custo Total
                          </p>
                          <p className="font-medium">
                            {formatBRL(item.totalCost)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-text-secondary">Margem</p>
                          <p
                            className={`font-medium ${
                              margem >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {margem.toFixed(2)}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 text-right">
                        <p className="text-sm text-text-secondary">
                          Lucro Bruto
                        </p>
                        <p
                          className={`font-medium ${
                            lucro >= 0 ? "text-green-600" : "text-red-600"
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
            <p className="text-sm text-text-secondary">Nenhum produto.</p>
          )}
        </div>
      </div>
    </Modal>
  );
};
