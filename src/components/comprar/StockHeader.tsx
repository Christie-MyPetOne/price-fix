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
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full bg-background py-4 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-text">
          <ShoppingCart className="text-orange-500 flex-shrink-0" size={22} />
          <span>Comprar</span>
        </div>

        <button className="border border-border-dark text-black bg-white text-sm rounded-md px-3 sm:px-4 py-1.5 flex items-center gap-2 hover:bg-gray-50 transition w-fit">
          <CalendarDays size={18} className="flex-shrink-0" />
          <span className="font-medium whitespace-nowrap">
            Período de análise
          </span>
        </button>

        <div className="flex flex-col text-sm leading-tight text-left sm:text-right">
          <span className="font-semibold text-text">Jul 2025 - Out 2025</span>
          <span className="text-text-secondary text-xs">
            31/07/2025 - 28/10/2025
          </span>
        </div>
      </div>

      <div className="relative w-full sm:w-auto">
        <button
          onClick={() => onOpenCart?.()}
          className="flex justify-center sm:justify-normal items-center text-black gap-2 border border-border-dark bg-white px-4 py-2 rounded-md hover:bg-gray-50 transition w-full sm:w-auto relative"
          aria-haspopup="dialog"
        >
          <ShoppingCart size={18} />
          <span className="whitespace-nowrap">Lista de compras</span>

          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
