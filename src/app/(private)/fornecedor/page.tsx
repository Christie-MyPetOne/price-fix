"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type MockProduct = {
  id: string;
  name: string;
  stock: number;
  supplier: string;
};

export default function SupplierReplenishPage() {
  // 🧪 Mock de produtos do fornecedor logado
  const mockProducts: MockProduct[] = [
    { id: "1", name: "Café 1kg", stock: 5, supplier: "Fornecedor A" },
    { id: "2", name: "Açúcar 5kg", stock: 3, supplier: "Fornecedor A" },
    { id: "3", name: "Leite em pó", stock: 25, supplier: "Fornecedor A" },
    { id: "4", name: "Farinha 1kg", stock: 2, supplier: "Fornecedor A" },
  ];

  const lowStockProducts = mockProducts.filter((p) => p.stock < 10);

  const [selectedProducts, setSelectedProducts] = useState<
    { id: string; name: string; quantity: number }[]
  >([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleQuantityChange = (product: MockProduct, qty: number) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: qty } : p
        );
      }
      return [...prev, { id: product.id, name: product.name, quantity: qty }];
    });
  };

  const handleSubmit = () => {
    if (!date || !time || selectedProducts.length === 0) {
      alert("Preencha todos os campos antes de enviar!");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold text-green-600">
          Pedido de Reposição Enviado!
        </h1>
        <p className="text-muted-foreground">
          O administrador será notificado para aprovar sua solicitação.
        </p>
        <Button onClick={() => setSubmitted(false)}>Fazer Novo Pedido</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Solicitar Reposição de Estoque</h1>
      <p className="text-muted-foreground">
        Veja abaixo os produtos com baixo estoque e informe as quantidades para
        reposição.
      </p>

      <div className="grid gap-4">
        {lowStockProducts.map((product) => (
          <Card
            key={product.id}
            className="flex justify-between items-center p-4"
          >
            <div>
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-sm text-muted-foreground">
                Estoque atual: {product.stock} unidades
              </p>
            </div>
            <input
              type="number"
              min={1}
              placeholder="Qtd"
              onChange={(e) =>
                handleQuantityChange(product, parseInt(e.target.value))
              }
              className="border rounded-md px-2 py-1 w-20 text-center"
            />
          </Card>
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <div>
          <label className="text-sm font-medium block mb-1">
            Data de entrega
          </label>
          <input
            type="date"
            className="border rounded-md px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">
            Horário de entrega
          </label>
          <input
            type="time"
            className="border rounded-md px-3 py-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full mt-6" onClick={handleSubmit}>
        Enviar Pedido
      </Button>
    </div>
  );
}
