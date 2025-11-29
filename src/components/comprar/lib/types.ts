// React e utilitários
import { Dispatch, SetStateAction } from "react";
import { Product, HealthStatus } from "../../../lib/types";

/* --------------------------------------------------------------------------
  Stock / cart models
--------------------------------------------------------------------------- */
export interface StockConfig {
  comprarPara: number;
  entregaEstimada: number;
  excelente: number;
  moderado: number;
  risco: number;
  parado: number;
}

export interface CartItem {
  id: string;
  name: string;
  sku: string;
  image: string;
  price?: number;
  cost: number;
  quantity: number;
  supplier: string;
  description?: string;
  estimatedRevenue: number;
  estimatedProfit: number;
  coverage?: number;
}

/* --------------------------------------------------------------------------
  Reusable component props
--------------------------------------------------------------------------- */
export interface StockFiltersProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  supplierFilter: string;
  setSupplierFilter: Dispatch<SetStateAction<string>>;
  purchaseStatusFilter: string;
  setPurchaseStatusFilter: Dispatch<SetStateAction<string>>;
  stockHealthFilter: HealthStatus | "";
  setStockHealthFilter: Dispatch<SetStateAction<HealthStatus | "">>;
  stockLevelRange: { min: string; max: string };
  setStockLevelRange: Dispatch<SetStateAction<{ min: string; max: string }>>;
  salesPerDayRange: { min: string; max: string };
  setSalesPerDayRange: Dispatch<SetStateAction<{ min: string; max: string }>>;
  daysLeftRange: { min: string; max: string };
  setDaysLeftRange: Dispatch<SetStateAction<{ min: string; max: string }>>;
  purchaseForDaysRange: { min: string; max: string };
  setPurchaseForDaysRange: Dispatch<SetStateAction<{ min: string; max: string }>>;
  stockAlertFilter: string;
  setStockAlertFilter: Dispatch<SetStateAction<string>>;
  zeroStockOnly: boolean;
  setZeroStockOnly: Dispatch<SetStateAction<boolean>>;
  abcFilter: string;
  setAbcFilter: Dispatch<SetStateAction<string>>;
  productTypeFilter: string;
  setProductTypeFilter: Dispatch<SetStateAction<string>>;
  profitMarginRange: { min: string; max: string };
  setProfitMarginRange: Dispatch<SetStateAction<{ min: string; max: string }>>;
  onlySelected: boolean;
  setOnlySelected: Dispatch<SetStateAction<boolean>>;
}

export interface StockHeaderProps {
  cartItems: CartItem[];
  onRemove?: (id: string) => void;
  onAddToCart?: (product: Product) => void;
  onOpenCart?: () => void;
}

export interface StockTableProps {
  loading: boolean;
  displayedProducts: Product[];
  selectedItems: string[];
  searchTerm: string;
  getPurchaseStatus: (product: Product) => string;
  onAddToCart: (product: Product) => void;
  onRemove: (id: string) => void;
  cartItems: CartItem[];
  onOpenConfig: (product: Product) => void;
  onOpenConfigModal?: () => void;
  onBulkAddToCart?: () => void;
  isBulkMode?: boolean;
  onClearSelection?: () => void;
  onExportList?: () => void;
  onSelectItem: (id: string, index: number, shiftKey?: boolean) => void;
  onSelectAll: () => void;
}

export interface StockStatusCardProps {
  products: Product[];
  getPurchaseStatus: (product: Product) => string;
  stockConfig: StockConfig;
}

export interface StockHealthCardProps {
  stockConfig: StockConfig;
  onConfigClick: () => void;
}

export interface StockConfigModalProps {
  open: boolean;
  onClose: () => void;
  products?: Product[];
  config: StockConfig;
  onSave?: (config: StockConfig) => void;
}

export interface ShoppingCartModalProps {
  open: boolean;
  cartItems: CartItem[];
  onRemove: (id: string) => void;
  onClose: () => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
}

/* --------------------------------------------------------------------------
  Chart component props
--------------------------------------------------------------------------- */
export interface ChartDataItem {
  status: string;
  count: number;
  totalValue: number;
  percentage: number;
  color: string;
  icon: React.ElementType;
}