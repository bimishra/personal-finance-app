CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert sample data
INSERT INTO users (id, email, display_name, roles) VALUES
(uuid_generate_v4(), 'user@example.com', 'Demo User' ),
(uuid_generate_v4(), 'admin@example.com', 'Admin User');

-- Insert sample categories
INSERT INTO categories (name, type, is_default) VALUES
('Salary', 'INCOME', TRUE),
('Interest', 'INCOME', TRUE),
('Groceries', 'EXPENSE', TRUE),
('Rent', 'EXPENSE', TRUE),
('Utilities', 'EXPENSE', TRUE),
('Entertainment', 'EXPENSE', TRUE);
