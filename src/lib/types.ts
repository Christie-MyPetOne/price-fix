// React e utilitários
import { Dispatch, SetStateAction } from "react";

/* -----------------------------------------------
 Tipos básicos e genéricos
----------------------------------------------- */

// Estado de saúde do estoque
export type HealthStatus = "Excelente" | "Média" | "Risco" | "Parado";

// Aba ativa em uma interface com múltiplas seções
export type Tab = "calculator" | "competitors" | "history";

/* -----------------------------------------------
 Modelos principais de dados
----------------------------------------------- */

// Produto principal utilizado no sistema
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

// Modelo alternativo para exibição de vendas
export interface Venda {
  id: string;
  name: string;
  sales: number;
  status: "Precificado" | "Pendente" | "Erro";
  price: number;
  margin: number;
  consiliacao: string;
  totalProfit: number;
  workingCapital: number;
  imagens: string;
  line?: string;
  salesChannel?: string;
  supplier?: string;
  problems?: string[];
}

// Dados do usuário logado
export interface User {
  id: string;
  email: string;
  name?: string;
}

// Produto genérico usado em mocks ou exemplos
export interface FakeProduct {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
}

/* -----------------------------------------------
 Estado global e gerenciamento (Zustand)
----------------------------------------------- */

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

/* -----------------------------------------------
 Estoque e compras
----------------------------------------------- */

// Configurações do cálculo de estoque
export interface StockConfig {
  comprarPara: number;
  entregaEstimada: number;
  excelente: number;
  moderado: number;
  risco: number;
  parado: number;
}

// Item presente no carrinho de compras
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

/* -----------------------------------------------
 Props de componentes reutilizáveis
----------------------------------------------- */

// Botão genérico com variantes
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

// Filtros da tabela de estoque
export interface StockFiltersProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  stockHealthFilter: HealthStatus | "";
  setStockHealthFilter: Dispatch<SetStateAction<HealthStatus | "">>;
  onFilter: () => void;
  onOpenConfigModal: (selectedProducts: Product[]) => void;
  selectedProducts: Product[];
}

// Cabeçalho da página de estoque (ícone do carrinho e período)
export interface StockHeaderProps {
  cartItems: CartItem[];
  onRemove?: (id: string) => void;
  onAddToCart?: (product: Product) => void;
  onOpenCart?: () => void;
}

// Tabela principal de estoque
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

// Cartão com status do estoque
export interface StockStatusCardProps {
  products: Product[];
  getPurchaseStatus: (product: Product) => string;
  stockConfig: StockConfig;
}

// Cartão de saúde do estoque
export interface StockHealthCardProps {
  stockConfig: StockConfig;
  onConfigClick: () => void;
}

// Modal de configuração de estoque
export interface StockConfigModalProps {
  open: boolean;
  onClose: () => void;
  products?: Product[];
  config: StockConfig;
  onSave?: (config: StockConfig) => void;
}

// Modal do carrinho de compras
export interface ShoppingCartModalProps {
  open: boolean;
  cartItems: CartItem[];
  onRemove: (id: string) => void;
  onClose: () => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
}

/* -----------------------------------------------
 Componentes de gráfico
----------------------------------------------- */

// Dados para o gráfico de status do estoque
export interface ChartDataItem {
  status: string;
  count: number;
  totalValue: number;
  percentage: number;
  color: string;
  icon: React.ElementType;
}

// Sparkline (gráfico pequeno)
export interface SparklineProps {
  data: { value: number }[];
  color?: string;
}

// Gráfico detalhado com eixo Y
export interface DetailedChartProps {
  data: { name: string; value: number }[];
  color?: string;
  yAxisLabel?: string;
}

/* -----------------------------------------------
 Navegação e layout
----------------------------------------------- */

// Drawer (menu lateral)
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "right" | "left";
}

// Links de navegação
export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ElementType | null;
}

// Links dentro de dropdowns
export interface DropdownLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ElementType | null;
  onClick: () => void;
}

/* -----------------------------------------------
 Componentes auxiliares
----------------------------------------------- */

// Tabela de produtos genérica
export interface ProductTableProps {
  products?: Product[];
  onRowClick: (product: Product) => void;
}

// Filtros de produtos (busca, filtro e seleção)
export interface ProductFiltersProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filterName: string, value: string) => void;
  onSelectAll: () => void;
}

// Modal de detalhes de um produto
export interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}
