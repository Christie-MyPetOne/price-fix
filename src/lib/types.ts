// React e utilitários
import { Dispatch, SetStateAction } from "react";

/* --------------------------------------------------------------------------
  Tipos básicos
  - Pequenos aliases e unions usados pelo app
--------------------------------------------------------------------------- */
export type HealthStatus = "Excelente" | "Média" | "Risco" | "Parado";
export type Tab = "calculator" | "competitors" | "history";

/* --------------------------------------------------------------------------
  Product-related models
--------------------------------------------------------------------------- */
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
  stockHealthStatus?: HealthStatus;
  stockHealthOptions?: string[];
  shipping?: number;
  marketplaceFee?: number;
  coverage?: number;
}

/* --------------------------------------------------------------------------
  Product store state (Zustand)
--------------------------------------------------------------------------- */
export interface ProductState {
  products: Product[];
  sortedProducts: Product[];
  selected: string[];
  sortConfig: { key: null | keyof Product; direction: "asc" | "desc" };

  fetchProducts: () => Promise<void>;
  toggleOne: (id: string) => void;
  toggleAll: () => void;
  updateProductHealthStatus: (id: string, status: HealthStatus) => void;
  sortBy: (key: keyof Product) => void;
}

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
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export interface StockFiltersProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  stockHealthFilter: HealthStatus | "";
  setStockHealthFilter: Dispatch<SetStateAction<HealthStatus | "">>;
  onFilter: () => void;
  onOpenConfigModal: (selectedProducts: Product[]) => void;
  selectedProducts: Product[];
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
  setSelectedItems: Dispatch<SetStateAction<string[]>>;
  searchTerm: string;
  getPurchaseStatus: (product: Product) => string;
  onAddToCart: (product: Product) => void;
  onRemove: (id: string) => void;
  cartItems: CartItem[];
  onOpenConfig: (product: Product) => void;
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

export interface SparklineProps {
  data: { value: number }[];
  color?: string;
}

export interface DetailedChartProps {
  data: { name: string; value: number }[];
  color?: string;
  yAxisLabel?: string;
}

/* --------------------------------------------------------------------------
  Layout / navigation props
--------------------------------------------------------------------------- */
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "right" | "left";
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

/* --------------------------------------------------------------------------
  Product UI props
--------------------------------------------------------------------------- */
export interface ProductTableProps {
  products?: Product[];
}

export interface ProductFiltersProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filterName: string, value: string) => void;
  onSelectAll: () => void;
}

export interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

/* --------------------------------------------------------------------------
  Sales / Venda related types
--------------------------------------------------------------------------- */
export interface SaleItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  image: string;

  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Client {
  nome: string;
  tipo_pessoa: "F" | "J";
  cpf_cnpj: string;
  ie?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  uf?: string;
  fone?: string;
  email?: string;
}

export interface FinancialDetails {
  base_icms: number;
  valor_icms: number;
  base_icms_st: number;
  valor_icms_st: number;
  valor_servicos: number;
  valor_produtos: number;
  valor_frete: number;
  valor_seguro: number;
  valor_outras: number;
  valor_ipi: number;
  valor_issqn: number;
  valor_nota: number;
  valor_desconto: number;
  valor_faturado: number;
  fretePorConta: string;
}

export interface Sale {
  id: string;
  erpId: string;
  ecommerceId?: string | null;
  originERP: string;
  date: string; // ISO
  status: string;
  client: Client;
  financials: FinancialDetails;
  items: SaleItem[];
}

export interface SaleState {
  sales: Sale[];
  loading: boolean;
  fetchSales: () => Promise<void>;
  getSaleById: (id: string) => Sale | undefined;
  filterSales: (opts: { q?: string; date?: string; empresa?: string; canal?: string; produto?: string }) => void;
  clearFilters: () => void;
}

