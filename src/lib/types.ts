export interface Product {
  id: string;
  name: string;
  sales: number;
  status: "Precificado" | "Pendente" | "Erro";
  price: number;
  margin: number;
  totalProfit: number;
  workingCapital: number;
  line?: string;
  origin?: string;
  salesChannel?: string;
  supplier?: string;
  problems?: string[];
  image: string;
  cost?: number;
  salesHistory?: number[];
  profitHistory?: number[];
  stockLevel?: number;
  description?: string;
  sku?: string;
  imageUrl?: string;
  coverage?: number;
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
export interface CardVendasProps {
  Nome: string;
  Valor: string | number;
}
export interface FakeProduct {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
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

export interface PurchaseFiltersProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  stockHealthFilter: string;
  setStockHealthFilter: React.Dispatch<React.SetStateAction<string>>;
  onFilter: () => void;
  onOpenConfigModal: (selectedProducts: Product[]) => void; // ✅ passa produtos
  selectedProducts: Product[]; // ✅ lista dos produtos selecionados
}

export interface PurchaseTableProps {
  loading: boolean;
  displayedProducts: Product[];
  filteredProducts: Product[];
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  totalProducts: number;
  searchTerm: string;
  getPurchaseStatus: (product: Product) => string;
  getStockHealth: (product: Product) => string;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onAddToCart?: (product: Product) => void;
  cartItems: CartItem[];
  onRemove: (id: string) => void;
}
export interface StockConfig {
  useDefault: boolean;
  purchaseForDays: number;
  deliveryEstimateDays: number;
  healthLevels: {
    good: number;
    ruim: number; // O limite para "Ruim" (Média fica entre good e ruim)
    frozen: number; // O limite para "Congelado"
  };
}

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  cost: number;
  estimatedRevenue: number;
  estimatedProfit: number;
  supplier: string;
  description?: string;
  sku?: string;
  imageUrl?: string;
  coverageDays?: number;
  image?: string; // <- Adicione isso
  coverage?: number; // ✅ Adiciona isso
}
