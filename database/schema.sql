-- ============================================
-- SCHEMA DO BANCO DE DADOS
-- Personal Finance Dashboard
-- ============================================

-- Limpar tabelas existentes (CUIDADO: apaga dados!)
DROP VIEW IF EXISTS v_budget_status;
DROP VIEW IF EXISTS v_expenses_by_category;
DROP VIEW IF EXISTS v_current_balance;
DROP TABLE IF EXISTS budgets;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS user_profile;
DROP TABLE IF EXISTS test;

-- ============================================
-- 1. TABELA: user_profile
-- ============================================
CREATE TABLE user_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    main_salary REAL NOT NULL CHECK(main_salary >= 0),
    other_income REAL DEFAULT 0 CHECK(other_income >= 0),
    periodicity TEXT NOT NULL CHECK(periodicity IN ('monthly', 'biweekly')),
    savings_goal REAL DEFAULT 0 CHECK(savings_goal >= 0),
    investment_goal REAL DEFAULT 0 CHECK(investment_goal >= 0),
    emergency_fund_goal REAL DEFAULT 0 CHECK(emergency_fund_goal >= 0),
    onboarding_completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. TABELA: categories
-- ============================================
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. TABELA: transactions
-- ============================================
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    amount REAL NOT NULL CHECK(amount > 0),
    category_id INTEGER NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ============================================
-- 4. TABELA: budgets
-- ============================================
CREATE TABLE budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    monthly_limit REAL NOT NULL CHECK(monthly_limit > 0),
    month INTEGER NOT NULL CHECK(month BETWEEN 1 AND 12),
    year INTEGER NOT NULL CHECK(year >= 2020),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(category_id, month, year)
);

-- ============================================
-- ÍNDICES para melhor performance
-- ============================================
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_budgets_period ON budgets(month, year);

-- ============================================
-- DADOS INICIAIS (Categorias padrão)
-- ============================================
INSERT INTO categories (name) VALUES
    ('Salário'),
    ('Freelance'),
    ('Investimentos'),
    ('Alimentação'),
    ('Transporte'),
    ('Moradia'),
    ('Lazer'),
    ('Saúde'),
    ('Educação'),
    ('Outros');

-- ============================================
-- DADOS DE EXEMPLO (opcional)
-- ============================================
INSERT INTO transactions (type, amount, category_id, date, description) VALUES
    ('income', 5000.00, 1, '2026-01-05', 'Salário Janeiro'),
    ('income', 1500.00, 2, '2026-01-15', 'Projeto Freelance'),
    ('expense', 450.00, 4, '2026-01-10', 'Supermercado'),
    ('expense', 200.00, 5, '2026-01-12', 'Combustível'),
    ('expense', 1200.00, 6, '2026-01-01', 'Aluguel'),
    ('expense', 150.00, 7, '2026-01-20', 'Cinema e restaurante');

INSERT INTO budgets (category_id, monthly_limit, month, year) VALUES
    (4, 800.00, 1, 2026),   -- Alimentação: R$ 800
    (5, 300.00, 1, 2026),   -- Transporte: R$ 300
    (6, 1200.00, 1, 2026),  -- Moradia: R$ 1200
    (7, 400.00, 1, 2026),   -- Lazer: R$ 400
    (8, 200.00, 1, 2026);   -- Saúde: R$ 200

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View: Balanço atual
CREATE VIEW v_current_balance AS
SELECT 
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance
FROM transactions;

-- View: Gastos por categoria
CREATE VIEW v_expenses_by_category AS
SELECT 
    c.name as category,
    COUNT(t.id) as transaction_count,
    SUM(t.amount) as total_spent
FROM transactions t
INNER JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY c.id, c.name
ORDER BY total_spent DESC;

-- View: Status dos orçamentos (mês atual)
CREATE VIEW v_budget_status AS
SELECT 
    c.name as category,
    b.monthly_limit,
    COALESCE(SUM(t.amount), 0) as spent,
    b.monthly_limit - COALESCE(SUM(t.amount), 0) as remaining,
    ROUND((COALESCE(SUM(t.amount), 0) / b.monthly_limit) * 100, 2) as usage_percentage
FROM budgets b
INNER JOIN categories c ON b.category_id = c.id
LEFT JOIN transactions t ON 
    t.category_id = b.category_id 
    AND t.type = 'expense'
    AND strftime('%m', t.date) = printf('%02d', b.month)
    AND strftime('%Y', t.date) = CAST(b.year AS TEXT)
WHERE b.month = strftime('%m', 'now')
  AND b.year = strftime('%Y', 'now')
GROUP BY c.id, c.name, b.monthly_limit;

-- ============================================
-- FIM DO SCHEMA
-- ============================================

SELECT '✅ Banco de dados criado com sucesso!' as status;
