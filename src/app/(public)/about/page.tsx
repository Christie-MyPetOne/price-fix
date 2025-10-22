import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  DollarSign,
  Zap,
  TrendingUp,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="w-full py-20 md:py-32 bg-card border-b border-border-dark">
      <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-text mb-4">
            Desvende o Lucro Real do seu E-commerce
          </h1>
          <p className="max-w-xl text-text-secondary md:text-lg mb-8">
            Nossa plataforma analisa todas as taxas, impostos e custos para
            revelar a margem de lucro verdadeira de cada venda. Tome decisões
            baseadas em dados e pare de perder dinheiro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-white hover:bg-primary-dark h-11 px-8"
            >
              Começar Teste Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-border-dark bg-transparent hover:bg-background h-11 px-8"
            >
              Ver Funcionalidades
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <div className="bg-background rounded-xl p-6 border border-border-dark shadow-2xl w-full max-w-md transform transition-transform hover:scale-105 duration-300">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium text-text-secondary">
                Lucro por Marketplace
              </p>
              <BarChart2 className="w-5 h-5 text-text-secondary" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Mercado Livre</span>
                <div className="flex items-center gap-2">
                  <div className="w-40 h-2 bg-border-dark rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-primary">+28.5%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Amazon</span>
                <div className="flex items-center gap-2">
                  <div className="w-40 h-2 bg-border-dark rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-primary">+35.1%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Shopee</span>
                <div className="flex items-center gap-2">
                  <div className="w-40 h-2 bg-border-dark rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-error rounded-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-error">-5.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const featureList = [
    {
      icon: DollarSign,
      title: "Análise de Lucro Real",
      description:
        "Saiba exatamente quanto você lucra em cada venda, descontando taxas, fretes e impostos.",
    },
    {
      icon: Zap,
      title: "Sugestões Inteligentes",
      description:
        "Receba alertas sobre produtos com margem negativa e sugestões para otimizar seus preços.",
    },
    {
      icon: TrendingUp,
      title: "Otimizador de Compras",
      description:
        "Descubra o momento e a quantidade ideal para comprar seus produtos, evitando rupturas e excesso de estoque.",
    },
  ];

  return (
    <section id="features" className="w-full py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text">
            Tudo que você precisa para lucrar mais
          </h2>
          <p className="mt-4 max-w-2xl text-text-secondary">
            Nossa plataforma transforma dados complexos em ações simples e
            diretas.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureList.map((feature) => (
            <div
              key={feature.title}
              className="bg-card p-8 rounded-xl border border-border-dark"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  return (
    <main className="flex-1">
      <Hero />
      <Features />
    </main>
  );
}
