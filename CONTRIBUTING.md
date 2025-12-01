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

### Branches de desenvolvimento

Formato:

```

<JIRA>-<area>-<descricao>

```

### Exemplos

```
PFIX-147-front-modal-da-tabela-compras

```

### Terminal

git checkout -b PFIX-147-front-modal-da-tabela-compras

<<<<<<< HEAD
### Subir para o GitHub

git push -u origin PFIX-147-front-modal-da-tabela-compras

=======
>>>>>>> df9083bf23cd3918f7326dcb395c9f417adb6357
### Front-end

```

PFIX-120-front-dashboard

```

#### Back-end

```

PFIX-300-back-orders-endpoint

```

#### DevOps

```

PFIX-430-devops-novo-pipeline

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

```

#### Back-end

```

feat(PFIX-300): cria rota de pedidos

```

#### DevOps

```

ci(PFIX-411): adiciona stage de integração

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


```

# 🚀 6. Processo de Merge

1. Criar branch seguindo o padrão
2. Fazer commits padronizados
3. Abrir PR apontando para `develop`
4. Após homologação → merge para `main`
5. Pipelines executam deploy automático (quando configurado)

**Este documento é obrigatório para todos os colaboradores do projeto.**

```

```
