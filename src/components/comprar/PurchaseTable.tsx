"use client";

import React from "react";
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
} from "lucide-react";
import { PurchaseTableProps } from "@/lib/types";
import { Checkbox } from "../ui/CheckBox";
import { Button } from "../ui/Button";
import { ProductHealthIcons } from "../produtos/ProductHealthIcons";

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
  handleSelectAll,
  handleSelectItem,
  totalProducts,
  searchTerm,
  getPurchaseStatus,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const allFilteredSelected =
    totalProducts > 0 && selectedItems.length === totalProducts;
  const isIndeterminate = selectedItems.length > 0 && !allFilteredSelected;

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
    <div className="overflow-x-auto w-full bg-card rounded-lg border border-border-dark shadow-sm">
      <table className="min-w-full divide-y divide-border-dark text-sm">
        <thead className="bg-background">
          <tr>
            <th className="px-3 py-3 w-10 text-center">
              <Checkbox
                checked={allFilteredSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={handleSelectAll}
              />
              <span className="ml-1 text-xs text-text-secondary">
                {selectedItems.length}/{totalProducts}
              </span>
            </th>
            <th className="px-3 py-3 text-left font-medium text-text-secondary">
              Produto
            </th>
            <th className="px-3 py-3 text-right font-medium text-text-secondary">
              Estoque Atual
            </th>
            <th className="px-3 py-3 text-right font-medium text-text-secondary">
              Vendas /dia
            </th>
            <th className="px-3 py-3 text-right font-medium text-text-secondary">
              Vai durar /dias
            </th>
            <th className="px-3 py-3 text-right font-medium text-text-secondary">
              Comprar para /dias
            </th>
            <th className="px-3 py-3 text-right font-medium text-text-secondary">
              Comprar (un e status)
            </th>
            <th className="px-3 py-3 text-center font-medium text-text-secondary">
              Saúde do estoque
            </th>
            <th className="px-3 py-3 text-center font-medium text-text-secondary">
              Ações
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border-dark">
          {displayedProducts.map((product) => {
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

            return (
              <tr key={product.id} className="hover:bg-background">
                <td className="px-3 py-2 text-center">
                  <Checkbox
                    checked={selectedItems.includes(product.id)}
                    onChange={() => handleSelectItem(product.id)}
                  />
                </td>
                <td className="px-3 py-2 flex items-center gap-2">
                  <Image
                    src={product.image || "/images/placeholder.png"}
                    alt={product.name}
                    width={32}
                    height={32}
                    className="rounded object-cover"
                  />
                  <div>
                    <p className="font-medium text-text">{product.name}</p>
                    <p className="text-xs text-text-secondary">{product.id}</p>
                  </div>
                </td>
                <td className="px-3 py-2 text-right">
                  {product.stockLevel ?? "-"}
                </td>
                <td className="px-3 py-2 text-right">
                  {salesPerDay.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-3 py-2 text-right">
                  {isFinite(daysLeft)
                    ? daysLeft.toLocaleString("pt-BR", {
                        maximumFractionDigits: 0,
                      })
                    : "∞"}
                </td>
                <td className="px-3 py-2 text-right">{idealPurchaseDays}</td>
                <td className="px-3 py-2 text-right">
                  <p className="font-semibold">{purchaseSuggestionUnits}</p>
                  <StatusBadge status={purchaseStatus} />
                </td>
                <td className="px-3 py-2 text-center">
                  <ProductHealthIcons product={product} />
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="flex justify-center gap-1">
                    <Button
                      variant="outline"
                      className="h-8 px-2 text-xs flex items-center gap-1"
                      title="Visualizar/Editar"
                    >
                      <Eye size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}

          {displayedProducts.length === 0 && (
            <tr>
              <td colSpan={9} className="text-center py-10 text-text-secondary">
                {searchTerm
                  ? "Nenhum produto encontrado para sua busca."
                  : "Nenhum produto para exibir."}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex flex-wrap justify-between items-center gap-4 text-sm p-4 border-t border-border-dark">
        <Button
          variant="secondary"
          onClick={handleSelectAll}
          disabled={totalProducts === 0}
          className="text-xs"
        >
          {allFilteredSelected
            ? "Desmarcar Todos"
            : `Selecionar todos os ${totalProducts} itens`}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft size={16} />
          </Button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum = currentPage <= 3 ? i + 1 : currentPage + i - 2;
            if (pageNum > totalPages) pageNum = totalPages - (4 - i);
            if (pageNum < 1) pageNum = i + 1;
            if (
              i > 0 &&
              pageNum <= (currentPage <= 3 ? i : currentPage + i - 3)
            )
              return null;

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "primary" : "outline"}
                className="w-8 h-8 p-0"
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
