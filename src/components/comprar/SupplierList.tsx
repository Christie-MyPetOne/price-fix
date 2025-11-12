"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  Package,
  Edit2,
  Check,
  XCircle,
  ThumbsDown,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useProductsStore } from "@/store/useProductsStore";

interface SupplierListProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProductSelection {
  id: string;
  selected: boolean;
  quantity: number;
  editing: boolean;
  rejected?: boolean;
  rejectReason?: string;
}

export const SupplierList: React.FC<SupplierListProps> = ({
  isOpen,
  onClose,
}) => {
  const { products, fetchProducts } = useProductsStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [supplierStatus, setSupplierStatus] = useState<Record<string, string>>(
    {}
  );
  const [productSelections, setProductSelections] = useState<
    Record<string, ProductSelection>
  >({});
  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    productId: string | null;
  }>({ open: false, productId: null });
  const [rejectReasons, setRejectReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState("");

  const [editDeliveryModal, setEditDeliveryModal] = useState<{
    open: boolean;
    supplier: string | null;
    date: string;
  }>({ open: false, supplier: null, date: "" });

  useEffect(() => {
    if (isOpen && products.length === 0) {
      fetchProducts();
    }
  }, [isOpen, products.length, fetchProducts]);

  if (!isOpen) return null;

  // Agrupa produtos por fornecedor
  const suppliers = products.reduce<Record<string, typeof products>>(
    (acc, product) => {
      const supplierName = product.supplier ?? "Desconhecido";
      if (!acc[supplierName]) acc[supplierName] = [];
      acc[supplierName].push(product);
      return acc;
    },
    {}
  );

  // Pega os 3 principais fornecedores
  const topSuppliers = Object.entries(suppliers).slice(0, 3);

  // Filtra fornecedores visíveis: se houver expandido, mostra só ele
  const visibleSuppliers =
    expanded !== null
      ? topSuppliers.filter(([supplierName]) => supplierName === expanded)
      : topSuppliers;

  const toggleExpand = (supplier: string) => {
    setExpanded((prev) => (prev === supplier ? null : supplier));
  };

  const handleStatus = (supplier: string, status: "aprovado" | "rejeitado") => {
    setSupplierStatus((prev) => ({ ...prev, [supplier]: status }));
  };

  const toggleProductSelection = (id: string) => {
    const product = productSelections[id];
    if (product?.rejected) return;

    setProductSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        selected: !prev[id]?.selected,
        quantity: prev[id]?.quantity ?? 10,
        editing: false,
      },
    }));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setProductSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], quantity, selected: true },
    }));
  };

  const toggleEditing = (id: string) => {
    setProductSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], editing: !prev[id]?.editing },
    }));
  };

  const openRejectModal = (productId: string) => {
    setRejectModal({ open: true, productId });
    setRejectReasons([]);
    setCustomReason("");
  };

  const closeRejectModal = () => {
    setRejectModal({ open: false, productId: null });
  };

  const confirmRejection = () => {
    if (!rejectModal.productId) return;

    const reasonText =
      rejectReasons.join(", ") + (customReason ? ` — ${customReason}` : "");

    setProductSelections((prev) => ({
      ...prev,
      [rejectModal.productId!]: {
        ...prev[rejectModal.productId!],
        rejected: true,
        rejectReason: reasonText,
        selected: false,
      },
    }));

    closeRejectModal();
  };

  const toggleRejectReason = (reason: string) => {
    setRejectReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const openEditDeliveryModal = (supplier: string, currentDate: string) => {
    setEditDeliveryModal({ open: true, supplier, date: currentDate });
  };

  const closeEditDeliveryModal = () => {
    setEditDeliveryModal({ open: false, supplier: null, date: "" });
  };

  const saveDeliveryDate = () => {
    if (!editDeliveryModal.supplier) return;

    console.log(
      `Nova data de entrega para ${editDeliveryModal.supplier}: ${editDeliveryModal.date}`
    );

    closeEditDeliveryModal();
  };

  return (
    <>
      <aside className="fixed right-0 top-[56px] w-full sm:w-[390px] bg-card text-text shadow-2xl h-[calc(100%-56px)] flex flex-col z-50">
        <div className="flex items-center justify-between border-b border-border-dark px-4 py-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Package className="text-orange-500" size={20} />
            Sugestões do fornecedor
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text transition"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {visibleSuppliers.map(([supplierName, items]) => {
            const status = supplierStatus[supplierName];

            const deliveryDate = new Date(
              Date.now() + Math.floor(Math.random() * 4 + 1) * 86400000
            )
              .toISOString()
              .slice(0, 16);

            const showProducts = expanded === supplierName;

            return (
              <Card
                key={supplierName}
                className="p-4 bg-background border border-border-dark rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-semibold text-text text-base">
                      {supplierName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-text-secondary pt-2">
                      <button
                        onClick={() =>
                          openEditDeliveryModal(supplierName, deliveryDate)
                        }
                        className="text-text-secondary hover:text-text transition"
                        title="Editar entrega"
                      >
                        <Edit2 size={14} />
                      </button>
                      <span>
                        Entrega prevista:{" "}
                        {new Date(deliveryDate).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {status && (
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          status === "aprovado"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {status}
                      </span>
                    )}
                    <button
                      onClick={() => toggleExpand(supplierName)}
                      className="text-text-secondary hover:text-text transition"
                    >
                      {expanded === supplierName ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {showProducts && (
                  <div className="space-y-3 mt-3 border-t border-border-dark pt-3">
                    {items.slice(0, 4).map((product) => {
                      const selected = productSelections[product.id]?.selected;
                      const quantity =
                        productSelections[product.id]?.quantity ?? 10;
                      const rejected =
                        productSelections[product.id]?.rejected ?? false;

                      return (
                        <div
                          key={product.id}
                          className={`flex items-center gap-3 border rounded-md p-2 transition ${
                            rejected
                              ? "border-red-500 bg-background-secondary"
                              : selected
                              ? "border-green-400 bg-green-50/30"
                              : "border-border-dark bg-background-secondary"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected || false}
                            onChange={() => toggleProductSelection(product.id)}
                            disabled={rejected}
                            className="accent-orange-500 w-4 h-4"
                          />

                          <Image
                            src={product.image || "/placeholder.png"}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="rounded-md object-contain border border-border-dark"
                          />

                          <div className="flex flex-col flex-1 text-sm">
                            <p className="font-medium text-text line-clamp-2">
                              {product.name}
                            </p>
                            <p className="text-xs text-text-secondary">
                              SKU: {product.sku}
                            </p>

                            <div className="flex justify-between items-center mt-1 text-xs text-text-secondary">
                              <span>
                                Valor:{" "}
                                <strong className="text-green-500">
                                  {(product.cost ?? 0).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                                </strong>
                              </span>
                              <div className="flex items-center gap-2">
                                {productSelections[product.id]?.editing ? (
                                  <input
                                    type="number"
                                    value={quantity}
                                    min={1}
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        product.id,
                                        Number(e.target.value)
                                      )
                                    }
                                    onBlur={() => toggleEditing(product.id)} // sai da edição ao perder foco
                                    autoFocus
                                    className="w-14 text-center border border-border-dark rounded-md bg-white text-black text-xs"
                                  />
                                ) : (
                                  <span
                                    onClick={() => toggleEditing(product.id)}
                                    className="cursor-pointer font-medium text-text"
                                    title="Editar quantidade"
                                  >
                                    {quantity} un
                                  </span>
                                )}

                                <button
                                  onClick={() => openRejectModal(product.id)}
                                  className="text-text-secondary hover:text-red-500 transition"
                                  title="Recusar produto"
                                >
                                  <ThumbsDown size={14} />
                                </button>
                              </div>
                            </div>

                            {rejected && (
                              <p className="text-xs text-red-500 mt-1">
                                Motivo:{" "}
                                {productSelections[product.id]?.rejectReason}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white text-sm flex items-center gap-1"
                    onClick={() => handleStatus(supplierName, "aprovado")}
                  >
                    <Check size={14} /> Aprovar
                  </Button>
                  <Button
                    variant="outline"
                    className="text-sm flex items-center gap-1"
                    onClick={() => handleStatus(supplierName, "rejeitado")}
                  >
                    <XCircle size={14} /> Rejeitar
                  </Button>
                </div>
              </Card>
            );
          })}

          {topSuppliers.length === 0 && (
            <p className="text-center text-text-secondary text-sm">
              Nenhuma sugestão de fornecedor disponível.
            </p>
          )}
        </div>
      </aside>

      {/* Modais de recusa e edição de entrega */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-md p-4 w-80">
            <h3 className="font-semibold mb-2 text-text">Motivo da recusa</h3>
            <div className="flex flex-col gap-2 mb-2">
              {["Produto danificado", "Preço alto", "Fora de estoque"].map(
                (reason) => (
                  <label key={reason} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rejectReasons.includes(reason)}
                      onChange={() => toggleRejectReason(reason)}
                      className="accent-orange-500 w-4 h-4"
                    />
                    <span className="text-sm text-text">{reason}</span>
                  </label>
                )
              )}
              <input
                type="text"
                placeholder="Outro motivo..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="border border-border-dark rounded-md p-1 text-sm w-full bg-background text-text"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={confirmRejection}>Confirmar</Button>
              <Button variant="outline" onClick={closeRejectModal}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {editDeliveryModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-md p-4 w-80">
            <h3 className="font-semibold mb-2 text-text">
              Editar data de entrega
            </h3>
            <input
              type="datetime-local"
              value={editDeliveryModal.date}
              onChange={(e) =>
                setEditDeliveryModal((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
              className="border border-border-dark rounded-md p-1 text-sm w-full bg-background text-text"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={saveDeliveryDate}>Salvar</Button>
              <Button variant="outline" onClick={closeEditDeliveryModal}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
