"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useProductStore } from "@/store/useProductStore";
import { StockConfigModal } from "@/components/comprar/StockConfigModal";
import { StockTable } from "@/components/comprar/StockTable";
import { StockFilters } from "@/components/comprar/StockFilters";
import { Product, StockConfig, CartItem } from "@/lib/types";
import { StockStatusCard } from "@/components/comprar/StockStatusCard";
import { StockHealthCard } from "@/components/comprar/StockHealthCard";
import { StockHeader } from "@/components/comprar/StockHeader";
import { ShoppingCartModal } from "@/components/comprar/ShoppingCartModal";

export default function OtimizarComprasPage() {
  const { sortedProducts, fetchProducts } = useProductStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockHealthFilter, setStockHealthFilter] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isStockConfigModalOpen, setIsStockConfigModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  const [stockConfig] = useState<StockConfig>({
    useDefault: true,
    purchaseForDays: 30,
    deliveryEstimateDays: 7,
    healthLevels: { good: 40, ruim: 60, frozen: 80 },
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };
    load();
  }, [fetchProducts]);

  const getStockHealth = (product: Product) => {
    const totalSales = product.salesHistory?.reduce((a, b) => a + b, 0) || 0;
    const salesPerDay = totalSales / (product.salesHistory?.length || 1);
    const daysLeft =
      product.stockLevel && salesPerDay > 0
        ? product.stockLevel / salesPerDay
        : Infinity;
    if (daysLeft > 60) return "Congelado";
    if (daysLeft > 50) return "Ruim";
    if (daysLeft > 40) return "Média";
    return "Bom";
  };

  const getPurchaseStatus = (product: Product): string => {
    const salesHistory = product.salesHistory ?? [];
    const totalSales = salesHistory.reduce((a, b) => a + b, 0);
    const salesPerDay = totalSales / (salesHistory.length || 1);
    const daysLeft =
      product.stockLevel && salesPerDay > 0
        ? product.stockLevel / salesPerDay
        : Infinity;

    if ((product.stockLevel ?? 0) <= 0 && salesPerDay > 0) return "Sem Estoque";
    if (daysLeft < 40) return "Comprar";
    return "Ok";
  };

  // ✅ Agora vem antes do selectedProducts
  const filteredProducts = useMemo(() => {
    let products = sortedProducts;
    if (searchTerm) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (stockHealthFilter) {
      products = products.filter(
        (p) => getStockHealth(p) === stockHealthFilter
      );
    }
    return products;
  }, [sortedProducts, searchTerm, stockHealthFilter]);

  const selectedProducts = filteredProducts.filter((p) =>
    selectedItems.includes(p.id)
  );

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          description: product.description || "",
          sku: product.sku || "",
          image: product.image || product.imageUrl || "/placeholder.png",
          price: product.price || 0,
          cost: product.price || 0,
          estimatedRevenue: product.totalProfit || 0,
          estimatedProfit: product.margin || 0,
          quantity: 1,
          coverage: product.coverage || 0,
          supplier: product.supplier || "Fornecedor não sincronizado",
        },
      ];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 🛒 Modal do carrinho
  const handleOpenCart = () => setIsCartModalOpen(true);
  const handleCloseCart = () => setIsCartModalOpen(false);

  // ⚙️ Modal de configuração
  const handleOpenConfigModal = (products: Product[]) => {
    setIsStockConfigModalOpen(true);
  };

  const handleCloseConfigModal = () => {
    setIsStockConfigModalOpen(false);
    setSelectedItems([]); // ✅ desmarca todos os produtos
  };

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / rowsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <div className="container mx-auto p-6 space-y-6 max-w-6xl">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <StockHeader
            cartItems={cartItems}
            onRemove={handleRemoveFromCart}
            onAddToCart={handleAddToCart}
            onOpenCart={handleOpenCart}
          />
        </div>

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
          onFilter={() => setCurrentPage(1)}
          selectedProducts={selectedProducts}
          onOpenConfigModal={handleOpenConfigModal}
        />

        <StockTable
          loading={loading}
          displayedProducts={displayedProducts}
          filteredProducts={filteredProducts}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          totalProducts={totalProducts}
          searchTerm={searchTerm}
          getPurchaseStatus={getPurchaseStatus}
          getStockHealth={getStockHealth}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          onAddToCart={handleAddToCart}
          onRemove={handleRemoveFromCart}
          cartItems={cartItems}
        />
      </div>

      <StockConfigModal
        open={isStockConfigModalOpen}
        onClose={handleCloseConfigModal} // ✅ agora desmarca ao fechar
        products={selectedProducts}
      />

      <ShoppingCartModal
        open={isCartModalOpen}
        onClose={handleCloseCart}
        cartItems={cartItems}
        onRemove={handleRemoveFromCart}
      />
    </>
  );
}
