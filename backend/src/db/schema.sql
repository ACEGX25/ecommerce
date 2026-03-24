-- ─────────────────────────────────────────────────────────────
-- ECOM SCHEMA
-- Run: psql -U postgres -d ecom_db -f schema.sql
-- ─────────────────────────────────────────────────────────────

-- ─── Users ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         SERIAL       PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(10)  NOT NULL DEFAULT 'user'
                 CHECK (role IN ('user', 'admin')),
    avatar_url TEXT,
    is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ─── Refresh Tokens ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id         SERIAL      PRIMARY KEY,
    user_id    INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT        NOT NULL UNIQUE,
    expires_at TIMESTAMP   NOT NULL,
    revoked    BOOLEAN     NOT NULL DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ─── Auth Audit Logs ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auth_audit_logs (
    id         SERIAL      PRIMARY KEY,
    user_id    INTEGER     REFERENCES users(id) ON DELETE SET NULL,
    action     VARCHAR(60) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata   JSONB,
    created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ─── Products ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id          SERIAL        PRIMARY KEY,
    name        VARCHAR(200)  NOT NULL,
    description TEXT,
    price       DECIMAL(10,2) NOT NULL,
    stock       INTEGER       NOT NULL DEFAULT 0,
    category    VARCHAR(100),
    size        VARCHAR(20),
    color       VARCHAR(50),
    image_url   VARCHAR(500),
    created_by  INTEGER       REFERENCES users(id),
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ─── Orders ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id               SERIAL        PRIMARY KEY,
    user_id          INTEGER       REFERENCES users(id) ON DELETE CASCADE,
    total_amount     DECIMAL(10,2) NOT NULL,
    status           VARCHAR(20)   NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
    shipping_address TEXT,
    created_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ─── Order Items ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id                SERIAL        PRIMARY KEY,
    order_id          INTEGER       REFERENCES orders(id) ON DELETE CASCADE,
    product_id        INTEGER       REFERENCES products(id),
    quantity          INTEGER       NOT NULL,
    price_at_purchase DECIMAL(10,2) NOT NULL
);

-- ─── Cart ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart (
    id         SERIAL    PRIMARY KEY,
    user_id    INTEGER   REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER   REFERENCES products(id) ON DELETE CASCADE,
    quantity   INTEGER   NOT NULL DEFAULT 1,
    added_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

-- ─────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_email         ON users(email);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user     ON auth_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category   ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user         ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_user           ON cart(user_id);

-- ─────────────────────────────────────────────────────────────
-- TRIGGERS — auto updated_at
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at    ON users;
DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
DROP TRIGGER IF EXISTS trg_orders_updated_at   ON orders;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders   FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- SEED
-- ─────────────────────────────────────────────────────────────
-- Password: admin123
INSERT INTO users (name, email, password, role)
VALUES (
  'Admin',
  'admin@ecom.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin'
) ON CONFLICT (email) DO NOTHING;