CREATE DATABASE finance_db;
CREATE USER finance_user WITH ENCRYPTED PASSWORD 'finance_pass';
GRANT ALL PRIVILEGES ON DATABASE finance_db TO finance_user;


-- Optional: Create a schema for better organization --
-- CREATE SCHEMA finance_schema AUTHORIZATION finance_user;
--GRANT USAGE ON SCHEMA finance_schema TO finance_user;
--GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA finance_schema TO finance_user;
--GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA finance_schema TO finance_user;
--ALTER DEFAULT PRIVILEGES IN SCHEMA finance_schema
--GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO finance_user;
--ALTER DEFAULT PRIVILEGES IN SCHEMA finance_schema
--GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO finance_user;
