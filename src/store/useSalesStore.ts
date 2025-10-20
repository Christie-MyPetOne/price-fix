"use client";
import { create } from "zustand";
import axios from "axios";
// Tipagem do pedido
export interface Customer {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
}
export interface SaleItem {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  price: number;
}
export interface Sale {
  id: string; // orderId
  customer: Customer;
  items: SaleItem[];
  totalAmount: number;
  status: string;
  orderDate: string;
}
interface SalesState {
  sales: Sale[];
  fetchSales: (length?: number) => Promise<void>; // length opcional
}
export const useSalesStore = create<SalesState>((set) => ({
  sales: [],
  fetchSales: async (length = 1000) => {
    // Se não passar length, pega 1000 registros por padrão
    try {
      const res = await axios.get<Sale[]>(
        `https://fake.jsonmockapi.com/orders?length=${length}`
      );
      set({ sales: res.data });
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      set({ sales: [] });
    }
  },
}));