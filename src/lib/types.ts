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
