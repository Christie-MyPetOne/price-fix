"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import {
  RefreshCcw,
  Eye,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  PackageCheck,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Pencil,
} from "lucide-react";
import { PurchaseTableProps } from "@/lib/types";
import { toggleSelectAll, toggleSelection, sortData } from "@/lib/utils";
import { ProductHealthIcons } from "../produtos/ProductHealthIcons";
import { PurchaseConfigModal } from "../comprar/PurchaseConfigModal";

const StatusBadge = ({ status }: { status?: string }) => {
  let bgColor = "bg-gray-500";
  let Icon = CheckCircle2;

  switch (status) {
    case "Sem Estoque":
      bgColor = "bg-red-500";
      Icon = XCircle;
      break;
    case "Reposição":
      bgColor = "bg-orange-500";
      Icon = ShoppingCart;
      break;
    case "Estável":
      bgColor = "bg-green-600";
      Icon = CheckCircle2;
      break;
    case "Encomendado":
      bgColor = "bg-blue-500";
      Icon = PackageCheck;
      break;
  }

  if (
    !["Sem Estoque", "Reposição", "Estável", "Encomendado"].includes(
      status || ""
    )
  ) {
    return <span className="text-xs text-text-secondary">-</span>;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-white ${bgColor}`}
    >
      <Icon size={12} /> {status}
    </span>
  );
};

export const PurchaseTable: React.FC<PurchaseTableProps> = ({
  loading,
  displayedProducts,
  selectedItems,
  setSelectedItems,
  totalProducts,
  searchTerm,
  getPurchaseStatus,
  onAddToCart,
  onRemove,
  cartItems = [],
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [highlightedCartProducts, setHighlightedCartProducts] = useState<
    string[]
  >([]);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof displayedProducts)[0] | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  useEffect(() => {
    const ids = cartItems.map((item) => item.id);
    setHighlightedCartProducts(ids);
  }, [cartItems]);

  const handleSort = (key: keyof (typeof displayedProducts)[0]) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const orderedProducts = useMemo(() => {
    if (!sortConfig.key) return displayedProducts;
    return sortData(displayedProducts, sortConfig.key, sortConfig.direction);
  }, [displayedProducts, sortConfig]);

  const totalPages = Math.max(
    1,
    Math.ceil(orderedProducts.length / rowsPerPage)
  );
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return orderedProducts.slice(start, end);
  }, [orderedProducts, currentPage, rowsPerPage]);

  const allFilteredSelected =
    totalProducts > 0 && selectedItems.length === totalProducts;
  const isIndeterminate = selectedItems.length > 0 && !allFilteredSelected;

  const handleSelectAll = () => {
    setSelectedItems((prev) => toggleSelectAll(paginatedProducts, prev));
  };

  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );

  const handleSelectItem = (id: string, event?: React.MouseEvent) => {
    const currentIndex = paginatedProducts.findIndex((p) => p.id === id);

    if (event?.shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, currentIndex);
      const end = Math.max(lastSelectedIndex, currentIndex);
      const idsInRange = paginatedProducts
        .slice(start, end + 1)
        .map((p) => p.id);

      setSelectedItems((prev) => {
        const merged = new Set([...prev, ...idsInRange]);
        return Array.from(merged);
      });
    } else {
      setSelectedItems((prev) => toggleSelection(prev, id));
      setLastSelectedIndex(currentIndex);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedProductId((prev) => (prev === id ? null : id));
  };

  const handleToggleCart = (product: any) => {
    const isInCart = highlightedCartProducts.includes(product.id);

    const cartItem = {
      ...product,
      image: product.image || "",
      quantity: 1,
    };

    if (isInCart) {
      onRemove?.(product.id);
    } else {
      onAddToCart?.(cartItem);
    }
  };

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
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-bold text-text-secondary flex items-center gap-2">
          Mostrar
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-border-dark text-xs rounded px-1 py-1 ml-2"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          itens
        </label>

        <p className="text-xs text-text-secondary hidden sm:block">
          Mostrando{" "}
          <span className="font-medium">
            {(currentPage - 1) * rowsPerPage + 1}
          </span>{" "}
          a{" "}
          <span className="font-medium">
            {Math.min(currentPage * rowsPerPage, orderedProducts.length)}
          </span>{" "}
          de <span className="font-medium">{orderedProducts.length}</span>{" "}
          resultados
        </p>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-border-dark text-sm">
          <thead className="bg-background">
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
              {[
                { key: "name", label: "Produto" },
                { key: "stockLevel", label: "Estoque Atual" },
                { key: "sales", label: "Vendas/dia" },
                { key: "daysLeft", label: "Vai durar /dias" },
                { key: "purchaseSuggestionUnits", label: "Comprar" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() =>
                    handleSort(key as keyof (typeof displayedProducts)[0])
                  }
                  className="px-3 py-3 text-left font-medium text-text-secondary cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <ArrowUpDown
                      size={14}
                      className={`transition-transform ${
                        sortConfig.key === key
                          ? "text-primary"
                          : "text-gray-400"
                      } ${
                        sortConfig.key === key && sortConfig.direction === "asc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                </th>
              ))}
              <th className="px-3 py-3 text-center font-medium text-text-secondary">
                Saúde
              </th>
              <th className="px-3 py-3 text-center font-medium text-text-secondary">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-dark">
            {paginatedProducts.map((product) => {
              const salesPerDay = product.salesHistory
                ? product.salesHistory.reduce((a, b) => a + b, 0) /
                  (product.salesHistory.length || 1)
                : 0;

              const daysLeft =
                product.stockLevel && salesPerDay > 0
                  ? product.stockLevel / salesPerDay
                  : Infinity;

              const idealPurchaseDays = 40;
              const purchaseSuggestionUnits = Math.max(
                0,
                Math.ceil(
                  idealPurchaseDays * salesPerDay - (product.stockLevel || 0)
                )
              );

              const purchaseStatus = getPurchaseStatus(product);
              const isExpanded = expandedProductId === product.id;
              const isInCart = highlightedCartProducts.includes(product.id);

              return (
                <React.Fragment key={product.id}>
                  <tr className="hover:bg-background">
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(product.id)}
                        onChange={(e) =>
                          handleSelectItem(
                            product.id,
                            e.nativeEvent as unknown as React.MouseEvent
                          )
                        }
                        className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer bg-white"
                      />
                    </td>

                    <td className="px-3 py-2 flex items-center gap-2">
                      <div className="w-9 h-9 flex-shrink-0 relative">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-border-dark rounded flex items-center justify-center">
                            <span className="text-xs text-text-secondary"></span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-text">
                          {product.name}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {product.id}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-2 text-right text-xs">
                      {product.stockLevel ?? "-"}
                    </td>
                    <td className="px-3 py-2 text-right text-xs">
                      {salesPerDay.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right text-xs">
                      {isFinite(daysLeft) ? daysLeft.toFixed(0) : "∞"}
                    </td>
                    <td className="px-3 py-2 text-right text-xs">
                      <p className="font-semibold">{purchaseSuggestionUnits}</p>
                      <StatusBadge status={purchaseStatus} />
                    </td>

                    <td className="px-3 py-2 text-center">
                      <ProductHealthIcons product={product} />
                    </td>

                    {/* Ícones de ação */}
                    <td className="px-3 py-2 flex items-center justify-center gap-2">
                      <button
                        className={`p-1 border-none rounded transition ${
                          isInCart
                            ? "bg-green-100 text-green-700"
                            : "hover:bg-background"
                        }`}
                        title={
                          isInCart ? "Remover da lista" : "Adicionar à lista"
                        }
                        onClick={() => handleToggleCart(product)}
                      >
                        <ShoppingCart size={16} />
                      </button>
                      <button
                        className="p-1 border-none hover:bg-background rounded transition"
                        title="Editar saúde de estoque"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="p-1 border-none hover:bg-background rounded transition"
                        title="Ver detalhes"
                        onClick={() => toggleExpand(product.id)}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-background-light border-t border-border-dark">
                      <td colSpan={9} className="px-6 py-4 text-xs text-text">
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
                  colSpan={9}
                  className="text-center py-10 text-text-secondary"
                >
                  {searchTerm
                    ? "Nenhum produto encontrado para sua busca."
                    : "Nenhum produto para exibir."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal individual */}
      {selectedProduct && (
        <PurchaseConfigModal
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Paginação */}
      <div className="flex items-center justify-between border-t border-border-dark bg-card px-4 py-3 mt-2">
        <div className="flex gap-2">
          <button
            className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
          ))}
          <button
            className="p-2 rounded-md ring-1 ring-border-dark hover:bg-background"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
