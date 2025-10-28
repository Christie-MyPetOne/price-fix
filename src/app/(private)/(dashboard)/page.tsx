"use client";

import React from "react";
import { DashFilter } from "@/components/dashboard/DashFilter";
import KpiCard from "@/components/dashboard/kpiCard";



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


// --- PÁGINA PRINCIPAL DO DASHBOARD ---

export default function DashboardPage() {
  return (
    
    <div className="-mt-8 max-w-7xl mx-auto w-full container p-4 sm:p-6 md:p-8 space-y-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Faturamento por Marketplace */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-text">
            Faturamento por Marketplace
          </h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <BarChart data={revenueByMarketplaceData} margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-dark)" />
                <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${Number(value) / 1000}k`} />
                <Tooltip
                  cursor={{ fill: 'var(--color-background)' }}
                  contentStyle={{
                    background: 'var(--color-card)',
                    borderColor: 'var(--color-border-dark)',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar dataKey="Faturamento" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Placeholder para outro gráfico */}
        <Card className="p-6 flex flex-col">
           <h2 className="text-xl font-semibold mb-4 text-text">
            Análise de Produtos
          </h2>
          <div className="flex-grow flex items-center justify-center text-center bg-background rounded-lg">
            <div className="text-text-secondary">
                <Activity size={48} className="mx-auto mb-4 opacity-50"/>
                <p className="font-semibold">Em breve</p>
                <p className="text-sm">Um gráfico analisando os produtos mais e menos lucrativos.</p>
            </div>
          </div>
        </Card>
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