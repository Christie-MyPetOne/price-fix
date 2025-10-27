"use client";

import React from "react"; // Import React
import Image from "next/image";
import {
  RefreshCcw,
  Eye,
  ShoppingCart,
  Snowflake,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PackageCheck,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";
import PropTypes from "prop-types";

// --- COMPONENTES DE UI (Simulando/Assumindo que existem) ---
// Estes componentes são baseados no seu tema e nos arquivos anteriores
const Button = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    let variantClass = "bg-primary text-white hover:bg-primary/90";
    if (variant === "secondary")
      variantClass = "bg-gray-700 text-gray-200 hover:bg-gray-600";
    if (variant === "outline")
      variantClass =
        "border border-border-dark bg-transparent hover:bg-background";
    if (variant === "ghost") variantClass = "hover:bg-background";
    let sizeClass = "h-10 px-4 py-2";
    if (size === "sm") sizeClass = "h-9 rounded-md px-3";
    return (
      <button
        className={`${base} ${variantClass} ${sizeClass} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    ref={ref}
    className={`h-4 w-4 rounded border-border-dark text-primary focus:ring-primary cursor-pointer bg-background ${className}`}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";

// --- Componente Status Badge ---
const StatusBadge = ({ status }) => {
  let bgColor = "bg-gray-500";
  let Icon = CheckCircle2;
  switch (status) {
    case "Ruptura":
      bgColor = "bg-error";
      Icon = XCircle;
      break;
    case "Comprar":
      bgColor = "bg-orange-500";
      Icon = ShoppingCart;
      break;
    case "Ok":
      bgColor = "bg-primary";
      Icon = CheckCircle2;
      break;
    case "Pedido":
      bgColor = "bg-blue-500";
      Icon = PackageCheck;
      break;
  }
  if (!["Ruptura", "Comprar", "Ok", "Pedido"].includes(status || "")) {
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
StatusBadge.propTypes = { status: PropTypes.string };

// --- Componente Health Badge ---
const HealthBadge = ({ health }) => {
  let textColor = "text-text-secondary";
  let Icon = AlertTriangle;
  switch (health) {
    case "Bom":
      textColor = "text-primary";
      Icon = CheckCircle2;
      break;
    case "Média":
      textColor = "text-warning";
      Icon = AlertTriangle;
      break;
    case "Ruim":
      textColor = "text-error";
      Icon = XCircle;
      break;
    case "Congelado":
      textColor = "text-blue-400";
      Icon = Snowflake;
      break;
    default:
      return <span className="text-xs text-text-secondary">-</span>;
  }
  return (
    <span
      className={`flex items-center justify-center gap-1 font-medium ${textColor}`}
    >
      <Icon size={14} /> {health}
    </span>
  );
};
HealthBadge.propTypes = { health: PropTypes.string };

// --- COMPONENTE DA TABELA ---
// NOME ALTERADO AQUI
export const PurchaseTable = ({
  loading,
  displayedProducts,
  filteredProducts, // Usado para calcular o total
  selectedItems,
  handleSelectAll,
  handleSelectItem,
  totalProducts, // Usado para o "Selecionar Todos"
  searchTerm,
  getPurchaseStatus,
  getStockHealth,
  // Props de Paginação
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  // Lógica de seleção (baseada na arquitetura do ProductTable)
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
            {/* --- ARQUITETURA DE CHECKBOX ATUALIZADA --- */}
            <th className="px-3 py-3 w-10 text-center">
              <Checkbox
                checked={allFilteredSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = isIndeterminate;
                  }
                }}
                onChange={handleSelectAll} // Conectado à prop
              />
              <span className="ml-1 text-xs text-text-secondary">
                {selectedItems.length}/{totalProducts}
              </span>
            </th>
            {/* Colunas originais mantidas */}
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

            const idealPurchaseDays = 40; // Exemplo (deve vir do estado do pai)
            const purchaseSuggestionUnits = Math.max(
              0,
              Math.ceil(
                idealPurchaseDays * salesPerDay - (product.stockLevel || 0)
              )
            );

            const purchaseStatus = getPurchaseStatus(product);
            const stockHealth = getStockHealth(product);

            return (
              <tr key={product.id} className="hover:bg-background">
                {/* --- CHECKBOX DE LINHA ATUALIZADO --- */}
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
                    onError={(e) =>
                      (e.currentTarget.src = "/images/placeholder.png")
                    }
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
                  <HealthBadge health={stockHealth} />
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="flex justify-center gap-1">
                    <Button variant="ghost" size="sm" title="Visualizar/Editar">
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

      {/* --- ARQUITETURA DE RODAPÉ (com paginação) --- */}
      <div className="flex flex-wrap justify-between items-center gap-4 text-sm p-4 border-t border-border-dark">
        <Button
          variant="secondary"
          size="sm"
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
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft size={16} />
          </Button>
          {/* Paginação Numérica (simples) */}
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
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
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
