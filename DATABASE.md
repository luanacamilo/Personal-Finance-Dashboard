# 🗄️ Estrutura do Banco de Dados

## 📊 Diagrama ER (Entity Relationship)

```
┌─────────────────┐
│   categories    │
├─────────────────┤
│ id (PK)         │
│ name            │
│ created_at      │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────┴─────────────────────┐
    │                          │
┌───▼──────────────┐   ┌───────▼──────────┐
│  transactions    │   │     budgets      │
├──────────────────┤   ├──────────────────┤
│ id (PK)          │   │ id (PK)          │
│ type             │   │ category_id (FK) │
│ amount           │   │ monthly_limit    │
│ category_id (FK) │   │ month            │
│ date             │   │ year             │
│ description      │   │ created_at       │
│ created_at       │   │ updated_at       │
│ updated_at       │   └──────────────────┘
└──────────────────┘
```

## 📋 Tabelas

### 1. **categories** (Categorias)

Armazena as categorias de transações financeiras.

| Campo      | Tipo     | Descrição                    |
|------------|----------|------------------------------|
| id         | INTEGER  | Chave primária (auto)        |
| name       | TEXT     | Nome da categoria (único)    |
| created_at | DATETIME | Data de criação              |

**Categorias padrão:**
- Salário, Freelance, Investimentos (receitas)
- Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Outros (despesas)

---

### 2. **transactions** (Transações)

Registra todas as movimentações financeiras (receitas e despesas).

| Campo       | Tipo     | Descrição                           |
|-------------|----------|-------------------------------------|
| id          | INTEGER  | Chave primária (auto)               |
| type        | TEXT     | Tipo: 'income' ou 'expense'         |
| amount      | REAL     | Valor (sempre positivo)             |
| category_id | INTEGER  | FK para categories                  |
| date        | DATE     | Data da transação                   |
| description | TEXT     | Descrição (opcional)                |
| created_at  | DATETIME | Data de criação do registro         |
| updated_at  | DATETIME | Data da última atualização          |

**Validações:**
- `type` deve ser 'income' ou 'expense'
- `amount` deve ser > 0
- `category_id` deve existir em categories

---

### 3. **budgets** (Orçamentos)

Define limites de gastos mensais por categoria.

| Campo         | Tipo     | Descrição                      |
|---------------|----------|--------------------------------|
| id            | INTEGER  | Chave primária (auto)          |
| category_id   | INTEGER  | FK para categories             |
| monthly_limit | REAL     | Limite mensal (> 0)            |
| month         | INTEGER  | Mês (1-12)                     |
| year          | INTEGER  | Ano (>= 2020)                  |
| created_at    | DATETIME | Data de criação                |
| updated_at    | DATETIME | Data da última atualização     |

**Validações:**
- `monthly_limit` > 0
- `month` entre 1 e 12
- `year` >= 2020
- Único por (category_id, month, year)

---

## 👁️ Views (Consultas Pré-definidas)

### **v_current_balance** - Balanço Geral

Calcula o balanço total de todas as transações.

```sql
SELECT * FROM v_current_balance;
```

| Campo          | Descrição              |
|----------------|------------------------|
| total_income   | Total de receitas      |
| total_expense  | Total de despesas      |
| balance        | Saldo (receitas - despesas) |

---

### **v_expenses_by_category** - Gastos por Categoria

Mostra o total gasto em cada categoria.

```sql
SELECT * FROM v_expenses_by_category;
```

| Campo              | Descrição                    |
|--------------------|------------------------------|
| category           | Nome da categoria            |
| transaction_count  | Número de transações         |
| total_spent        | Total gasto                  |

---

### **v_budget_status** - Status dos Orçamentos

Compara gastos reais com os orçamentos definidos (mês atual).

```sql
SELECT * FROM v_budget_status;
```

| Campo             | Descrição                       |
|-------------------|---------------------------------|
| category          | Nome da categoria               |
| monthly_limit     | Limite definido                 |
| spent             | Valor já gasto                  |
| remaining         | Valor restante                  |
| usage_percentage  | % do orçamento utilizado        |

---

## 🔑 Relacionamentos

1. **categories → transactions** (1:N)
   - Uma categoria pode ter várias transações
   - Uma transação pertence a uma categoria

2. **categories → budgets** (1:N)
   - Uma categoria pode ter vários orçamentos (um por mês)
   - Um orçamento pertence a uma categoria

---

## 📌 Índices

Para otimizar consultas:

- `idx_transactions_date` - Busca por data
- `idx_transactions_type` - Busca por tipo (income/expense)
- `idx_transactions_category` - Busca por categoria
- `idx_budgets_period` - Busca por mês/ano

---

## 🎯 Dados de Exemplo

O banco já vem populado com:

✅ **10 categorias** padrão  
✅ **6 transações** de exemplo (Janeiro 2026)  
✅ **5 orçamentos** de exemplo (Janeiro 2026)  
✅ **Saldo inicial**: R$ 4.500,00 (R$ 6.500 receitas - R$ 2.000 despesas)

---

## 🔄 Como Resetar o Banco

```bash
npm run init-db
```

Isso vai:
1. Apagar todas as tabelas existentes
2. Recriar a estrutura completa
3. Inserir dados de exemplo

---

## 💡 Melhorias Implementadas

Comparado à sua estrutura inicial, adicionei:

✅ **Constraints SQL**: NOT NULL, CHECK, UNIQUE, FOREIGN KEY  
✅ **Campos de auditoria**: created_at, updated_at  
✅ **Validações**: tipo de transação, valores positivos  
✅ **Índices**: para melhor performance  
✅ **Views**: para consultas complexas facilitadas  
✅ **Orçamentos por período**: month + year  
✅ **Cascata**: DELETE CASCADE nos relacionamentos  
✅ **Dados de exemplo**: para testar o sistema
