"use client";

import React from "react";
import Image from "next/image";
import { Sale } from "@/lib/types";
import Modal from "../ui/Modal";

interface VendasModalProps {
  open: boolean;
  onClose: () => void;
  sale: Sale | null;
}

export const VendasModal: React.FC<VendasModalProps> = ({ open, onClose, sale }) => {
  if (!sale) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={sale ? `Detalhes do Pedido ${sale.id}` : "Detalhes do Pedido"}
      size="xl"
    >
      <div className="space-y-6">
        <div className="bg-background p-4 rounded-lg">
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
              <p className="text-sm text-text-secondary">Ecommerce ID</p>
              <p className="font-medium">{sale.ecommerceId ?? "—"}</p>
            </div>
          </div>
        </div>

        <div className="bg-background p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Resumo Financeiro e Taxas</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Receita (valor nota)</p>
              <p className="font-medium">{sale.financials.valor_nota?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Receita produtos</p>
              <p className="font-medium">{sale.financials.valor_produtos?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Valor frete</p>
              <p className="font-medium">{sale.financials.valor_frete?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Valor IPI</p>
              <p className="font-medium">{sale.financials.valor_ipi?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Valor ICMS</p>
              <p className="font-medium">{sale.financials.valor_icms?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Valor ICMS ST</p>
              <p className="font-medium">{sale.financials.valor_icms_st?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Valor Serviços</p>
              <p className="font-medium">{sale.financials.valor_servicos?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Valor ISSQN</p>
              <p className="font-medium">{sale.financials.valor_issqn?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Outras</p>
              <p className="font-medium">{sale.financials.valor_outras?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Valor faturado</p>
              <p className="font-medium">{sale.financials.valor_faturado?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Frete por conta</p>
              <p className="font-medium">{sale.financials.fretePorConta ?? "—"}</p>
            </div>
          </div>
        </div>

        <div className="bg-background p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Produtos</h3>
          <div className="space-y-4">
            {sale.items.map((item, idx) => {
              const taxaItem = (item.totalPrice ?? 0) * 0.16;
              const impostosItem = (item.totalPrice ?? 0) * 0.12;
              const custoItem = (item.totalPrice ?? 0) * 0.6; // estimativa
              const lucroItem = (item.totalPrice ?? 0) - (taxaItem + impostosItem + custoItem);
              return (
                <div key={idx} className="flex gap-4 p-4 bg-card rounded-lg">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md object-cover border border-border-dark" />
                  ) : (
                    <div className="w-20 h-20 bg-background rounded-md flex items-center justify-center border border-border-dark">Sem imagem</div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-text-secondary">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-text-secondary">Total</p>
                        <p className="font-medium">{(item.totalPrice ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-text-secondary">Taxa</p>
                        <p className="font-medium text-red-500">{taxaItem.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">Impostos</p>
                        <p className="font-medium text-red-500">{impostosItem.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">Custo estimado</p>
                        <p className="font-medium">{custoItem.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                      </div>
                    </div>

                    <div className="mt-3 text-right">
                      <p className="text-sm text-text-secondary">Lucro estimado</p>
                      <p className="font-medium text-green-600">{lucroItem.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};