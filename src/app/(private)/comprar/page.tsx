"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useProductsStore } from "@/store/useProductsStore";
import {
  getDaysLeft,
  calculateStockHealth,
  getPurchaseStatus,
} from "@/lib/utils";
import {
  toggleSelection,
  toggleSelectAll,
  handleShiftSelection,
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
  const [supplierFilter, setSupplierFilter] = useState("");
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState("");
  const [stockLevelRange, setStockLevelRange] = useState({ min: "", max: "" });
  const [salesPerDayRange, setSalesPerDayRange] = useState({
    min: "",
    max: "",
  });
  const [daysLeftRange, setDaysLeftRange] = useState({ min: "", max: "" });
  const [purchaseForDaysRange, setPurchaseForDaysRange] = useState({
    min: "",
    max: "",
  });
  const [stockAlertFilter, setStockAlertFilter] = useState("");
  const [zeroStockOnly, setZeroStockOnly] = useState(false);
  const [abcFilter, setAbcFilter] = useState("");
  const [productTypeFilter, setProductTypeFilter] = useState("");
  const [profitMarginRange, setProfitMarginRange] = useState({
    min: "",
    max: "",
  });
  const [onlySelected, setOnlySelected] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );
  const [isStockConfigModalOpen, setIsStockConfigModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
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
      const updated = new Map();
      products.forEach((product) => {
        const daysLeft = getDaysLeft(product);
        const healthStatus = calculateStockHealth(daysLeft, stockConfig);
        if (product.stockHealthStatus !== healthStatus) {
          updated.set(product.id, healthStatus);
        }
      });
      updated.forEach((status, id) => {
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

  const inRange = (value: number, min: string, max: string) => {
    if (min && value < Number(min)) return false;
    if (max && value > Number(max)) return false;
    return true;
  };

  const filteredProducts = useMemo(() => {
    return processedProducts.filter(
      (p) =>
        (!searchTerm ||
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (!supplierFilter ||
          p.supplier?.toLowerCase().includes(supplierFilter.toLowerCase())) &&
        (!stockHealthFilter || p.stockHealthStatus === stockHealthFilter) &&
        (!purchaseStatusFilter || p.purchaseStatus === purchaseStatusFilter) &&
        inRange(p.stockLevel ?? 0, stockLevelRange.min, stockLevelRange.max) &&
        inRange(
          p.salesPerDay ?? 0,
          salesPerDayRange.min,
          salesPerDayRange.max
        ) &&
        inRange(getDaysLeft(p), daysLeftRange.min, daysLeftRange.max) &&
        inRange(
          p.purchaseForDays ?? 0,
          purchaseForDaysRange.min,
          purchaseForDaysRange.max
        )
    );
  }, [
    processedProducts,
    searchTerm,
    supplierFilter,
    stockHealthFilter,
    purchaseStatusFilter,
    stockLevelRange,
    salesPerDayRange,
    daysLeftRange,
    purchaseForDaysRange,
  ]);

  const getPurchaseStatusForProduct = (product: Product): string => {
    return getPurchaseStatus(product, product.stockHealthStatus || "Parado");
  };

  const selectedProducts = filteredProducts.filter((p) =>
    selectedItems.includes(p.id)
  );

  const handleSelectItem = (id: string, index: number, shiftKey?: boolean) => {
    setIsBulkMode(false);
    setSelectedItems((prev) => {
      const updated = shiftKey
        ? handleShiftSelection(id, filteredProducts, prev, lastSelectedIndex)
        : toggleSelection(prev, id);
      return updated;
    });
    setLastSelectedIndex(index);
  };

  const handleSelectAll = () => {
    setIsBulkMode(false);
    setSelectedItems((prev) => toggleSelectAll(filteredProducts, prev));
  };

  const handleAddToCart = (product: Product) => {
    setIsBulkMode(true);
    if (!selectedItems.includes(product.id)) {
      setSelectedItems((prev) => [...prev, product.id]);
    }

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

  const handleOpenCart = () => {
    setIsBulkMode(true);
    const itemsToSelect = filteredProducts
      .filter((p) => getPurchaseStatusForProduct(p) === "Comprar")
      .map((p) => p.id);
    setSelectedItems(itemsToSelect);
  };
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

  const handleBulkAddToCart = () => {
    selectedProducts.forEach((product) => {
      handleAddToCart(product);
    });
    setIsCartModalOpen(true);
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
    setIsBulkMode(false);
  };

  const handleExportList = () => {
    console.log("Exporting selected products:", selectedProducts);
    // Future export logic here
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
        supplierFilter={supplierFilter}
        setSupplierFilter={setSupplierFilter}
        purchaseStatusFilter={purchaseStatusFilter}
        setPurchaseStatusFilter={setPurchaseStatusFilter}
        stockHealthFilter={stockHealthFilter}
        setStockHealthFilter={setStockHealthFilter}
        stockLevelRange={stockLevelRange}
        setStockLevelRange={setStockLevelRange}
        salesPerDayRange={salesPerDayRange}
        setSalesPerDayRange={setSalesPerDayRange}
        daysLeftRange={daysLeftRange}
        setDaysLeftRange={setDaysLeftRange}
        purchaseForDaysRange={purchaseForDaysRange}
        setPurchaseForDaysRange={setPurchaseForDaysRange}
        stockAlertFilter={stockAlertFilter}
        setStockAlertFilter={setStockAlertFilter}
        zeroStockOnly={zeroStockOnly}
        setZeroStockOnly={setZeroStockOnly}
        abcFilter={abcFilter}
        setAbcFilter={setAbcFilter}
        productTypeFilter={productTypeFilter}
        setProductTypeFilter={setProductTypeFilter}
        profitMarginRange={profitMarginRange}
        setProfitMarginRange={setProfitMarginRange}
        onlySelected={onlySelected}
        setOnlySelected={setOnlySelected}
      />

      <StockTable
        loading={loading}
        displayedProducts={filteredProducts}
        selectedItems={selectedItems}
        onSelectItem={handleSelectItem}
        onSelectAll={handleSelectAll}
        searchTerm={searchTerm}
        getPurchaseStatus={getPurchaseStatusForProduct}
        onAddToCart={handleAddToCart}
        onRemove={handleRemoveFromCart}
        cartItems={cartItems}
        onOpenConfig={handleOpenConfigForSingleProduct}
        onBulkAddToCart={handleBulkAddToCart}
        onOpenConfigModal={handleOpenConfigModal}
        onClearSelection={handleClearSelection}
        isBulkMode={isBulkMode}
        onExportList={handleExportList}
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
