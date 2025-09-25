-- Description: Initial schema for personal finance management app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Identity Links
CREATE TABLE IF NOT EXISTS identity_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    provider VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT fk_identity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_identity_provider_subject UNIQUE (provider, subject)
);

-- Accounts
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('CHECKING','SAVINGS','CREDIT_CARD','INVESTMENT','CASH','LOAN')),
    currency VARCHAR(3) NOT NULL,
    balance NUMERIC(12,2) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    txn_date DATE NOT NULL,
    description TEXT,
    type VARCHAR(10) NOT NULL CHECK (type IN ('DEBIT','CREDIT')),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Recurring Transactions
CREATE TABLE IF NOT EXISTS recurring_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('DAILY','WEEKLY','MONTHLY','YEARLY')),
    next_run_date DATE NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    currency CHAR(3) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Budgets
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    limit_amount NUMERIC(12,2) NOT NULL,
    spent NUMERIC(12,2) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_txn_date ON transactions(txn_date);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_month ON budgets(month);
CREATE INDEX IF NOT EXISTS idx_categories_user_type ON categories(user_id, type);

-- Users: lookup by email (login)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Transactions: support filtering by user + date range (e.g., monthly statements)
CREATE INDEX IF NOT EXISTS idx_transactions_user_date
  ON transactions(user_id, txn_date);

-- Transactions: support filtering by category (reports by category)
CREATE INDEX IF NOT EXISTS idx_transactions_category
  ON transactions(category_id);

-- Recurring Transactions: often fetched by user + next_run_date + active
CREATE INDEX IF NOT EXISTS idx_recurring_user_next_active
  ON recurring_transactions(user_id, next_run_date, active);

-- Budgets: often queried by (user_id, category_id, month) to check limits
CREATE UNIQUE INDEX IF NOT EXISTS idx_budgets_user_category_month
  ON budgets(user_id, category_id, month);



CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert sample data
INSERT INTO users (id, email, display_name) VALUES
(uuid_generate_v4(), 'user@example.com', 'Demo User' ),
(uuid_generate_v4(), 'admin@example.com', 'Admin User');

-- Insert sample categories
INSERT INTO categories (name, type, is_default) VALUES
('Salary', 'INCOME', TRUE),
('Interest', 'INCOME', TRUE),
('Bonus', 'INCOME', TRUE),
('Gifts Received', 'INCOME', TRUE),
('Cash Back', 'INCOME', TRUE),
('Dividends', 'INCOME', TRUE),
('Other Income', 'INCOME', TRUE),
('Groceries', 'EXPENSE', TRUE),
('Rent', 'EXPENSE', TRUE),
('Utilities', 'EXPENSE', TRUE),
('Entertainment', 'EXPENSE', TRUE),
('Transportation', 'EXPENSE', TRUE),
('Healthcare', 'EXPENSE', TRUE),
('Dining Out', 'EXPENSE', TRUE),
('Travel', 'EXPENSE', TRUE),
('Shopping', 'EXPENSE', TRUE),
('Education', 'EXPENSE', TRUE),
('Miscellaneous', 'EXPENSE', TRUE),
('Gifts Given', 'EXPENSE', TRUE);

