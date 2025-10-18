// frontend/src/lib/types.ts

export interface Product {
  id: string;
  name: string;
  sales: number;
  status: 'Precificado' | 'Pendente' | 'Erro';
  price: number;
  margin: number;
  totalProfit: number;
  workingCapital: number; // Capital de giro
  line?: string;
  origin?: string;
  salesChannel?: string;
  supplier?: string;
  problems?: string[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

// Outras tipagens podem ser adicionadas aqui