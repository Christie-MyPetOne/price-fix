"use client";

import React from "react";
import { DashFilter } from "@/components/dashboard/DashFilter";
import KpiCard from "@/components/dashboard/kpiCard";
import GraficoBar from "@/components/dashboard/GraficoBar";
import GraficoPeR from "@/components/dashboard/GraficoPeR";
import GraficoMargen from "@/components/dashboard/GraficoMargen";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Activity,
} from "lucide-react";
import GraficoMargem from "@/components/dashboard/GraficoMargen";


// --- DADOS SIMULADOS (Substitua pela sua chamada de API) ---

const kpiData = [
  {
    title: "Faturamento Total",
    value: "R$ 489.7K",
    change: 12.5,
    sparklineData: [
      { value: 10 }, { value: 15 }, { value: 12 }, { value: 18 },
      { value: 20 }, { value: 25 }, { value: 23 },
    ],
    icon: DollarSign,
  },
  {
    title: "Lucro Líquido",
    value: "R$ 112.3K",
    change: -2.1,
    sparklineData: [
      { value: 30 }, { value: 28 }, { value: 32 }, { value: 25 },
      { value: 26 }, { value: 22 }, { value: 24 },
    ],
    icon: TrendingUp,
  },
  {
    title: "Pedidos",
    value: "8,942",
    change: 5.7,
    sparklineData: [
      { value: 5 }, { value: 6 }, { value: 9 }, { value: 7 },
      { value: 8 }, { value: 10 }, { value: 12 },
    ],
    icon: ShoppingBag,
  },
];

const revenueByMarketplaceData = [
  { name: "Mercado Livre", Faturamento: 185000 },
  { name: "Shopee", Faturamento: 125000 },
  { name: "Amazon", Faturamento: 95000 },
  { name: "Magazine Luiza", Faturamento: 65000 },
  { name: "Loja Própria", Faturamento: 25000 },
];

const topMarketplacesData = [
    { source: 'Mercado Livre', faturamento: 'R$ 185K', vendas: '3.1k', margem: '28.5%', lucro: 'R$ 52.7K' },
    { source: 'Shopee', faturamento: 'R$ 125K', vendas: '4.2k', margem: '19.2%', lucro: 'R$ 24.0K' },
    { source: 'Amazon', faturamento: 'R$ 95K', vendas: '1.2k', margem: '35.1%', lucro: 'R$ 33.3K' },
    { source: 'Magazine Luiza', faturamento: 'R$ 65K', vendas: '850', margem: '22.4%', lucro: 'R$ 14.5K' },
];

// --- COMPONENTES DE UI (Simulando shadcn/ui para ser autossuficiente) ---

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-xl border border-border-dark bg-card text-text shadow-lg ${className}`}
    {...props}
  />
));
Card.displayName = "Card";


// --- COMPONENTES DO DASHBOARD ---

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  sparklineData: { value: number }[];
  icon: React.ElementType;
}


const TopMarketplacesTable: React.FC = () => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-border-dark">
                        <th className="p-3 font-medium text-text-secondary">Fonte</th>
                        <th className="p-3 font-medium text-text-secondary text-right">Faturamento</th>
                        <th className="p-3 font-medium text-text-secondary text-right">Vendas</th>
                        <th className="p-3 font-medium text-text-secondary text-right">Margem Média</th>
                        <th className="p-3 font-medium text-text-secondary text-right">Lucro Total</th>
                    </tr>
                </thead>
                <tbody>
                    {topMarketplacesData.map((item) => (
                        <tr key={item.source} className="border-b border-border-dark last:border-0">
                            <td className="p-3 font-semibold">{item.source}</td>
                            <td className="p-3 text-right">{item.faturamento}</td>
                            <td className="p-3 text-right">{item.vendas}</td>
                            <td className="p-3 text-right text-primary font-semibold">{item.margem}</td>
                            <td className="p-3 text-right font-semibold">{item.lucro}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const data = [
  { date: "13/10/25", base: 80_000, one: 70_000, shopee: 85_000, store: 45_000, mypet: 30_000, amazon: 0, full: 0 },
  { date: "14/10/25", base: 65_000, one: 55_000, shopee: 60_000, store: 35_000, mypet: 40_000, amazon: 0, full: 0 },
  { date: "15/10/25", base: 60_000, one: 50_000, shopee: 58_000, store: 32_000, mypet: 38_000, amazon: 0, full: 0 },
  { date: "16/10/25", base: 70_000, one: 62_000, shopee: 65_000, store: 40_000, mypet: 35_000, amazon: 0, full: 0 },
  { date: "17/10/25", base: 75_000, one: 68_000, shopee: 70_000, store: 42_000, mypet: 36_000, amazon: 0, full: 0 },
  { date: "18/10/25", base: 68_000, one: 58_000, shopee: 63_000, store: 38_000, mypet: 34_000, amazon: 0, full: 0 },
  { date: "19/10/25", base: 72_000, one: 61_000, shopee: 67_000, store: 39_000, mypet: 37_000, amazon: 0, full: 0 },
  { date: "20/10/25", base: 77_000, one: 66_000, shopee: 73_000, store: 43_000, mypet: 35_000, amazon: 0, full: 0 },
  { date: "21/10/25", base: 74_000, one: 63_000, shopee: 69_000, store: 41_000, mypet: 33_000, amazon: 0, full: 0 },
  { date: "22/10/25", base: 79_000, one: 70_000, shopee: 76_000, store: 44_000, mypet: 36_000, amazon: 0, full: 0 },
  { date: "23/10/25", base: 71_000, one: 59_000, shopee: 64_000, store: 37_000, mypet: 32_000, amazon: 0, full: 0 },
  { date: "24/10/25", base: 66_000, one: 56_000, shopee: 61_000, store: 36_000, mypet: 31_000, amazon: 0, full: 0 },
];


const series = [
  { key: "base",   label: "Base",                 color: "#3B82F6", total: 11513 },
  { key: "one",    label: "MYPET ONE",            color: "#22C55E", total: 8267 },
  { key: "shopee", label: "Shopee",               color: "#F59E0B", total: 9566 },
  { key: "store",  label: "MYPETONE STORE",       color: "#EF4444", total: 8268 },
  { key: "mypet",  label: "MY.PET.ONE",           color: "#60A5FA", total: 7706 },
  { key: "amazon", label: "Amazon",               color: "#D1D5DB", total: 9804 },
  { key: "full",   label: "MY.PET.ONE - FULL",    color: "#E5E7EB", total: 8544 },
];
// --- PÁGINA PRINCIPAL DO DASHBOARD ---

const datas = [
  { mes: "Jan", pedidos: 120, receita: 2500 },
  { mes: "Fev", pedidos: 150, receita: 10000 },
  { mes: "Mar", pedidos: 180, receita: 4000 },
  { mes: "Abr", pedidos: 100, receita: 2200 },
  { mes: "Mai", pedidos: 200, receita: 5000 },
  { mes: "Jun", pedidos: 170, receita: 4200 },
];

const dataMargem = [
  { date: "13/10/25", margem: 32 },
  { date: "14/10/25", margem: 28 },
  { date: "15/10/25", margem: 30 },
  { date: "16/10/25", margem: 27 },
];


export default function DashboardPage() {
  return (
    
    <div className="-mt-11 max-w-7xl mx-auto w-full container p-4 sm:p-6 md:p-8 space-y-8">
      <div>
        <DashFilter />
        {/* Cards de Indicadores (KPIs) */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KpiCard
            title="Receita total"
            value="R$ 489.7K"
            change={-15}
            sparklineData={[
              { value: 10 }, { value: 15 }, { value: 12 }, { value: 18 },
              { value: 20 }, { value: 25 }, { value: 23 },
            ]}
            comparedLabel="vs. Semana passada"
            comparedValue="R$ 435.2K"
          />
            <KpiCard
            title="Ticket médio"
            value="R$ 489.7K"
            change={12.5}
            sparklineData={[
              { value: 10 }, { value: 15 }, { value: 12 }, { value: 18 },
              { value: 20 }, { value: 25 }, { value: 23 },
            ]}
            comparedLabel="vs. Semana passada"
            comparedValue="R$ 435.2K"
          />
        <KpiCard
            title="Pedidos de venda"
            value="R$ 489.7K"
            change={12.5}
            sparklineData={[
              { value: 10 }, { value: 15 }, { value: 12 }, { value: 18 },
              { value: 20 }, { value: 25 }, { value: 23 },
            ]}
            comparedLabel="vs. Semana passada"
            comparedValue="R$ 435.2K"
          />
        </div>

      </div>
          <div className="flex flex-col gap-5">

            <GraficoBar
              title="Receita por canal"
              data={data}
              xKey="date"   // ✅ agora bate com a chave "date"
              series={[
                { key: "shopee", label: "Shopee", color: "#f97316" },
                { key: "one", label: "One", color: "#9333ea" },
                { key: "store", label: "Store", color: "#22c55e" },
                { key: "mypet", label: "MyPet", color: "#eab308" },
                { key: "amazon", label: "Amazon", color: "#111827" },
                { key: "full", label: "Full", color: "#06b6d4" },
                { key: "base", label: "Base", color: "#2563eb" },
              ]}
            />
            <div className="flex gap-4">
            <div className="flex">
              <GraficoPeR
                title="Pedidos x Receita"
                data={datas}
                xKey="mes"
                series={[
                  { key: "pedidos", label: "Pedidos", color: "#413ea0" },
                ]}
                line={{ key: "receita", label: "Receita (R$)", color: "#ff7300", dot: true }}
              />
            </div>
            <div className="flex-1">
              <GraficoMargem
                title="Margem Bruta (%)" 
                data={dataMargem} 
                xKey="date" 
              />
            </div>
          </div>
          </div>  


      {/* Tabela de Top Marketplaces */}
      <Card className="p-5">
        <h2 className="text-xl font-semibold mb-4 text-text">
          Top Marketplaces
        </h2>
        <TopMarketplacesTable />
      </Card>

    </div>
  );
}



