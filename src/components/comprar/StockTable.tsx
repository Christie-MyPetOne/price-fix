"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  ShoppingCartIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Pencil,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  ClipboardList,
  SlidersHorizontal,
  FileDown,
} from "lucide-react";

import {
  paginate,
  sortData,
  getDaysLeft,
  getPurchaseSuggestionUnits,
} from "@/lib/utils";

import { StockTableProps, Product } from "@/lib/types";
import { useStockConfigStore } from "@/store/useStockConfigStore";
import { useOutsideClose } from "@/hooks/useOutsideClose";
import { StockHealthBadge } from "./ui/StockHealthBadge";
import { StatusBadge } from "./ui/StatusBadge";
import { ContextualActionBar } from "./ui/ContextualActionBar";

type SortKey =
  | "name"
  | "stockLevel"
  | "salesPerDay"
  | "daysLeft"
  | "purchaseSuggestionUnits"
  | "stockHealthStatus"
  | "supplier";

const StockTableSkeleton = () => (
  <div className="bg-card rounded-xl border border-border-dark shadow-lg p-4 w-full animate-pulse">
    <div className="flex justify-between items-center pb-3">
      <div className="h-8 w-48 bg-background-light rounded-md"></div>
      <div className="h-4 w-24 bg-background-light rounded-md"></div>
    </div>
    <div className="border border-border-dark rounded-lg bg-background overflow-x-auto">
      <table className="min-w-[900px] md:min-w-full table-fixed text-xs">
        <thead className="bg-background-light border-b border-border-dark">
          <tr>
            <th className="w-6 px-2 py-2.5">
              <div className="h-3.5 w-3.5 bg-background rounded-sm"></div>
            </th>
            {Array.from({ length: 7 }).map((_, i) => (
              <th key={i} className="px-3 py-4">
                <div className="h-4 bg-background rounded-md"></div>
              </th>
            ))}
            <th className="w-20 px-2 py-2.5"></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-border-dark">
              <td className="px-2 py-2 text-center">
                <div className="h-3.5 w-3.5 bg-background-light rounded-sm"></div>
              </td>
              <td className="px-2 py-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-background-light"></div>
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-background-light rounded-md"></div>
                  <div className="h-3 w-16 bg-background-light rounded-md"></div>
                </div>
              </td>
              {Array.from({ length: 6 }).map((_, j) => (
                <td key={j} className="px-2 py-3">
                  <div className="h-5 bg-background-light rounded-md"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex justify-end items-center gap-1 mt-3">
      <div className="h-7 w-7 bg-background-light rounded-md"></div>
      <div className="h-7 w-7 bg-background-light rounded-md"></div>
      <div className="h-7 w-7 bg-background-light rounded-md"></div>
    </div>
  </div>
);

export const StockTable: React.FC<StockTableProps> = ({
  loading,
  displayedProducts,
  selectedItems,
  searchTerm,
  getPurchaseStatus,
  onAddToCart,
  onRemove,
  cartItems = [],
  onOpenConfig,
  onBulkAddToCart,
  onOpenConfigModal,
  isBulkMode,
  onClearSelection,
  onExportList,
  onSelectItem,
  onSelectAll,
}) => {
  const [expandedProductId, setExpandedProductId] = useState<string | null>(
    null
  );

  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openActions, setOpenActions] = useState(false);
  const { getConfigProduto } = useStockConfigStore();
  const actionsMenuRef = useOutsideClose<HTMLDivElement>(openActions, () =>
    setOpenActions(false)
  );

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
    return <StockTableSkeleton />;
  }

  return (
    <div className="bg-card rounded-xl border border-border-dark shadow-lg p-4 w-full">
      <div className="flex justify-between items-center pb-3 ">
        <div className="flex items-center gap-4">
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
        </div>

        <p className="text-[11px] text-text-secondary">
          Selecionados:{" "}
          <span className="font-semibold text-primary">
            {selectedItems.length}
          </span>
        </p>
      </div>

      <div className="border border-border-dark rounded-lg bg-card overflow-x-auto">
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
                  onChange={onSelectAll}
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
                    className={`border-b border-border-dark transition-colors
                      ${
                        selectedItems.includes(product.id)
                          ? "bg-primary/10"
                          : "even:bg-background-light/50 hover:bg-background dark:hover:bg-background"
                      }`}
                  >
                    <td className="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(product.id)}
                        readOnly
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectItem(product.id, index, e.shiftKey);
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
                        title="Adicionar ao Carrinho"
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
                        title="Configurar Produto"
                        className="p-1.5 rounded border border-border-dark bg-background-light hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenConfig(product);
                        }}
                      >
                        <Pencil size={13} />
                      </button>

                      <button
                        title="Ver Detalhes"
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
      <ContextualActionBar
        selectedCount={selectedItems.length}
        onClearSelection={onClearSelection || (() => {})}
      >
        <div className="relative" ref={actionsMenuRef}>
          <button
            onClick={() => setOpenActions(!openActions)}
            className={`
        flex items-center gap-2 text-sm font-medium
        border border-primary bg-primary text-white
        px-4 py-2 rounded-lg shadow-sm 
        hover:bg-primary-dark hover:border-primary-dark
        focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-50
        transition-all duration-200
        ${openActions ? "bg-primary-dark" : ""}
      `}
          >
            <MoreVertical size={16} />
            <span>Ações</span>
          </button>

          {openActions && (
            <div className="absolute bottom-full mb-2 right-0 w-64 origin-bottom-right bg-card dark:bg-card-800 border border-border-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden animate-fade-slide-up">
              <div className="p-2">
                {/* 1. Opção: Listar Compras em Massa */}
                <button
                  onClick={() => {
                    if (onBulkAddToCart) onBulkAddToCart();
                    setOpenActions(false);
                  }}
                  className="w-full flex items-center gap-3 text-left px-3 py-2.5 text-sm text-text-primary hover:bg-background rounded-md transition-colors duration-150"
                >
                  <ClipboardList size={16} className="text-gray-500" />
                  <span>Listar Compras em Massa</span>
                </button>

                {/* 2. Opção: Exportar Lista de Compras */}
                <button
                  onClick={() => {
                    if (onExportList) onExportList();
                    setOpenActions(false);
                  }}
                  className="w-full flex items-center gap-3 text-left px-3 py-2.5 text-sm text-text-primary hover:bg-background rounded-md transition-colors duration-150"
                >
                  <FileDown size={16} className="text-gray-500" />
                  <span>Exportar Lista de Compras</span>
                </button>

                {/* 3. Opção: Configurar Estoque em Massa (condicional) */}
                {!isBulkMode && (
                  <button
                    onClick={() => {
                      if (onOpenConfigModal) onOpenConfigModal();
                      setOpenActions(false);
                    }}
                    className="w-full flex items-center gap-3 text-left px-3 py-2.5 text-sm text-text-primary hover:bg-background rounded-md transition-colors duration-150 border-t border-border-dark mt-2 pt-3"
                  >
                    <SlidersHorizontal size={16} className="text-gray-500" />
                    <span>Configurar Estoque em Massa</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </ContextualActionBar>
    </div>
  );
};
