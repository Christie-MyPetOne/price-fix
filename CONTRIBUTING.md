## 📘 Guia de Contribuição — Padrões Profissionais

Este documento define o padrão oficial para desenvolvimento. Inclui normas de **branches**, **commits**, **pull requests**, **workflow com Jira** e orientações específicas para **Front-end**, **Back-end** e **DevOps**.

---

# 📌 1. Fluxo de Trabalho com Jira

- **Cada tarefa corresponde a 1 ticket Jira**.
- Os IDs dos tickets seguem o formato: `PFIX-123`.
- **Toda branch deve iniciar com o ID do ticket**.
- Todo commit e PR deve referenciar o ticket.
- Nada é enviado para `main` sem PR.

# 1.1 Exempro

- **Ticket**

- PFIX-147 — Criar componente de listagem de produtos com busca

- **Tipo**

- feat

- **Descrição**

- Desenvolver o componente de listagem de produtos na aplicação PriceFix, contendo tabela, busca por nome/sku e paginação.

- **Objetivo**

- Permitir que o usuário visualize todos os produtos cadastrados e consiga filtrá-los rapidamente.

- **Regras de Negócio**

- Mostrar nome, SKU, custo, preço e margem.

- Campo de busca deve aplicar filtro no front-end.

- Paginação deve vir da API (/products?page=&limit=).

# Subtarefas

- PFIX-148 — Criar layout do componente de tabela

- PFIX-149 — Criar lógica do filtro e busca

- PFIX-150 — Implementar paginação usando API

---

# 🌿 2. Padrão de Branches

### Branches principais

```
main     → Produção
develop  → Homologação / Pré-produção
```

### Branches de desenvolvimento

Formato:

```

<tipo>/<JIRA>-<area>-<descricao>

```

### Exemplos

```
feature/PFIX-147-front-lista-produtos

```

### Terminal

git checkout -b feature/PFIX-147-front-refatorar-modal-da-tabela-compras

### Tipos aceitos

- `feature` → nova funcionalidade
- `bugfix` → correção de bug
- `hotfix` → correção emergencial
- `chore` → manutenção / scripts

### Front-end

```

feature/PFIX-120-front-dashboard
bugfix/PFIX-82-front-modal-sem-fechar

```

#### Back-end

```

feature/PFIX-300-back-orders-endpoint
hotfix/PFIX-12-back-timeout-db

```

#### DevOps

```

feature/PFIX-430-devops-novo-pipeline
chore/PFIX-201-devops-ajuste-helm

```

---

# 📝 3. Padrão de Commits (Conventional Commits + Jira)

Formato obrigatório:

```

<tipo>(<JIRA>): mensagem curta e clara

```

### Exemplos

```

feat(PFIX-147): cria componente de listagem de produtos com busca

```

### Tipos aceitos

- `feat` — implementação de funcionalidade
- `fix` — correção de bug
- `refactor` — refatoração sem mudar comportamento
- `chore` — manutenção / scripts / config
- `docs` — documentação
- `test` — testes
- `ci` — pipelines
- `build` — dependências e build

#### Front-end

```

feat(PFIX-120): adiciona tabela de preços
fix(PFIX-82): corrige bug no modal

```

#### Back-end

```

feat(PFIX-300): cria rota de pedidos
refactor(PFIX-302): reorganiza camadas de service

```

#### DevOps

```

ci(PFIX-411): adiciona stage de integração
chore(PFIX-413): atualiza imagem docker

```

---

# 🔃 4. Pull Requests

### Título

```

PFIX-123 — Implementação do fluxo de login

```

### Descrição padrão

```

### 🧾 O que foi feito

- Descrição clara das mudanças

### 🧪 Como testar

1. Passo-a-passo

### 🧩 Checklist

- [ ] Código segue padrões do projeto
- [ ] Branch nomeada corretamente
- [ ] Commits no padrão
- [ ] Tests atualizados ou adicionados
- [ ] Não possui console.logs ou códigos mortos

### 🔗 Jira

https://jiraempresa.com/browse/PFIX-123

```

---

# 🧩 5. Padrões por Área

## Front-end

- Usar componentes reutilizáveis
- Evitar lógica no JSX
- Sempre tipar (Typescript)
- Criar testes quando envolver regras de negócio

## Back-end

- Separar camadas: controller → service → repository
- Respeitar contratos e DTOs
- Validar entradas sempre
- Cobrir endpoints críticos com testes

## DevOps

- Pipelines devem ser versionados
- Evitar segredos em texto plano
- Utilizar padrões de nomenclatura para recursos cloud
- Automação sempre que possível

---

# 🚀 6. Processo de Merge

1. Criar branch seguindo o padrão
2. Fazer commits padronizados
3. Abrir PR apontando para `develop`
4. Após homologação → merge para `main`
5. Pipelines executam deploy automático (quando configurado)

**Este documento é obrigatório para todos os colaboradores do projeto.**

```

```
