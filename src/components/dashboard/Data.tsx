"use client";

import { DollarSign, ShoppingBag, TrendingUp } from "lucide-react";

// === DADOS KPI ===
export const kpiData = [
  {
    title: "Faturamento Total",
    value: "R$ 489.7K",
    change: 12.5,
    sparklineData: [
      { value: 10 }, { value: 15 }, { value: 12 },
      { value: 18 }, { value: 20 }, { value: 25 }, { value: 23 },
    ],
    icon: DollarSign,
  },
  {
    title: "Lucro Líquido",
    value: "R$ 112.3K",
    change: -2.1,
    sparklineData: [
      { value: 30 }, { value: 28 }, { value: 32 },
      { value: 25 }, { value: 26 }, { value: 22 }, { value: 24 },
    ],
    icon: TrendingUp,
  },
  {
    title: "Pedidos",
    value: "8,942",
    change: 5.7,
    sparklineData: [
      { value: 5 }, { value: 6 }, { value: 9 },
      { value: 7 }, { value: 8 }, { value: 10 }, { value: 12 },
    ],
    icon: ShoppingBag,
  },
];

export const kpiData2 = [
  {
    title: "Margem de contribuição nominal",
    value: "R$ 489.7K",
    change: 12.5,
    sparklineData: [
      { value: 10 }, { value: 15 }, { value: 12 },
      { value: 18 }, { value: 20 }, { value: 25 }, { value: 23 },
    ],
    icon: DollarSign,
  },
  {
    title: "Margem de contribuição média",
    value: "R$ 112.3K",
    change: -2.1,
    sparklineData: [
      { value: 30 }, { value: 28 }, { value: 32 },
      { value: 25 }, { value: 26 }, { value: 22 }, { value: 24 },
    ],
    icon: TrendingUp,
  },
];

export const kpiDataPlus = [
  {
    title: "Custos variáveis",
    value: "R$ 489.7K",
    change: 12.5,
    sparklineData: [
      { value: 10 }, { value: 15 }, { value: 12 },
      { value: 18 }, { value: 20 }, { value: 25 }, { value: 23 },
    ],
    icon: DollarSign,
  },
];

// === DADOS DE RECEITA POR MARKETPLACE ===
export const revenueByMarketplaceData = [
  { name: "Mercado Livre", Faturamento: 185000 },
  { name: "Shopee", Faturamento: 125000 },
  { name: "Amazon", Faturamento: 95000 },
  { name: "Magazine Luiza", Faturamento: 65000 },
  { name: "Loja Própria", Faturamento: 25000 },
];

// === DADOS DE TOP MARKETPLACES ===
export const topMarketplacesData = [
  { source: "Mercado Livre", faturamento: "R$ 185K", vendas: "3.1k", margem: "28.5%", lucro: "R$ 52.7K" },
  { source: "Shopee", faturamento: "R$ 125K", vendas: "4.2k", margem: "19.2%", lucro: "R$ 24.0K" },
  { source: "Amazon", faturamento: "R$ 95K", vendas: "1.2k", margem: "35.1%", lucro: "R$ 33.3K" },
  { source: "Magazine Luiza", faturamento: "R$ 65K", vendas: "850", margem: "22.4%", lucro: "R$ 14.5K" },
];

// === DADOS DO GRÁFICO DE RECEITA POR CANAL ===
export const receitaPorCanal = [
  { date: "13/10/25", base: 80000, one: 70000, shopee: 85000, store: 45000, mypet: 30000, amazon: 0, full: 0 },
  { date: "14/10/25", base: 65000, one: 55000, shopee: 60000, store: 35000, mypet: 40000, amazon: 0, full: 0 },
  { date: "15/10/25", base: 60000, one: 50000, shopee: 58000, store: 32000, mypet: 38000, amazon: 0, full: 0 },
  { date: "16/10/25", base: 70000, one: 62000, shopee: 65000, store: 40000, mypet: 35000, amazon: 0, full: 0 },
  { date: "17/10/25", base: 75000, one: 68000, shopee: 70000, store: 42000, mypet: 36000, amazon: 0, full: 0 },
  { date: "18/10/25", base: 68000, one: 58000, shopee: 63000, store: 38000, mypet: 34000, amazon: 0, full: 0 },
  { date: "19/10/25", base: 72000, one: 61000, shopee: 67000, store: 39000, mypet: 37000, amazon: 0, full: 0 },
  { date: "20/10/25", base: 77000, one: 66000, shopee: 73000, store: 43000, mypet: 35000, amazon: 0, full: 0 },
  { date: "21/10/25", base: 74000, one: 63000, shopee: 69000, store: 41000, mypet: 33000, amazon: 0, full: 0 },
  { date: "22/10/25", base: 79000, one: 70000, shopee: 76000, store: 44000, mypet: 36000, amazon: 0, full: 0 },
  { date: "23/10/25", base: 71000, one: 59000, shopee: 64000, store: 37000, mypet: 32000, amazon: 0, full: 0 },
  { date: "24/10/25", base: 66000, one: 56000, shopee: 61000, store: 36000, mypet: 31000, amazon: 0, full: 0 },
];

export const series = [
  { key: "base",   label: "Base",              color: "#f59e0b", total: 11513 },
  { key: "one",    label: "MYPET ONE",         color: "#8b5cf6", total: 8267 },
  { key: "shopee", label: "Shopee",            color: "#10b981", total: 9566 },
  { key: "store",  label: "MYPETONE STORE",    color: "#84cc16", total: 8268 },
  { key: "mypet",  label: "MY.PET.ONE",        color: "#DBD527", total: 7706 },
  { key: "amazon", label: "Amazon",            color: "#60C3DB", total: 9804 },
  { key: "full",   label: "MY.PET.ONE - FULL", color: "#3b82f6", total: 8544 },
];



// === DADOS DO GRÁFICO DE PEDIDOS x RECEITA ===
export const pedidosReceita = [
  { mes: "Jan", pedidos: 120, receita: 2500 },
  { mes: "Fev", pedidos: 150, receita: 10000 },
  { mes: "Mar", pedidos: 180, receita: 4000 },
  { mes: "Abr", pedidos: 100, receita: 2200 },
  { mes: "Mai", pedidos: 200, receita: 5000 },
  { mes: "Jun", pedidos: 170, receita: 4200 },
];

// === DADOS DE MARGEM ===
export const dataMargem = [
  { date: "13/10/25", margem: 32 },
  { date: "14/10/25", margem: 28 },
  { date: "15/10/25", margem: 30 },
  { date: "16/10/25", margem: 27 },
];
