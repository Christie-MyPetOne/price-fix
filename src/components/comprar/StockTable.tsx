"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  RefreshCcw,
  ShoppingCartIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Pencil,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Snowflake,
  ShoppingCart,
  PackageCheck,
} from "lucide-react";
import {
  paginate,
  sortData,
  toggleSelection,
  toggleSelectAll,
  handleShiftSelection,
} from "@/lib/utils";
import { getDaysLeft, getPurchaseSuggestionUnits } from "@/lib/utils";
import { StockTableProps, Product } from "@/lib/types";
import { useStockConfigStore } from "@/store/useStockConfigStore";

const StatusBadge = ({ status }: { status?: string }) => {
  const statusConfig: Record<
    string,
    { color: string; icon: React.ElementType }
  > = {
    Acabou: { color: "#ef4444", icon: XCircle },
    Comprar: { color: "#f59e0b", icon: ShoppingCart },
    Bom: { color: "#22c55e", icon: CheckCircle2 },
    Pedido: { color: "#3b82f6", icon: PackageCheck },
  };
  const mappedStatus = status === "Acabou" ? "Acabou" : status;
  const config = statusConfig[mappedStatus || ""];

  if (!config) return <span className="text-xs text-text-secondary">-</span>;

  const { color, icon: Icon } = config;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      <Icon size={12} /> {status}
    </span>
  );
};

const StockHealthBadge = ({ status }: { status?: string }) => {
  const healthConfig: Record<
    string,
    { color: string; icon: React.ElementType; label: string }
  > = {
    Excelente: {
      color: "text-green-500",
      icon: CheckCircle2,
      label: "Excelente",
    },
    Moderado: {
      color: "text-yellow-500",
      icon: AlertTriangle,
      label: "Moderado",
    },
    Risco: { color: "text-red-500", icon: XCircle, label: "Risco" },
    Parado: { color: "text-blue-400", icon: Snowflake, label: "Parado" },
  };

  const config = healthConfig[status || "Moderado"];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.color}`}
    >
      <Icon size={14} /> {config.label}
    </span>
  );
};

export const StockTable: React.FC<StockTableProps> = ({
  loading,
  displayedProducts,
  selectedItems,
  setSelectedItems,
  searchTerm,
  getPurchaseStatus,
  onAddToCart,
  onRemove,
  cartItems = [],
  onOpenConfig,
}) => {
  const [expandedProductId, setExpandedProductId] = useState<string | null>(
    null
  );
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );

  const [sortKey, setSortKey] = useState<keyof Product>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const { getConfigProduto } = useStockConfigStore();

  const sortedProducts = useMemo(() => {
    return sortData<Product>(displayedProducts, sortKey, sortDirection);
  }, [displayedProducts, sortKey, sortDirection]);

  const { pageData: paginatedProducts, totalPages: computedTotalPages } =
    useMemo(
      () => paginate(sortedProducts, currentPage, rowsPerPage),
      [sortedProducts, currentPage, rowsPerPage]
    );

  const allFilteredSelected =
    paginatedProducts.length > 0 &&
    selectedItems.length === paginatedProducts.length;
  const isIndeterminate = selectedItems.length > 0 && !allFilteredSelected;

  const handleSelectAll = () => {
    setSelectedItems((prev) => toggleSelectAll(paginatedProducts, prev));
  };

  const handleSelectItem = (id: string, index: number, shiftKey?: boolean) => {
    setSelectedItems((prev) => {
      const updated = shiftKey
        ? handleShiftSelection(id, paginatedProducts, prev, lastSelectedIndex)
        : toggleSelection(prev, id);
      return updated;
    });
    setLastSelectedIndex(index);
  };

  const toggleExpand = (id: string) => {
    setExpandedProductId((prev) => (prev === id ? null : id));
  };

  const handleToggleCart = (product: Product) => {
    const isInCart = cartItems.some((item) => item.id === product.id);
    if (isInCart) onRemove?.(product.id);
    else onAddToCart?.(product);
  };

  const handleSort = (key: keyof Product) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const headers = [
    { key: "name", label: "Produto" },
    { key: "stockLevel", label: "Estoque" },
    { key: "salesPerDay", label: "Vendas" },
    { key: "daysLeft", label: "Vai durar" },
    { key: "purchaseForDays", label: "Comprar para" },
    { key: "purchaseSuggestion", label: "Status Comprar" },
    { key: "stockHealthStatus", label: "Saúde" },
    { key: "supplier", label: "Fornecedor" },
  ];

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border-dark shadow-sm p-6 flex justify-center items-center h-64">
        <span className="text-text-secondary flex items-center gap-2">
          <RefreshCcw className="animate-spin" /> Carregando produtos...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border-dark shadow-sm p-4 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
        <label className="text-xs sm:text-sm font-semibold text-text-secondary flex items-center gap-2">
          Mostrar
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-border-dark text-xs rounded px-1 py-1"
          >
            {[5, 8, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          itens
        </label>

        <p className="text-[0.65rem] sm:text-xs text-text-secondary text-center sm:text-right">
          Selecionados:{" "}
          <span className="font-medium">{selectedItems.length}</span> -
          Mostrando{" "}
          <span className="font-medium">
            {(currentPage - 1) * rowsPerPage + 1}
          </span>{" "}
          a{" "}
          <span className="font-medium">
            {Math.min(currentPage * rowsPerPage, sortedProducts.length)}
          </span>{" "}
          de <span className="font-medium">{sortedProducts.length}</span>{" "}
          produtos
        </p>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left divide-border-dark">
          <thead className="bg-background text-xs text-text uppercase">
            <tr>
              <th className="px-3 py-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer bg-white"
                />
              </th>
              {headers.map(({ key, label }) => (
                <th
                  key={key}
                  className="px-3 py-3 text-left font-medium text-text-secondary cursor-pointer select-none"
                  onClick={() => handleSort(key as keyof Product)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <ArrowUpDown
                      size={14}
                      className={`${
                        sortKey === key
                          ? "text-green-500"
                          : "text-gray-400 opacity-50"
                      }`}
                    />
                  </div>
                </th>
              ))}
              <th className="px-3 py-3 text-center font-medium text-text-secondary">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-dark">
            {paginatedProducts.map((product, index) => {
              const salesPerDay =
                (product.salesHistory?.reduce((a, b) => a + b, 0) || 0) /
                (product.salesHistory?.length || 7);

              const daysLeft = getDaysLeft(product);
              const produtoConfig = getConfigProduto(product.id);
              const idealPurchaseDays = produtoConfig.comprarPara;
              const purchaseSuggestionUnits = getPurchaseSuggestionUnits(
                product,
                produtoConfig
              );
              const purchaseStatus = getPurchaseStatus(product);
              const stockHealthStatus = product.stockHealthStatus || "Parado";
              const isExpanded = expandedProductId === product.id;
              const isInCart = cartItems.some((item) => item.id === product.id);

              return (
                <React.Fragment key={product.id}>
                  <tr className="hover:bg-background transition-colors">
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(product.id)}
                        readOnly
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectItem(product.id, index, e.shiftKey);
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-orange-500 cursor-pointer bg-white"
                      />
                    </td>

                    <td className="px-3 py-2 flex items-center gap-2">
                      <div className="w-9 h-9 relative flex-shrink-0">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-border-dark rounded" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-text">
                          {product.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {product.sku}
                        </p>
                      </div>
                    </td>

                    <td className="px-3 py-2 text-right text-xs">
                      {product.stockLevel ?? 0}
                    </td>
                    <td className="px-3 py-2 text-right text-xs">
                      {salesPerDay.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right text-xs">
                      {isFinite(daysLeft) ? daysLeft.toFixed(2) : "0.00"}
                    </td>
                    <td className="px-3 py-2 text-right text-xs">
                      {idealPurchaseDays}
                    </td>
                    <td className="px-3 py-2 text-right text-xs">
                      <p className="font-semibold">{purchaseSuggestionUnits}</p>
                      <StatusBadge status={purchaseStatus} />
                    </td>
                    <td className="px-3 py-2 text-left text-xs">
                      <StockHealthBadge status={stockHealthStatus} />
                    </td>
                    <td className="px-3 py-2 text-left text-xs text-text-secondary">
                      {product.supplier}
                    </td>

                    <td className="px-3 py-2 flex items-center justify-center gap-2">
                      <button
                        className={`p-1 rounded ${
                          isInCart
                            ? "bg-green-100 text-green-700"
                            : "hover:bg-background"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCart(product);
                        }}
                      >
                        <ShoppingCartIcon size={16} />
                      </button>
                      <button
                        className="p-1 hover:bg-background rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenConfig(product);
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="p-1 hover:bg-background rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(product.id);
                        }}
                      >
                        <ArrowDown size={16} />
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-background-light border-t border-border-dark">
                      <td colSpan={10} className="px-6 py-4 text-xs text-text">
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 text-center">
                          <div>
                            <p className="font-semibold">
                              {salesPerDay.toFixed(2)}
                            </p>
                            <p className="text-text-secondary">vendas/mês</p>
                          </div>
                          <div>
                            <p className="font-semibold">
                              {product.stockLevel ?? "-"}
                            </p>
                            <p className="text-text-secondary">estoque atual</p>
                          </div>
                          <div>
                            <p className="font-semibold">
                              {isFinite(daysLeft) ? daysLeft.toFixed(0) : "∞"}
                            </p>
                            <p className="text-text-secondary">
                              vai durar/dias
                            </p>
                          </div>
                          <div>
                            <p className="font-semibold">
                              {purchaseSuggestionUnits}
                            </p>
                            <p className="text-text-secondary">comprar</p>
                          </div>
                          <div>
                            <p className="font-semibold">
                              R$ {product.price.toFixed(2)}
                            </p>
                            <p className="text-text-secondary">preço médio</p>
                          </div>
                          <div>
                            <p className="font-semibold">
                              R$ {product.totalProfit.toFixed(2)}
                            </p>
                            <p className="text-text-secondary">lucro bruto</p>
                          </div>
                          <div>
                            <p className="font-semibold">
                              {product.margin.toFixed(2)}%
                            </p>
                            <p className="text-text-secondary">margem</p>
                          </div>
                          <div>
                            <p className="font-semibold">
                              R$ {product.workingCapital?.toFixed(2)}
                            </p>
                            <p className="text-text-secondary">
                              capital em estoque
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {paginatedProducts.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="text-center py-10 text-text-secondary"
                >
                  {searchTerm
                    ? "Nenhum produto encontrado."
                    : "Nenhum produto para exibir."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {computedTotalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border-dark bg-card px-4 py-3 mt-2">
          <div className="flex gap-2">
            <button
              className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: computedTotalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`p-2 rounded-md text-xs font-semibold ${
                    page === currentPage
                      ? "bg-primary text-white"
                      : "ring-1 ring-border-dark hover:bg-background"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            )}
            <button
              className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background"
              disabled={currentPage === computedTotalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
