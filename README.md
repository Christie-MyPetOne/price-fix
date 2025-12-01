# ✨ PriceFix: Ecossistema Inteligente de Gestão

[![Status do Build](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)](https://github.com/Tecno-Bill/price-fix)
[![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-blue?style=for-the-badge)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

O **PriceFix** é um sistema moderno para gestão de preços, produtos e vendas. Construído com foco em performance e usabilidade, ele oferece uma plataforma centralizada para lojistas e analistas tomarem decisões estratégicas baseadas em dados.

A interface responsiva e intuitiva permite uma visão clara sobre métricas de negócio, margens de lucro, saúde do estoque e performance de canais de venda.

---

## 🚀 Funcionalidades Principais

- **Dashboard Analítico:** Visão consolidada com KPIs, gráficos de performance (P/L, Margens) e filtros dinâmicos.
- **Gestão de Produtos:** Detalhamento de produtos com calculadora de preços, simulador de metas e histórico de performance.
- **Análise de Vendas:** Acompanhamento de pedidos, com resumo financeiro e cálculo de margens por venda.
- **Gestão de Compras e Estoque:** Ferramentas para análise de saúde do estoque, sugestão de reposição e controle de fornecedores.
- **Configurações Avançadas:** Módulo para configurar empresas, canais de venda, integrações com ERPs e muito mais.
- **Autenticação Segura:** Rotas públicas e privadas para garantir a segurança dos dados.
- **Tema Claro/Escuro:** Interface adaptável para preferência do usuário com persistência.

---

## 🛠️ Tecnologias Utilizadas

O projeto é construído com um stack moderno e robusto, focado em escalabilidade e experiência de desenvolvimento.

- **Framework:** [Next.js](https://nextjs.org/) (com App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Gerenciamento de Estado:** [Zustand](https://github.com/pmndrs/zustand)
- **Visualização de Dados:** [Recharts](https://recharts.org/)
- **Requisições HTTP:** [Axios](https://axios-http.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Linting:** [ESLint](https://eslint.org/)

---

## 🏗️ Arquitetura do Projeto

A estrutura do projeto foi desenhada para ser modular e escalável, separando responsabilidades de forma clara.

```
/
├── .next/                  # Arquivos de build do Next.js
├── node_modules/           # Dependências do projeto
├── public/                 # Arquivos estáticos (imagens, fontes)
├── src/
│   ├── app/                # Rotas da aplicação (App Router)
│   │   ├── (private)/      # Rotas que exigem autenticação
│   │   │   ├── (dashboard)/# Rota principal da aplicação
│   │   │   ├── comprar/    # Módulo de Gestão de Compras
│   │   │   ├── fornecedor/ # Módulo de Gestão de Fornecedores
│   │   │   ├── produtos/   # Módulo de Gestão de Produtos
│   │   │   └── vendas/     # Módulo de Gestão de Vendas
│   │   └── (public)/       # Rotas de acesso livre
│   │       ├── login/      # Página de autenticação
│   │       └── register/   # Página de registro
│   ├── components/         # Componentes React
│   │   ├── charts/         # Componentes de gráficos (Recharts)
│   │   ├── ui/             # Componentes de UI genéricos (Button, Modal, Input)
│   │   └── [feature]/      # Componentes específicos de cada módulo
│   ├── context/            # Contextos React (ex: ThemeContext)
│   ├── hooks/              # Hooks customizados
│   ├── lib/                # Funções utilitárias, tipos e helpers
│   ├── store/              # Estado global com Zustand
│   └── styles/             # Estilos globais e configuração do Tailwind
├── eslint.config.mjs       # Configuração do ESLint
├── next.config.ts          # Configuração do Next.js
├── postcss.config.js       # Configuração do PostCSS
├── tailwind.config.ts      # Configuração do Tailwind CSS
├── tsconfig.json           # Configuração do TypeScript
└── package.json            # Dependências e scripts
```

---

## ⚡ Começando

Siga os passos abaixo para executar o projeto em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 20.x ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Instalação

1.  Clone o repositório para sua máquina:
    ```sh
    git clone https://github.com/Tecno-Bill/price-fix.git
    ```
2.  Navegue até o diretório do projeto:
    ```sh
    cd price-fix
    ```
3.  Instale as dependências:
    ```sh
    npm install
    ```

### Executando a Aplicação

Para iniciar o servidor de desenvolvimento, execute:

```sh
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) em seu navegador para ver a aplicação em funcionamento.

---

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a build de produção otimizada.
- `npm run start`: Inicia um servidor de produção a partir da build gerada.
- `npm run lint`: Executa o linter para análise estática do código.

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Se você deseja contribuir, por favor, siga as diretrizes descritas em `CONTRIBUTING.md`.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
