"use client";

import { CalendarDays, ShoppingCart } from "lucide-react";
import { StockHeaderProps } from "@/lib/types";

export const StockHeader: React.FC<StockHeaderProps> = ({
  cartItems,
  onOpenCart,
}) => {
  const totalItems =
    cartItems?.reduce((acc, it) => acc + (it.quantity ?? 1), 0) ?? 0;

  return (
    <div className="flex items-center justify-between w-full bg-background py-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2  text-xl font-semibold text-text">
          <ShoppingCart className="text-orange-500" size={22} />
          Comprar
        </div>

        <button className="border border-border-dark text-black bg-white text-sm rounded-md px-4 py-1.5 flex items-center gap-2 hover:bg-gray-50 transition">
          <CalendarDays size={18} />
          <span className="font-medium">Período de análise</span>
        </button>

        <div className="flex flex-col text-sm leading-tight">
          <span className="font-semibold text-text">Jul 2025 - Out 2025</span>
          <span className="text-text-secondary text-xs">
            31/07/2025 - 28/10/2025
          </span>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => onOpenCart?.()}
          className="flex items-center text-black gap-2 border border-border-dark bg-white px-4 py-1.5 rounded-md hover:bg-gray-50 transition relative"
          aria-haspopup="dialog"
        >
          <ShoppingCart size={18} />
          <span>Lista de compras</span>

          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
