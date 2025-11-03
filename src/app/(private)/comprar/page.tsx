"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useProductsStore } from "@/store/useProductsStore";
import { StockConfigModal } from "@/components/comprar/StockConfigModal";
import { StockTable } from "@/components/comprar/StockTable";
import { StockFilters } from "@/components/comprar/StockFilters";
import { Product, StockConfig, CartItem } from "@/lib/types";
import { StockStatusCard } from "@/components/comprar/StockStatusCard";
import { StockHealthCard } from "@/components/comprar/StockHealthCard";
import { StockHeader } from "@/components/comprar/StockHeader";
import { ShoppingCartModal } from "@/components/comprar/ShoppingCartModal";

type HealthStatus = "Excelente" | "Média" | "Risco" | "Parado";

export default function OtimizarComprasPage() {
  const { products, fetchProducts } = useProductsStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockHealthFilter, setStockHealthFilter] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isStockConfigModalOpen, setIsStockConfigModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [stockConfig, setStockConfig] = useState<StockConfig>({
    comprarPara: 30,
    entregaEstimada: 7,
    excelente: 40,
    moderado: 60,
    risco: 80,
    parado: 81,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };
    load();
  }, [fetchProducts]);

  const calculateStockHealth = (product: Product): HealthStatus => {
    const totalSales = product.salesHistory?.reduce((a, b) => a + b, 0) || 0;
    const salesPerDay = totalSales / (product.salesHistory?.length || 1);

    if (salesPerDay <= 0 && (product.stockLevel ?? 0) > 0) {
      return "Parado";
    }

    const daysLeft =
      (product.stockLevel ?? 0) > 0 && salesPerDay > 0
        ? (product.stockLevel ?? 0) / salesPerDay
        : 0;

    if (daysLeft <= stockConfig.excelente) return "Excelente";
    if (daysLeft <= stockConfig.moderado) return "Média";
    if (daysLeft <= stockConfig.risco) return "Risco";
    return "Parado";
  };

  const getPurchaseStatus = (product: Product): string => {
    const health = product.stockHealthStatus;

    if ((product.stockLevel ?? 0) <= 0 && (product.sales ?? 0) > 0)
      return "Acabou";

    if (health === "Risco" || health === "Média") return "Pedido";
    if (health === "Excelente" || health === "Parado") return "Bom";

    return "Bom";
  };

  const handleOpenConfigForSingleProduct = (product: Product) => {
    setSelectedItems([product.id]);
    setIsStockConfigModalOpen(true);
  };

  const getDaysLeft = (product: Product): number => {
    const totalSales = product.salesHistory?.reduce((a, b) => a + b, 0) || 0;
    const salesPerDay = totalSales / (product.salesHistory?.length || 7);

    if ((product.stockLevel ?? 0) <= 0 || salesPerDay <= 0) {
      return 0;
    }

    const daysLeft = (product.stockLevel ?? 0) / salesPerDay;
    return isFinite(daysLeft) ? daysLeft : 0;
  };

  const processedProducts = useMemo(() => {
    return products.map((product) => ({
      ...product,
      stockHealthStatus: calculateStockHealth(product),
    }));
  }, [products, stockConfig]);

  const filteredProducts = useMemo(() => {
    let prods = processedProducts;
    if (searchTerm) {
      prods = prods.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (stockHealthFilter) {
      prods = prods.filter((p) => p.stockHealthStatus === stockHealthFilter);
    }
    return prods;
  }, [processedProducts, searchTerm, stockHealthFilter]);

  const selectedProducts = filteredProducts.filter((p) =>
    selectedItems.includes(p.id)
  );

  const handleAddToCart = (product: Product) => {
    setSelectedItems((prev) => {
      if (prev.includes(product.id)) return prev;
      return [...prev, product.id];
    });

    setCartItems((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      const unitCost = product.cost ?? 0;
      const unitPrice = product.price ?? 0;
      const profit = unitPrice - unitCost;
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          sku: product.sku || "",
          image: product.image || "/placeholder.png",
          price: unitPrice,
          cost: unitCost,
          estimatedRevenue: unitPrice,
          estimatedProfit: profit,
          quantity: 1,
          coverage: getDaysLeft(product),
          supplier: product.supplier || "Fornecedor não sincronizado",
        },
      ];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  const handleUpdateCartQuantity = (id: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const unitCost = item.cost ?? 0;
        const unitPrice = item.price ?? 0;
        return {
          ...item,
          quantity: newQuantity,
          estimatedRevenue: unitPrice * newQuantity,
          estimatedProfit: (unitPrice - unitCost) * newQuantity,
        };
      })
    );
  };

  const handleOpenCart = () => setIsCartModalOpen(true);
  const handleCloseCart = () => setIsCartModalOpen(false);

  const handleSaveConfig = (newConfig: StockConfig) => {
    setStockConfig(newConfig);
    setIsStockConfigModalOpen(false);
    setSelectedItems([]);
  };

  const handleOpenConfigModal = (products: Product[]) => {
    setIsStockConfigModalOpen(true);
  };

  return (
    <>
      <div className="container mx-auto p-6 space-y-6 max-w-6xl">
        <StockHeader cartItems={cartItems} onOpenCart={handleOpenCart} />

        <div className="grid grid-cols-3 gap-6">
          <div className="md:col-span-2 col-span-3">
            <StockStatusCard
              products={filteredProducts}
              getPurchaseStatus={getPurchaseStatus}
            />
          </div>
          <div className="md:col-span-1 col-span-3">
            <StockHealthCard
              stockConfig={stockConfig}
              onConfigClick={() => setIsStockConfigModalOpen(true)}
            />
          </div>
        </div>

        <StockFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          stockHealthFilter={stockHealthFilter}
          setStockHealthFilter={setStockHealthFilter}
          onFilter={() => {}} // A tabela reseta a página internamente
          selectedProducts={selectedProducts}
          onOpenConfigModal={handleOpenConfigModal}
        />

        {/* ✅ A tabela agora recebe a lista filtrada completa e gerencia a própria paginação */}
        <StockTable
          loading={loading}
          displayedProducts={filteredProducts}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          searchTerm={searchTerm}
          getPurchaseStatus={getPurchaseStatus}
          onAddToCart={handleAddToCart}
          onRemove={handleRemoveFromCart}
          cartItems={cartItems}
          onOpenConfig={handleOpenConfigForSingleProduct}
        />
      </div>

      <StockConfigModal
        open={isStockConfigModalOpen}
        onClose={() => setIsStockConfigModalOpen(false)}
        products={selectedProducts}
        config={stockConfig}
        onSave={handleSaveConfig}
      />

      <ShoppingCartModal
        open={isCartModalOpen}
        onClose={handleCloseCart}
        cartItems={cartItems}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateCartQuantity}
      />
    </>
  );
}
