"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useProductsStore } from "@/store/useProductsStore";
import {
  getDaysLeft,
  calculateStockHealth,
  getPurchaseStatus,
} from "@/lib/utils";
import { Product, StockConfig, CartItem, HealthStatus } from "@/lib/types";
import { StockConfigModal } from "@/components/comprar/StockConfigModal";
import { StockTable } from "@/components/comprar/StockTable";
import { StockFilters } from "@/components/comprar/StockFilters";
import { StockStatusCard } from "@/components/comprar/StockStatusCard";
import { StockHealthCard } from "@/components/comprar/StockHealthCard";
import { StockHeader } from "@/components/comprar/StockHeader";
import { ShoppingCartModal } from "@/components/comprar/ShoppingCartModal";
import { ShoppingCart } from "lucide-react";

export default function OtimizarComprasPage() {
  const { products, fetchProducts, updateProductHealthStatus } =
    useProductsStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockHealthFilter, setStockHealthFilter] = useState<HealthStatus | "">(
    ""
  );

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

  useEffect(() => {
    if (products.length > 0 && stockConfig) {
      const updatedHealthStatus = new Map();

      products.forEach((product) => {
        const daysLeft = getDaysLeft(product);
        const healthStatus = calculateStockHealth(daysLeft, stockConfig);

        if (product.stockHealthStatus !== healthStatus) {
          updatedHealthStatus.set(product.id, healthStatus);
        }
      });

      updatedHealthStatus.forEach((status, id) => {
        updateProductHealthStatus(id, status);
      });
    }
  }, [products, stockConfig, updateProductHealthStatus]);

  const handleOpenConfigForSingleProduct = (product: Product) => {
    setSelectedItems([product.id]);
    setIsStockConfigModalOpen(true);
  };

  const processedProducts = useMemo(() => {
    return products.map((product) => {
      const healthStatus = product.stockHealthStatus || "Parado";
      return {
        ...product,
        stockHealthStatus: healthStatus,
        purchaseStatus: getPurchaseStatus(product, healthStatus),
      };
    });
  }, [products]);

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

  const getPurchaseStatusForProduct = (product: Product): string => {
    return getPurchaseStatus(product, product.stockHealthStatus || "Parado");
  };

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
          coverage: getDaysLeft(product, 7),
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

    if (products.length > 0) {
      products.forEach((product) => {
        const daysLeft = getDaysLeft(product);
        const healthStatus = calculateStockHealth(daysLeft, newConfig);
        updateProductHealthStatus(product.id, healthStatus);
      });
    }
  };

  const handleOpenConfigModal = () => {
    setIsStockConfigModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-6 h-full">
      <div className="text-2xl sm:text-2xl font-bold my-6 ml-3 text-text">
        <span className="flex items-center gap-2">
          <ShoppingCart size={20} className="text-primary" />
          Comprar
        </span>
      </div>
      <StockHeader cartItems={cartItems} onOpenCart={handleOpenCart} />

      <div className="grid grid-cols-3 gap-6 w-full">
        <div className="md:col-span-2 col-span-3">
          <StockStatusCard
            products={products}
            getPurchaseStatus={getPurchaseStatusForProduct}
            stockConfig={stockConfig}
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
        onFilter={() => {}}
        selectedProducts={selectedProducts}
        onOpenConfigModal={handleOpenConfigModal}
      />

      <StockTable
        loading={loading}
        displayedProducts={filteredProducts}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        searchTerm={searchTerm}
        getPurchaseStatus={getPurchaseStatusForProduct}
        onAddToCart={handleAddToCart}
        onRemove={handleRemoveFromCart}
        cartItems={cartItems}
        onOpenConfig={handleOpenConfigForSingleProduct}
      />

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
    </div>
  );
}
