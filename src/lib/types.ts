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
  
}

export interface Venda {
  id: string;
  name: string;
  sales: number;
  status: 'Precificado' | 'Pendente' | 'Erro';
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

