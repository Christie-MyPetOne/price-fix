"use client";

import { useState } from "react";
import { ShoppingCart, Truck } from "lucide-react";
import { StockHeaderProps } from "@/lib/types";
import { SupplierList } from "@/components/comprar/SupplierList";
import { DateRangeStock } from "./DateRangeStock";

export const StockHeader: React.FC<StockHeaderProps> = ({
  cartItems,
  onOpenCart,
}) => {
  const [isSupplierListOpen, setIsSupplierListOpen] = useState(false);

  const totalItems =
    cartItems?.reduce((acc, it) => acc + (it.quantity ?? 1), 0) ?? 0;

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full bg-background px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
        <DateRangeStock />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button
          onClick={() => onOpenCart?.()}
          className="relative flex justify-center sm:justify-normal items-center text-black gap-2 border border-border-dark bg-white px-4 py-2 rounded-md hover:bg-gray-50 transition w-full sm:w-auto"
          aria-haspopup="dialog"
        >
          <ShoppingCart size={18} className="text-primary" />
          <span className="whitespace-nowrap font-medium">
            Lista de compras
          </span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsSupplierListOpen(true)}
          className="flex justify-center items-center text-black gap-2 border border-border-dark bg-white px-4 py-2 rounded-md hover:bg-gray-50 transition w-full sm:w-auto"
        >
          <Truck size={18} className="text-primary" />
          <span className="whitespace-nowrap font-medium ">
            Sugestões do fornecedor
          </span>
        </button>
      </div>

      <SupplierList
        isOpen={isSupplierListOpen}
        onClose={() => setIsSupplierListOpen(false)}
      />
    </header>
  );
};
