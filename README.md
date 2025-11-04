# 🛒 Price Fix: Sistema de Gestão de Vendas e Produtos

## 🌟 Visão Geral do Projeto

O **Price Fix** é um sistema de gestão de vendas e produtos (ERP/CRM) moderno, construído para oferecer uma interface de usuário **intuitiva e responsiva**. O foco é fornecer uma visão clara e analítica sobre as métricas de negócio, margens de lucro e saúde do estoque, permitindo tomadas de decisão rápidas e informadas.

O projeto é desenvolvido com as tecnologias mais recentes do ecossistema JavaScript, garantindo alta performance, escalabilidade e uma excelente experiência de desenvolvimento.

## 🏗️ Arquitetura e Estrutura do Projeto

O projeto segue a arquitetura de **Componentes Modulares** e a estrutura de pastas do **Next.js App Router**, com separação clara entre rotas públicas (autenticação) e privadas (aplicação principal).

```
frontend/
├── public/               # Arquivos estáticos (imagens, ícones, favicon)
├── src/
│   ├── app/              # Estrutura de Rotas (Next.js App Router)
│   │   ├── (private)/    # Rotas que exigem autenticação (Dashboard, Vendas, Produtos)
│   │   │   ├── (dashboard)/ # Página principal com visão geral
│   │   │   ├── produtos/ # Módulo de Gestão de Produtos
│   │   │   └── vendas/   # Módulo de Gestão de Vendas
│   │   └── (public)/     # Rotas de acesso livre (Login, Sobre)
│   │       └── login/    # Página de autenticação
│   ├── components/       # Componentes Reutilizáveis e Modulares
│   │   ├── layout/       # Componentes de Layout (Navbar, Footer)
│   │   ├── ui/           # Componentes de Interface Genéricos (Button, Card, Input)
│   │   └── [módulos]/    # Componentes específicos de cada módulo (dashboard, produtos, vendas)
│   ├── context/          # Contextos globais (Ex: ThemeContext)
│   ├── store/            # Gerenciamento de Estado Global (Zustand)
│   ├── lib/              # Funções utilitárias, helpers e definições de tipos
│   └── styles/           # Estilos globais (Tailwind CSS)
├── tailwind.config.ts    # Configuração do Tailwind CSS
├── tsconfig.json         # Configuração do TypeScript
└── package.json          # Dependências e scripts do projeto
```

## 🛠️ Tecnologias e Bibliotecas Principais

A tabela a seguir detalha as principais tecnologias e bibliotecas utilizadas:

**Framework** | **Next.js**  
**Linguagem** | **TypeScript**  
**Estilização** | **Tailwind CSS**  
**Estado Global** | **Zustand**  
**Comunicação** | **Axios**  
**Visualização** | **Recharts**  
**Ícones** | **Lucide React**

## 📋 Funcionalidades Chave

- **Dashboard Analítico:** Visão geral com KPIs (Key Performance Indicators) e gráficos de margem de lucro e P/R (Preço/Receita).

- **Gestão de Vendas:** Acompanhamento detalhado e controle de pedidos de venda.

- **Cálculo de Margens:** Ferramentas para simulação e visualização de margens de lucro.

- **Tema Claro/Escuro:** Alternância de tema com persistência de preferência.

## 🚀 Como Executar o Projeto

### Pré-requisitos

Certifique-se de ter o **Node.js** (versão 18+) e o **npm** ou **yarn** instalados em sua máquina.

### Instalação

1. **Clone o repositório:**

1. **Instale as dependências:**

### Execução

Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará acessível em `http://localhost:3000`.

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT**. Consulte o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe e Contato

**Desenvolvimento:** TecnoBill

**Última Atualização:** Novembro de 2025
