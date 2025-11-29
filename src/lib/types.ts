// React e utilitários
import { Dispatch, SetStateAction } from "react";

/* --------------------------------------------------------------------------
  Tipos básicos
  - Pequenos aliases e unions usados pelo app
--------------------------------------------------------------------------- */
export type HealthStatus = "Excelente" | "Média" | "Risco" | "Parado";
export type Tab = "calculator" | "competitors" | "history";
export type AnyRow = Record<string, any>;

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
  marketplaceFee?: number;
  coverage?: number;
  freight?: number;
  freightRevenue?: number;
  shipping?: number;
  discount?: number;
  subsidy?: number;
  tax?: number;
  otherCosts?: number;
  marketplace?: string;
  createdAt: string;
  commission: number;
  saleFee: number;
  salesPerDay?: number;
  purchaseForDays?: number;
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
  Reusable component props
--------------------------------------------------------------------------- */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

/* --------------------------------------------------------------------------
  Chart component props
--------------------------------------------------------------------------- */
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
  totalCost: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  userMargin?: number; // Margem em percentual definida manualmente pelo usuário
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
  ecommerce?: string | null;
  originERP: string;
  date: string; // ISO
  status: string;
  client: Client;
  financials: FinancialDetails;
  items: SaleItem[];
  marketplace?: string;
}

export interface SaleState {
  sales: Sale[];
  loading: boolean;
  fetchSales: () => Promise<void>;
  getSaleById: (id: string) => Sale | undefined;
  filterSales: (opts: {
    q?: string;
    date?: string;
    empresa?: string;
    canal?: string;
    produto?: string;
  }) => void;
  clearFilters: () => void;
}

export interface Bucket {
  id: string;
  titulo: string;
  orders: number;
  percent: number;
  lucro: number;
  color?: string;
  barColor?: string;
  barHex?: string;
}

export interface MargensChartProps {
  buckets: Bucket[];
  legend: LegendItem[];
  onChangeSelection?: (selectedIds: string[]) => void;

  onEditRanges?: () => void;
  selectedMargemIds?: string[];
}

export interface LegendItem {
  label: string;
  range: string;
}

export interface VendasFiltersProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filterName: string, value: string) => void;
  onSelectAll?: (checked: boolean) => void;
}

export interface VendasModalProps {
  open: boolean;
  onClose: () => void;
  sale: Sale | null;
}

export interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  sparklineData: { value: number }[];
  comparedLabel?: string;
  comparedValue?: string | number;
}

export interface KpiCardPlusProps {
  title: string;
  value: string;
  change: number;
  comparedLabel?: string;
  comparedValue?: string | number;
  className?: string;
  onToggleLista?: () => void;
  listaAtiva?: boolean;
  mode: "reais" | "percentual";
  setMode: (mode: "reais" | "percentual") => void;
}

export interface GraficoMargemProps {
  title?: string;
  data: AnyRow[];
  xKey: string;
  yKey?: string;
  height?: number;
}
