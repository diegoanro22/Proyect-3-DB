-- dml.sql

INSERT INTO customers (name, email) VALUES ('John Doe', 'john.doe@example.com');
INSERT INTO customers (name, email) VALUES ('Jane Smith', 'jane.smith@example.com');

INSERT INTO orders (customer_id, order_date, total_amount) VALUES (1, '2025-05-07', 100.50);
INSERT INTO orders (customer_id, order_date, total_amount) VALUES (2, '2025-05-08', 150.75);
