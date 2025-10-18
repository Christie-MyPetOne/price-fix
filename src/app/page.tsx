import { Info, Filter } from 'lucide-react'; 
import { Card } from '../components/ui/Card'; 
import { Button } from '../components/ui/Button'; 

export default function HomePage() {
  return (
    <div className="container mx-auto">
      {/* Cabeçalho de Filtros */}
      <Card className="mb-6 flex items-center justify-between"> {/* Usando o componente Card */}
        <div className="flex items-center space-x-4 text-text-secondary">
          <span>Resultados de</span>
          <span className="bg-background px-3 py-1 rounded text-text">10/10/2025 - 16/10/2025</span>
          <span>comparado com</span>
          <span className="bg-background px-3 py-1 rounded text-text">03/10/2025 - 09/10/2025</span>
          <span>de</span>
          <select className="bg-background text-text p-1 rounded border border-border-dark focus:ring-primary focus:border-primary">
            <option>Todas as empresas</option>
          </select>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          EDITAR FILTROS
        </Button>
      </Card>


      <h1 className="text-3xl font-bold mb-6 text-text">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Card>
          <DashboardMetricCard
            title="Receita total"
            value="R$ 2.220,34 MIL"
            change="-10.7%"
            comparedValue="R$ 2.487,77 mil"
            changeType="negative"
          />
        </Card>
        <Card>
          <DashboardMetricCard
            title="Ticket médio"
            value="R$ 62,15"
            change="-2.9%"
            comparedValue="R$ 64"
            changeType="negative"
          />
        </Card>
        <Card>
          <DashboardMetricCard
            title="Pedidos de venda"
            value="R$ 35.723"
            change="-8.1%"
            comparedValue="38.872"
            changeType="negative"
          />
        </Card>
      </div>

      {/* Gráfico de Receita por canal de venda - AGORA USANDO O COMPONENTE Card */}
      <Card className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-text flex justify-between items-center">
          Receita por canal de venda
          <span className="text-text-secondary text-sm">Nenhum</span>
        </h2>
        {/* Placeholder para o gráfico de barras */}
        <div className="h-64 flex items-center justify-center text-text-secondary border border-border-dark rounded bg-background">
          <p>Gráfico de Receita por Canal (Recharts)</p>
        </div>
        {/* Legenda do gráfico (exemplo) */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-text-secondary">
          <div className="flex items-center"><span className="w-3 h-3 bg-blue-500 mr-2 rounded-full"></span>Base (1513)</div>
          <div className="flex items-center"><span className="w-3 h-3 bg-purple-500 mr-2 rounded-full"></span>Shopee (9566)</div>
          <div className="flex items-center"><span className="w-3 h-3 bg-yellow-500 mr-2 rounded-full"></span>MYPET ONE (8267)</div>
          <div className="flex items-center"><span className="w-3 h-3 bg-red-500 mr-2 rounded-full"></span>MYPETONE STORE (8268)</div>
          <div className="flex items-center"><span className="w-3 h-3 bg-primary mr-2 rounded-full"></span>MYPET ONE - FULL (8944)</div> {/* Exemplo de cor verde */}
        </div>
      </Card>
    </div>
  );
}

// O componente DashboardMetricCard permanece o mesmo, mas agora será aninhado dentro de um <Card>
interface DashboardMetricCardProps {
  title: string;
  value: string;
  change: string;
  comparedValue: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  title,
  value,
  change,
  comparedValue,
  changeType,
}) => {
  const changeColorClass = changeType === 'positive' ? 'text-primary' :
                           changeType === 'negative' ? 'text-error' :
                           'text-text-secondary';
  const arrow = changeType === 'positive' ? '↑' : '↓';

  return (
    <div> {/* Remove as classes de fundo/borda, pois o Card pai já as provê */}
      <h2 className="text-xl font-semibold mb-2 text-text">{title}</h2>
      <div className="flex items-baseline justify-between mb-1">
        <p className="text-4xl font-bold text-text">{value}</p>
        <div className={`flex items-center text-sm font-semibold ${changeColorClass}`}>
          <span>{arrow}</span>
          <span>{change}</span>
        </div>
      </div>
      <p className="text-text-secondary text-sm">
        Período comparado <span className="text-text-secondary">{comparedValue}</span>
      </p>
    </div>
  );
};