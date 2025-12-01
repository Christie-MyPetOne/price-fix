import type { Sale, Product } from "@/lib/types";

export interface CalculadoraMargemProps {
  product?: Product | null;
}

export interface ResumoCardsProps {
  sales: Sale[];
}

export interface VendasTableProps {
  sales: Sale[];
  selectedMargemIds: string[];
}
