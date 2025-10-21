🛒 Price Fix

Sistema de gestão de vendas e produtos com interface moderna, intuitiva e responsiva, desenvolvido em Next.js, TypeScript, Tailwind CSS e com gerenciamento de estado leve via Zustand. Suporta temas claro e escuro com persistência de preferência.

🏗️ Arquitetura
frontend/
├── public/ # Arquivos estáticos (imagens, ícones)
├── src/
│ ├── app/ # Rotas e layouts do Next.js (App Router)
│ │ ├── layout.tsx # Layout principal (ThemeProvider, estrutura base)
│ │ ├── page.tsx # Página inicial (Dashboard)
│ │ ├── produtos/ # Páginas relacionadas a produtos
│ │ └── vendas/ # Páginas relacionadas a vendas
│ ├── components/ # Componentes reutilizáveis
│ │ ├── layout/ # Navbar, Footer e estrutura de layout
│ │ ├── produtos/ # Componentes específicos de produtos
│ │ ├── vendas/ # Componentes específicos de vendas
│ │ └── ui/ # Componentes genéricos (Button, Card, Modal)
│ ├── context/ # Contexto de tema (ThemeContext)
│ ├── store/ # Zustand (estado global)
│ ├── lib/ # Utilitários, helpers e tipos
│ └── styles/ # Estilos globais e tema (Tailwind)
├── tailwind.config.ts # Configuração do Tailwind CSS
├── tsconfig.json # Configuração do TypeScript
└── package.json # Dependências e scripts do projeto

📋 Funcionalidades

📊 Dashboard: Visão geral das métricas principais de vendas e produtos

📦 Gestão de Produtos: CRUD completo (criação, edição, listagem e exclusão)

🧾 Gestão de Vendas: Acompanhamento e controle de pedidos de venda

📈 Relatórios: Visualização de dados analíticos e margens de lucro

🌓 Tema Claro/Escuro: Alternância de tema com persistência em localStorage

🛠️ Tecnologias e Bibliotecas

Next.js 13+ (App Router)

React

TypeScript

Tailwind CSS

Zustand
– Gerenciamento de estado leve

Lucide Icons
– Ícones modernos

ShadCN/UI (opcional)
– Componentes UI prontos e acessíveis

🚀 Como Executar

Clone o repositório:

git clone https://github.com/seu-usuario/price-fix.git
cd price-fix

Instale as dependências:

npm install

# ou

yarn install

Execute o ambiente de desenvolvimento:

npm run dev

Abra no navegador:

Acesse http://localhost:3000

🌙 Alternância de Tema

A troca entre os temas claro e escuro pode ser feita clicando no ícone ☀️🌙 no cabeçalho.

A preferência é armazenada localmente, mantendo o tema escolhido ao recarregar a página.

🔧 Configuração
📁 Diretórios Importantes

src/components/ui/: Botões, cards, modais reutilizáveis

src/context/ThemeContext.tsx: Alternância de tema global

src/store/: Zustand (estado global simples)

src/lib/: Helpers, formatação de dados, etc.

📦 Scripts Disponíveis
npm run dev # Inicia o servidor de desenvolvimento
npm run build # Compila para produção
npm run lint # Executa o linter

🧪 Testes (opcional)

Ainda não implementado. Pretende-se utilizar Jest e React Testing Library para testes unitários e de integração.

🤝 Contribuição

Faça um fork do projeto

Crie uma branch:

git checkout -b feature/sua-feature

Commit suas mudanças:

git commit -m 'feat: nova funcionalidade'

Faça push para sua branch:

git push origin feature/sua-feature

Abra um Pull Request

📄 Licença

Este projeto está sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.

👥 Equipe

Desenvolvimento: Você mesmo ou sua equipe

Última atualização: Outubro 2025
