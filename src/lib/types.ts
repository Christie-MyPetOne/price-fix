import { Dispatch, SetStateAction } from "react";

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  cost?: number;
  margin: number;
  totalProfit: number;
  workingCapital: number;
  sales: number;
  status: "Precificado" | "Pendente" | "Erro";
  origin?: string;
  image?: string;
  stockLevel?: number;
  salesHistory?: number[];
  profitHistory?: number[];
  supplier?: string;
  stockHealthStatus?: "Excelente" | "Média" | "Risco" | "Parado";
  stockHealthOptions?: string[];
  shipping?: number;
  marketplaceFee?: number;
  coverage?: number;
}

export interface ProductState {
  products: Product[];
  sortedProducts: Product[];
  selected: string[];
  sortConfig: { key: keyof Product | null; direction: "asc" | "desc" };

  fetchProducts: () => Promise<void>;
  toggleOne: (id: string) => void;
  toggleAll: () => void;
  sortBy: (key: keyof Product) => void;
}
export interface Venda {
  id: string;
  name: string;
  sales: number;
  status: "Precificado" | "Pendente" | "Erro";
  price: number;
  margin: number;
  consiliacao: string;
  totalProfit: number;
  workingCapital: number; // Capital de giro
  imagens: string;
  line?: string;
  salesChannel?: string;
  supplier?: string;
  problems?: string[];
}
export interface User {
  id: string;
  email: string;
  name?: string;
}
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}
export interface SparklineProps {
  data: { value: number }[];
  color?: string;
}
export interface DetailedChartProps {
  data: { name: string; value: number }[];
  color?: string;
  yAxisLabel?: string;
}
export interface ProductTableProps {
  products?: Product[];
  onRowClick: (product: Product) => void;
}
export interface ProductFiltersProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filterName: string, value: string) => void;
  onSelectAll: () => void;
}
export interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export type Tab = "calculator" | "competitors" | "history";
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "right" | "left";
}

export interface FakeProduct {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
}
export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ElementType | null;
}

export interface DropdownLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ElementType | null;
  onClick: () => void;
}

export interface StockFiltersProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  stockHealthFilter: string;
  setStockHealthFilter: React.Dispatch<React.SetStateAction<string>>;
  onFilter: () => void;
  onOpenConfigModal: (selectedProducts: Product[]) => void; // ✅ passa produtos
  selectedProducts: Product[]; // ✅ lista dos produtos selecionados
}

export interface StockTableProps {
  loading: boolean;
  displayedProducts: Product[]; // Esta é a lista COMPLETA e FILTRADA do pai
  selectedItems: string[];
  setSelectedItems: Dispatch<SetStateAction<string[]>>;
  searchTerm: string; // Usado para resetar a página no filtro
  getPurchaseStatus: (product: Product) => string;
  onAddToCart: (product: Product) => void;
  onRemove: (id: string) => void;
  cartItems: CartItem[];
  onOpenConfig: (product: Product) => void;
}
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
  price: number;
  cost: number;
  quantity: number;
  supplier: string;
  description?: string;
  estimatedRevenue: number;
  estimatedProfit: number;
  coverage?: number;
}

export interface StockHeaderProps {
  cartItems: CartItem[];
  onRemove?: (id: string) => void;
  onAddToCart?: (product: Product) => void;
  onOpenCart?: () => void;
}

export interface StockConfigModalProps {
  open: boolean;
  onClose: () => void;
  products?: Product[];
  config: StockConfig;
  onSave: (newConfig: StockConfig) => void;
}