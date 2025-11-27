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
  ArrowUp,
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
  getDaysLeft,
  getPurchaseSuggestionUnits,
} from "@/lib/utils";

import { StockTableProps, Product } from "@/lib/types";
import { useStockConfigStore } from "@/store/useStockConfigStore";

type SortKey =
  | "name"
  | "stockLevel"
  | "salesPerDay"
  | "daysLeft"
  | "purchaseSuggestionUnits"
  | "stockHealthStatus"
  | "supplier";

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

  const config = statusConfig[status ?? ""];
  if (!config) return <span className="text-xs text-text-secondary">-</span>;

  const Icon = config.icon;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded font-medium text-[10px] text-white"
      style={{ backgroundColor: config.color }}
    >
      <Icon size={11} />
      {status}
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

  const config = healthConfig[status ?? "Moderado"];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded bg-background-light text-xs ${config.color}`}
    >
      <Icon size={11} /> {config.label}
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

  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const { getConfigProduto } = useStockConfigStore();

  const headers: { key: SortKey; label: string }[] = [
    { key: "name", label: "Produto" },
    { key: "stockLevel", label: "Estq." },
    { key: "salesPerDay", label: "Vendas" },
    { key: "daysLeft", label: "Vai durar" },
    { key: "purchaseSuggestionUnits", label: "Comprar" },
    { key: "stockHealthStatus", label: "Saúde" },
    { key: "supplier", label: "Fornecedor" },
  ];

  const sortedProducts = useMemo(() => {
    const enriched = displayedProducts.map((p) => ({
      ...p,

      salesPerDay:
        (p.salesHistory?.reduce((a, b) => a + b, 0) || 0) /
        (p.salesHistory?.length || 7),

      daysLeft: getDaysLeft(p),

      purchaseSuggestionUnits: getPurchaseSuggestionUnits(
        p,
        getConfigProduto(p.id)
      ),
    }));

    return sortData(enriched, sortKey, sortDirection);
  }, [displayedProducts, sortKey, sortDirection, getConfigProduto]);

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

    if (isInCart) {
      onRemove?.(product.id);
    } else {
      onAddToCart?.(product);
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const arrowClass = (key: SortKey) =>
    `transition-transform duration-200 ${
      sortKey === key ? "text-primary" : "opacity-40"
    } ${sortKey === key && sortDirection === "asc" ? "rotate-180" : ""}`;

  if (loading) {
    return (
      <div className="bg-card border border-border-dark rounded-lg shadow-sm p-6 flex justify-center items-center h-64">
        <span className="text-text-secondary flex items-center gap-2">
          <RefreshCcw className="animate-spin" /> Carregando produtos...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border-dark shadow-lg p-4 w-full">
      <div className="flex justify-between items-center pb-3 ">
        <label className="text-xs font-semibold text-text-secondary flex items-center gap-2">
          Itens por página:
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-border-dark text-xs rounded-md px-2 py-1 bg-background text-text-primary cursor-pointer"
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>

        <p className="text-[11px] text-text-secondary">
          Selecionados:{" "}
          <span className="font-semibold text-primary">
            {selectedItems.length}
          </span>
        </p>
      </div>

      <div className="border border-border-dark rounded-lg bg-background overflow-x-auto">
        <table className="min-w-[900px] md:min-w-full table-fixed text-xs">
          <thead className="bg-background-light border-b border-border-dark">
            <tr>
              <th className="w-6 px-2 py-2 text-center">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={handleSelectAll}
                  className="h-3.5 w-3.5 cursor-pointer"
                />
              </th>

              {headers.map(({ key, label }) => (
                <th
                  key={key}
                  className="px-3 py-3 text-sm font-semibold text-text-secondary cursor-pointer select-none whitespace-nowrap"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <ArrowUpDown size={10} className={arrowClass(key)} />
                  </div>
                </th>
              ))}

              <th className="w-20 px-2 py-2 text-center font-semibold">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((product, index) => {
              const salesPerDay = product.salesPerDay ?? 0;
              const daysLeft = product.daysLeft ?? 0;
              const purchaseSuggestionUnits =
                product.purchaseSuggestionUnits ?? 0;

              const purchaseStatus = getPurchaseStatus(product);
              const stockHealthStatus = product.stockHealthStatus || "Parado";

              const isExpanded = expandedProductId === product.id;
              const isInCart = cartItems.some((item) => item.id === product.id);

              return (
                <React.Fragment key={product.id}>
                  <tr
                    className={`transition-colors border-b border-border-dark ${
                      selectedItems.includes(product.id)
                        ? "bg-background-light"
                        : "hover:bg-background-light/70"
                    }`}
                  >
                    <td className="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(product.id)}
                        readOnly
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectItem(product.id, index, e.shiftKey);
                        }}
                        className="h-3.5 w-3.5 cursor-pointer"
                      />
                    </td>

                    <td className="px-2 py-2 flex items-center gap-2 truncate">
                      <div className="w-8 h-8 rounded-md overflow-hidden border border-border-dark bg-background-light">
                        {product.image ? (
                          <Image
                            src={product.image}
                            width={32}
                            height={32}
                            alt=""
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full text-[10px] flex items-center justify-center text-text-secondary">
                            IMG
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-semibold max-w-[200px] ">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-xs text-text-secondary truncate max-w-[90px]">
                          {product.sku}
                        </p>
                      </div>
                    </td>

                    <td className="px-2 py-2 text-right font-mono text-base">
                      {product.stockLevel}
                    </td>

                    <td className="px-2 py-2 text-right font-mono text-base">
                      {salesPerDay.toFixed(2)}
                    </td>

                    <td className="px-2 py-2 text-right font-mono text-base">
                      <span className={daysLeft < 7 ? "text-red-500" : ""}>
                        {isFinite(daysLeft) ? daysLeft.toFixed(0) : "∞"}
                      </span>
                    </td>

                    <td className="px-2 py-2">
                      <p className="text-center font-semibold">
                        {purchaseSuggestionUnits}
                      </p>
                      <div className="flex text-xs justify-center">
                        <StatusBadge status={purchaseStatus} />
                      </div>
                    </td>

                    <td className="px-2 py-2 text-center ">
                      <StockHealthBadge status={stockHealthStatus} />
                    </td>

                    <td className="px-2 py-2 truncate text-xs max-w-[80px] text-[10px]">
                      {product.supplier}
                    </td>

                    <td className="px-2 py-2 flex justify-center gap-1">
                      <button
                        className={`p-1.5 rounded border border-border-dark text-[10px] ${
                          isInCart
                            ? "bg-green-100 text-primary"
                            : "bg-background-light hover:bg-background"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCart(product);
                        }}
                      >
                        <ShoppingCartIcon size={13} />
                      </button>

                      <button
                        className="p-1.5 rounded border border-border-dark bg-background-light hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenConfig(product);
                        }}
                      >
                        <Pencil size={13} />
                      </button>

                      <button
                        className={`p-1.5 rounded border border-border-dark text-[10px] ${
                          isExpanded
                            ? "bg-green-100 text-primary"
                            : "bg-background-light hover:bg-background"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(product.id);
                        }}
                      >
                        {isExpanded ? (
                          <ArrowUp size={13} />
                        ) : (
                          <ArrowDown size={13} />
                        )}
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-background-light border-t border-border-dark">
                      <td colSpan={10} className="px-4 py-4 text-[11px]">
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                          {[
                            {
                              label: "Vendas (7 dias)",
                              value: salesPerDay.toFixed(2),
                            },
                            { label: "Estoque", value: product.stockLevel },
                            {
                              label: "Durabilidade",
                              value: daysLeft.toFixed(0),
                            },
                            {
                              label: "Qtd Comprar",
                              value: purchaseSuggestionUnits,
                            },
                            {
                              label: "Preço Médio",
                              value: `R$ ${product.price.toFixed(2)}`,
                            },
                            {
                              label: "Margem",
                              value: `${product.margin.toFixed(1)}%`,
                            },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="p-2 bg-card rounded border border-border-dark text-center"
                            >
                              <p className="font-semibold text-xs">
                                {item.value}
                              </p>
                              <p className="text-[10px] text-text-secondary text-xs">
                                {item.label}
                              </p>
                            </div>
                          ))}
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
                  className="text-center py-8 text-text-secondary"
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
        <div className="flex justify-end items-center gap-1 mt-3">
          <button
            className="p-1.5 border border-border-dark rounded disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft size={13} />
          </button>

          {Array.from({ length: computedTotalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                className={`px-2 py-1 rounded text-[11px] border border-border-dark ${
                  page === currentPage
                    ? "bg-primary text-white"
                    : "hover:bg-background-light"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            className="p-1.5 border border-border-dark rounded disabled:opacity-40"
            disabled={currentPage === computedTotalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
};
