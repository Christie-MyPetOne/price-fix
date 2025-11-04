"use client";

import React, { useState } from "react";
import { X, Trash2, ImageIcon, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { CartItem } from "@/lib/types";

interface ShoppingCartModalProps {
  open: boolean;
  cartItems: CartItem[];
  onRemove: (id: string) => void;
  onClose: () => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void; // ✅ ADICIONE ESTA LINHA
}

export const ShoppingCartModal: React.FC<ShoppingCartModalProps> = ({
  open,
  cartItems,
  onRemove,
  onClose,
  onUpdateQuantity,
}) => {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  if (!open) return null;

  const totalCost = cartItems.reduce((sum, p) => sum + (p.cost || 0), 0);
  const totalRevenue = cartItems.reduce(
    (sum, p) => sum + (p.estimatedRevenue || 0),
    0
  );
  const totalProfit = cartItems.reduce(
    (sum, p) => sum + (p.estimatedProfit || 0),
    0
  );
  const totalQuantity = cartItems.reduce(
    (sum, p) => sum + (p.quantity || 0),
    0
  );
  const totalItemTypes = cartItems.length;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    onUpdateQuantity(itemId, newQuantity);
  };

  const toggleItemDetails = (itemId: string) => {
    setExpandedItemId((prev) => (prev === itemId ? null : itemId));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-card text-text rounded-lg shadow-xl w-full max-w-3xl relative flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:bg-background p-1 rounded-full z-10"
        >
          <X size={20} />
        </button>

        {/* Cabeçalho */}
        <div className="flex-shrink-0 p-6 border-b border-border-dark">
          <h2 className="text-xl font-semibold mb-2">Lista de compras</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
            <span>
              <strong>Custo total:</strong>{" "}
              {totalCost.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
            <span>
              <strong>Receita est.:</strong>{" "}
              {totalRevenue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
            <span>
              <strong>Lucro est.:</strong>{" "}
              {totalProfit.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
            <span className="ml-auto">
              <strong>{totalItemTypes}</strong> itens
            </span>
            <span>
              <strong>{totalQuantity}</strong> un
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-sm text-text-secondary">
              Nenhum produto adicionado à lista.
            </p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-border-dark rounded-lg overflow-hidden shadow-sm"
                >
                  {/* Cabeçalho do fornecedor */}
                  <div className="bg-background p-3 border-b border-border-dark">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-text">
                        {item.supplier}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-text-secondary hover:text-error"
                          title="Remover item"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={() => toggleItemDetails(item.id)}
                          className="text-text-secondary hover:text-primary transition"
                          title="Ver mais detalhes"
                        >
                          {expandedItemId === item.id ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary mt-1">
                      <span>
                        Investimento:{" "}
                        {item.cost.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      <span>
                        Receita est.:{" "}
                        {item.estimatedRevenue.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      <span>
                        Lucro est.:{" "}
                        {item.estimatedProfit.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Detalhes expandíveis */}
                  {expandedItemId === item.id && (
                    <div className="p-3 flex gap-3 items-start">
                      {item.image ? (
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="object-contain rounded border border-border-dark"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-background rounded flex items-center justify-center text-text-secondary">
                          <ImageIcon size={24} />
                        </div>
                      )}

                      <div className="flex flex-col flex-grow text-xs text-text-secondary">
                        <p className="font-semibold text-sm text-text">
                          {item.name}
                        </p>
                        <p>{item.description}</p>
                        <p className="uppercase mt-1">SKU: {item.sku}</p>

                        <div className="grid grid-cols-2 gap-y-1 gap-x-4 mt-2">
                          <span>
                            <strong>Investimento:</strong>{" "}
                            {item.cost.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                          <span>
                            <strong>Receita est.:</strong>{" "}
                            {item.estimatedRevenue.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                          <span>
                            <strong>Lucro est.:</strong>{" "}
                            {item.estimatedProfit.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                          <span>
                            <strong>Cobertura:</strong>{" "}
                            {item.coverage?.toFixed(2) || "N/A"} dias
                          </span>
                        </div>

                        {/* Campo de quantidade */}
                        <div className="mt-3">
                          <label className="text-xs text-text-secondary">
                            Pedido {""}
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              handleQuantityChange(
                                item.id,
                                isNaN(val) || val < 1 ? 1 : val
                              );
                            }}
                            className="w-20 mt-1 p-1 text-sm border border-border-dark rounded"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Rodapé */}
        <div className="border-t border-border-dark p-4 flex-shrink-0 flex justify-end">
          <button className="px-4 py-2 rounded-md bg-primary hover:bg-primary-dark transition-colors text-white font-semibold">
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
};
