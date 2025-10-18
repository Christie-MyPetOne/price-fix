import React from 'react';
import { Info, ChevronDown, RefreshCcw } from 'lucide-react';

interface IndicatorCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  infoText?: string;
  colorClass?: string;
}

const IndicatorCard: React.FC<IndicatorCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  infoText,
  colorClass = 'text-gray-800'
}) => {
  const changeColorClass = changeType === 'positive' ? 'text-green-600' :
                           changeType === 'negative' ? 'text-red-600' :
                           'text-gray-500';

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {infoText && (
          <div className="relative group">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-30">
              {infoText}
            </div>
          </div>
        )}
      </div>
      <p className={`text-xl font-bold ${colorClass}`}>{value}</p>
      {change && (
        <div className="flex items-center text-sm mt-1">
          <span className={`${changeColorClass} font-semibold mr-1`}>{change}</span>
          <span className="text-gray-500">comparado</span>
        </div>
      )}
    </div>
  );
};

export function FinanceIndicators() {
  return (
    <div className="w-full lg:w-80 bg-gray-50 p-4 border-l border-gray-200 shadow-inner flex flex-col space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>LB COMÉRCIO PET</span>
        <span>OUTUBRO, 2025</span>
      </div>

      <div className="flex justify-between items-center text-sm mb-4">
        <button className="flex items-center gap-1 text-gray-700 hover:text-primary transition-colors">
          <RefreshCcw className="w-4 h-4" />
          <span className="text-sm">MUDAR DE EMPRESA</span>
        </button>
      </div>

      <IndicatorCard
        title="LUCRO LÍQUIDO MENSAL"
        value="R$ 702.600,18"
        change="-39.2%"
        changeType="negative"
        colorClass="text-red-600"
        infoText="O lucro líquido é o resultado final após deduzir todas as despesas e impostos."
      />
      <IndicatorCard
        title="MARGEM DE CONTRIBUIÇÃO"
        value="22,77%"
        change="-0.3%"
        changeType="negative"
        infoText="A margem de contribuição indica o quanto sobra da receita para cobrir os custos fixos."
      />
      <IndicatorCard
        title="PONTO DE EQUILÍBRIO OPERACIONAL"
        value="R$ 993.786,54"
        infoText="Valor de faturamento necessário para cobrir todos os custos e despesas."
      />
      <IndicatorCard
        title="CAPITAL DE GIRO"
        value="(-) R$ 618.492,40"
        change="+2.0%"
        changeType="positive" // Um aumento no capital negativo ainda é "positivo" na mudança
        colorClass="text-red-600" // Valor negativo
        infoText="Recursos disponíveis para financiar as operações do dia a dia da empresa."
      />
      <IndicatorCard
        title="LUCRATIVIDADE"
        value="17.42%"
        infoText="Percentual de lucro sobre a receita total."
      />
      <IndicatorCard
        title="RENTABILIDADE"
        value="0.00%"
        infoText="Percentual de retorno sobre o investimento."
      />
    </div>
  );
}