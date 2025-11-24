"use client";

import {
  Settings,
  ShieldCheck,
  Boxes,
  Gauge,
  BarChart3,
  Link,
  RefreshCcw,
  Clock,
  Globe,
  Cpu,
  Building2,
  Lock,
  KeyRound,
} from "lucide-react";

export default function TabGeral() {
  return (
    <div className="-mt-9 min-h-[calc(100vh-64px)] pt-6">
      <div className="mx-auto max-w-6xl">
        {/* ===== HEADER PADRÃO ===== */}
        <div className="mb-6 ml-4">
          <h1 className="text-2xl font-semibold text-text flex items-center gap-2">
            <Settings className="text-emerald-600 dark:text-emerald-400" />
            Configurações Gerais do Sistema
          </h1>
          <p className="text-sm text-text-secondary">
            Uma visão centralizada sobre o funcionamento do sistema,
            integrações, segurança e status operacional do seu ERP/CRM.
          </p>
        </div>

        {/* ===== CARD PRINCIPAL (PADRÃO CONFIGBASICA) ===== */}
        <div className="rounded-xl border border-border-dark bg-card shadow-sm">
          <div className="p-6 grid gap-10">
            {/* GRID DE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card
                title="Status do Sistema"
                icon={<ShieldCheck className="text-emerald-500" />}
              >
                <p className="text-sm text-text-secondary">
                  Plataforma funcionando normalmente.
                </p>
                <div className="mt-3 text-sm space-y-1">
                  <p>
                    • API:{" "}
                    <span className="font-medium text-emerald-500">Ativa</span>
                  </p>
                  <p>
                    • Última sincronização:{" "}
                    <span className="font-medium">há 6 minutos</span>
                  </p>
                  <p>• Ping médio: 41ms</p>
                </div>
              </Card>

              <Card
                title="Uso do ERP"
                icon={<Gauge className="text-emerald-500" />}
              >
                <p className="text-sm text-text-secondary">
                  Principais módulos utilizados.
                </p>
                <ul className="text-sm mt-3 space-y-1">
                  <li>• Vendas (muito acessado)</li>
                  <li>• Produtos (uso alto)</li>
                  <li>• Financeiro (uso moderado)</li>
                  <li>• CRM (uso baixo)</li>
                </ul>
              </Card>

              <Card
                title="Saúde do Estoque"
                icon={<Boxes className="text-emerald-500" />}
              >
                <ul className="text-sm mt-1 space-y-1">
                  <li>
                    • Baixo estoque:{" "}
                    <span className="font-medium">12 itens</span>
                  </li>
                  <li>
                    • Sem vendas 30d:{" "}
                    <span className="font-medium">27 itens</span>
                  </li>
                  <li>
                    • Giro médio: <span className="font-medium">Rápido</span>
                  </li>
                </ul>
              </Card>

              <Card
                title="Plano e Assinatura"
                icon={<BarChart3 className="text-emerald-500" />}
              >
                <p className="text-sm">
                  Plano atual: <span className="font-medium">Premium</span>
                </p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Produtos usados: 3.214 / 10.000</li>
                  <li>• Usuários ativos: 3 / 5</li>
                  <li>• Empresas vinculadas: 5</li>
                </ul>
              </Card>

              <Card
                title="Integrações"
                icon={<Link className="text-emerald-500" />}
              >
                <ul className="text-sm mt-1 space-y-1">
                  <li>
                    • Mercado Livre:{" "}
                    <span className="text-emerald-500 font-medium">OK</span>
                  </li>
                  <li>
                    • Shopee:{" "}
                    <span className="text-red-500 font-medium">
                      Token expirado
                    </span>
                  </li>
                  <li>• Bling ERP: OK</li>
                  <li>• Tiny: Desativado</li>
                </ul>
              </Card>

              <Card
                title="Segurança da Conta"
                icon={<Lock className="text-emerald-500" />}
              >
                <ul className="text-sm mt-1 space-y-1">
                  <li>
                    • 2FA:{" "}
                    <span className="text-emerald-500 font-medium">
                      Ativado
                    </span>
                  </li>
                  <li>• Último login: hoje às 09:41</li>
                  <li>• Sessões ativas: 2</li>
                  <li>• IPs recentes: 3 registrados</li>
                </ul>
              </Card>
            </div>

            {/* ===== Divisor ===== */}
            <div className="h-px bg-border-dark/60" />

            {/* ===== AÇÕES RÁPIDAS ===== */}
            <section>
              <h3 className="text-base font-semibold mb-4">Ações Rápidas</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <QuickAction
                  icon={<RefreshCcw className="text-emerald-500" />}
                  title="Recalcular Margens"
                  desc="Atualize margens e custos com base nos valores mais recentes."
                />
                <QuickAction
                  icon={<Cpu className="text-emerald-500" />}
                  title="Processar Estoque"
                  desc="Reprocessa níveis de estoque e corrige inconsistências."
                />
                <QuickAction
                  icon={<Globe className="text-emerald-500" />}
                  title="Sincronizar Marketplaces"
                  desc="Força atualização com Mercado Livre e Shopee."
                />
                <QuickAction
                  icon={<Building2 className="text-emerald-500" />}
                  title="Validar CNPJs"
                  desc="Confirma dados fiscais das empresas vinculadas."
                />
                <QuickAction
                  icon={<KeyRound className="text-emerald-500" />}
                  title="Gerenciar Tokens"
                  desc="Atualize ou gere novas chaves de integração."
                />
                <QuickAction
                  icon={<Clock className="text-emerald-500" />}
                  title="Agendamentos do Sistema"
                  desc="Veja ou edite rotinas automáticas do ERP."
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== COMPONENTES PADRONIZADOS ===== */

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border-dark rounded-lg p-5 shadow-sm hover:bg-card-light transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-text">{title}</h3>
        {icon}
      </div>
      {children}
    </div>
  );
}

function QuickAction({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button className="bg-card border border-border-dark p-4 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/40 flex items-center gap-3 text-left transition-colors">
      {icon}
      <div>
        <p className="font-medium text-text">{title}</p>
        <p className="text-xs text-text-secondary">{desc}</p>
      </div>
    </button>
  );
}
