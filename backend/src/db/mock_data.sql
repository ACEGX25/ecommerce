-- ─────────────────────────────────────────────────────────────
-- ECOM MOCK DATA
-- Run: psql -U postgres -d ecom_db -f mock_data.sql
-- ─────────────────────────────────────────────────────────────

-- ─── Users (password: password123 for all) ───────────────────
INSERT INTO users (name, email, password, role, avatar_url, is_active) VALUES
('Alice Johnson',   'alice@example.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user',  'https://i.pravatar.cc/150?u=alice',   TRUE),
('Bob Smith',       'bob@example.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user',  'https://i.pravatar.cc/150?u=bob',     TRUE),
('Carol White',     'carol@example.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user',  'https://i.pravatar.cc/150?u=carol',   TRUE),
('David Brown',     'david@example.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user',  'https://i.pravatar.cc/150?u=david',   TRUE),
('Eva Martinez',    'eva@example.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user',  'https://i.pravatar.cc/150?u=eva',     TRUE),
('Frank Lee',       'frank@example.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user',  'https://i.pravatar.cc/150?u=frank',   FALSE),
('Grace Kim',       'grace@example.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user',  'https://i.pravatar.cc/150?u=grace',   TRUE),
('Henry Wilson',    'henry@example.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user',  'https://i.pravatar.cc/150?u=henry',   TRUE),
('Isla Thompson',   'isla@example.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 'https://i.pravatar.cc/150?u=isla',    TRUE),
('Jack Davis',      'jack@example.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user',  'https://i.pravatar.cc/150?u=jack',    TRUE)
ON CONFLICT (email) DO NOTHING;


-- ─── Products ────────────────────────────────────────────────
INSERT INTO products (name, description, price, stock, category, size, color, image_url, created_by) VALUES
-- Clothing
('Classic White Tee',         'Soft 100% cotton everyday t-shirt.',                          19.99,  120, 'Clothing',     'M',   'White',   'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', 1),
('Slim Fit Chinos',           'Stretch chinos perfect for casual and smart-casual looks.',   49.99,   60, 'Clothing',     '32',  'Beige',   'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',                  1),
('Denim Jacket',              'Classic blue denim jacket with button closure.',              79.99,   45, 'Clothing',     'L',   'Blue',    'https://fakestoreapi.com/img/71HblAHs1xL._AC_UY879_-2.jpg',               1),
('Floral Summer Dress',       'Light chiffon dress with floral print, perfect for summer.',  54.99,   80, 'Clothing',     'S',   'Pink',    'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg',                  1),
('Hooded Sweatshirt',         'Warm fleece-lined hoodie with kangaroo pocket.',              59.99,   90, 'Clothing',     'XL',  'Grey',    'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg',                  1),
('Running Shorts',            'Lightweight breathable shorts for workouts.',                 24.99,  150, 'Clothing',     'M',   'Black',   'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.webp',    1),
-- Electronics
('Wireless Headphones',       'Over-ear noise-cancelling Bluetooth headphones.',            129.99,   35, 'Electronics',  NULL,  'Black',   'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',                  9),
('Mechanical Keyboard',       'TKL mechanical keyboard with Cherry MX Blue switches.',       89.99,   25, 'Electronics',  NULL,  'White',   'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg',                  9),
('USB-C Hub 7-in-1',          'Multiport adapter with HDMI, USB-A, SD card reader.',         39.99,   70, 'Electronics',  NULL,  'Silver',  'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',                  9),
('Portable Power Bank 20K',   '20,000 mAh fast-charging power bank.',                        44.99,   55, 'Electronics',  NULL,  'Black',   'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg',                  9),
('Smart Watch Series 5',      'Fitness tracker with heart rate monitor and GPS.',           199.99,   20, 'Electronics',  NULL,  'Black',   'https://fakestoreapi.com/img/71kEqp3aZaL._AC_SX679_.jpg',                  9),
('Webcam 1080p',              'Full HD webcam with built-in microphone.',                    59.99,   40, 'Electronics',  NULL,  'Black',   'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',                  9),
-- Accessories
('Leather Wallet',            'Slim genuine leather bifold wallet.',                         29.99,  100, 'Accessories',  NULL,  'Brown',   'https://fakestoreapi.com/img/81fAZal24fL._AC_UY879_.jpg',                  1),
('Canvas Tote Bag',           'Durable canvas tote with inner zip pocket.',                  18.99,  200, 'Accessories',  NULL,  'Natural', 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.webp',    1),
('Stainless Steel Watch',     'Minimalist stainless steel watch with mesh bracelet.',        89.99,   30, 'Accessories',  NULL,  'Silver',  'https://fakestoreapi.com/img/71kEqp3aZaL._AC_SX679_.jpg',                  1),
('Sunglasses Polarized',      'UV400 polarized sunglasses with wooden arms.',                34.99,   75, 'Accessories',  NULL,  'Black',   'https://fakestoreapi.com/img/81fAZal24fL._AC_UY879_.jpg',                  1),
-- Home & Living
('Scented Soy Candle',        'Hand-poured soy wax candle, lavender & vanilla scent.',       16.99,  180, 'Home',         NULL,  'Cream',   'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',                  9),
('Ceramic Coffee Mug 350ml',  'Minimalist ceramic mug, microwave and dishwasher safe.',      12.99,  300, 'Home',         NULL,  'White',   'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', 9),
('Bamboo Cutting Board',      'Eco-friendly bamboo cutting board with juice groove.',        27.99,   85, 'Home',         NULL,  'Natural', 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.webp',    9),
('Throw Pillow Set (2)',       'Soft velvet throw pillows with removable covers.',            32.99,   60, 'Home',         NULL,  'Mustard', 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg',                  9)
ON CONFLICT DO NOTHING;


-- ─── Orders ──────────────────────────────────────────────────
-- user ids: alice=2, bob=3, carol=4, david=5, eva=6, grace=8, henry=9, jack=11
INSERT INTO orders (user_id, total_amount, status, shipping_address, created_at) VALUES
(2,  149.97, 'delivered',  '12 Maple St, Springfield, IL 62701',          NOW() - INTERVAL '30 days'),
(3,   89.99, 'delivered',  '45 Oak Ave, Portland, OR 97201',               NOW() - INTERVAL '25 days'),
(4,  184.97, 'shipped',    '8 Pine Rd, Austin, TX 78701',                  NOW() - INTERVAL '10 days'),
(5,   64.98, 'confirmed',  '99 Elm Blvd, Denver, CO 80201',                NOW() - INTERVAL '5 days'),
(6,  259.98, 'pending',    '3 Birch Lane, Seattle, WA 98101',              NOW() - INTERVAL '2 days'),
(2,   79.99, 'cancelled',  '12 Maple St, Springfield, IL 62701',          NOW() - INTERVAL '20 days'),
(8,  112.97, 'delivered',  '76 Cedar Dr, Miami, FL 33101',                 NOW() - INTERVAL '40 days'),
(9,   44.99, 'shipped',    '21 Walnut Ct, Chicago, IL 60601',              NOW() - INTERVAL '7 days'),
(11, 219.97, 'confirmed',  '5 Sycamore Way, New York, NY 10001',           NOW() - INTERVAL '3 days'),
(4,   59.99, 'delivered',  '8 Pine Rd, Austin, TX 78701',                  NOW() - INTERVAL '60 days');


-- ─── Order Items ─────────────────────────────────────────────
-- order 1 (alice, delivered): Headphones + Tee + Wallet
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES
(1,  7,  1, 129.99),  -- Wireless Headphones
(1,  1,  1,  19.99),  -- Classic White Tee
-- order 2 (bob, delivered): Mechanical Keyboard
(2,  8,  1,  89.99),
-- order 3 (carol, shipped): Smart Watch + Hoodie + Leather Wallet
(3, 11,  1, 199.99),  -- Smart Watch
(3,  5,  1,  59.99),  -- Hooded Sweatshirt ... total 259.98 (mock, close enough)
-- order 4 (david, confirmed): Sunglasses + Running Shorts
(4, 16,  1,  34.99),
(4,  6,  1,  24.99),  -- Running Shorts... + Ceramic Mug x2
(4, 18,  2,  12.99),
-- order 5 (eva, pending): Smart Watch + Power Bank
(5, 11,  1, 199.99),
(5, 10,  1,  44.99),
-- order 6 (alice, cancelled): Denim Jacket
(6,  3,  1,  79.99),
-- order 7 (grace, delivered): USB Hub + Canvas Tote + Candle
(7,  9,  1,  39.99),
(7, 14,  1,  18.99),
(7, 17,  1,  16.99),
-- order 8 (henry, shipped): Power Bank
(8, 10,  1,  44.99),
-- order 9 (jack, confirmed): Denim Jacket + Chinos + Watch
(9,  3,  1,  79.99),
(9,  2,  1,  49.99),
(9, 15,  1,  89.99),
-- order 10 (carol, delivered): Hoodie
(10, 5,  1,  59.99);


-- ─── Cart ────────────────────────────────────────────────────
INSERT INTO cart (user_id, product_id, quantity) VALUES
(2,  11, 1),   -- alice  → Smart Watch
(2,  19, 1),   -- alice  → Bamboo Cutting Board
(3,   1, 2),   -- bob    → Classic White Tee x2
(3,  13, 1),   -- bob    → Leather Wallet
(4,   7, 1),   -- carol  → Wireless Headphones
(5,  20, 1),   -- david  → Throw Pillow Set
(5,   5, 1),   -- david  → Hoodie
(6,  12, 1),   -- eva    → Webcam
(8,  16, 1),   -- grace  → Sunglasses
(8,   2, 1),   -- grace  → Slim Fit Chinos
(9,   9, 1),   -- henry  → USB-C Hub
(11,  4, 1),   -- jack   → Floral Summer Dress
(11, 17, 2)    -- jack   → Scented Candle x2
ON CONFLICT (user_id, product_id) DO NOTHING;


-- ─── Refresh Tokens ──────────────────────────────────────────
INSERT INTO refresh_tokens (user_id, token_hash, expires_at, revoked, ip_address, user_agent) VALUES
(2,  'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2', NOW() + INTERVAL '7 days', FALSE, '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0)'),
(3,  'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3', NOW() + INTERVAL '7 days', FALSE, '10.0.0.22',    'Mozilla/5.0 (Macintosh)'),
(4,  'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', NOW() - INTERVAL '1 day',  TRUE,  '172.16.0.5',   'Mozilla/5.0 (iPhone)'),
(9,  'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5', NOW() + INTERVAL '7 days', FALSE, '192.168.1.50', 'Mozilla/5.0 (Linux; Android 13)'),
(11, 'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6', NOW() + INTERVAL '3 days', FALSE, '10.0.1.99',    'Mozilla/5.0 (Windows NT 11.0)');


-- ─── Auth Audit Logs ─────────────────────────────────────────
INSERT INTO auth_audit_logs (user_id, action, ip_address, user_agent, metadata, created_at) VALUES
(1,  'login',           '127.0.0.1',     'curl/7.88.1',                   '{"method":"password"}',            NOW() - INTERVAL '35 days'),
(2,  'login',           '192.168.1.10',  'Mozilla/5.0 (Windows NT 10.0)', '{"method":"password"}',            NOW() - INTERVAL '31 days'),
(2,  'login',           '192.168.1.10',  'Mozilla/5.0 (Windows NT 10.0)', '{"method":"refresh_token"}',       NOW() - INTERVAL '2 hours'),
(3,  'login',           '10.0.0.22',     'Mozilla/5.0 (Macintosh)',        '{"method":"password"}',            NOW() - INTERVAL '26 days'),
(4,  'login',           '172.16.0.5',    'Mozilla/5.0 (iPhone)',           '{"method":"password"}',            NOW() - INTERVAL '11 days'),
(4,  'token_revoked',   '172.16.0.5',    'Mozilla/5.0 (iPhone)',           '{"reason":"user_logout"}',         NOW() - INTERVAL '1 day'),
(5,  'login',           '10.0.0.55',     'Mozilla/5.0 (Windows NT 10.0)', '{"method":"password"}',            NOW() - INTERVAL '6 days'),
(6,  'login',           '10.0.1.77',     'Mozilla/5.0 (Linux; Android 13)','{"method":"password"}',           NOW() - INTERVAL '3 days'),
(9,  'login',           '192.168.1.50',  'Mozilla/5.0 (Linux; Android 13)','{"method":"password"}',           NOW() - INTERVAL '8 days'),
(NULL,'failed_login',   '45.33.32.156',  'python-requests/2.28',           '{"email":"hacker@spam.com","reason":"user_not_found"}', NOW() - INTERVAL '1 day'),
(2,  'password_change', '192.168.1.10',  'Mozilla/5.0 (Windows NT 10.0)', '{"triggered_by":"user"}',          NOW() - INTERVAL '15 days'),
(11, 'login',           '10.0.1.99',     'Mozilla/5.0 (Windows NT 11.0)', '{"method":"password"}',            NOW() - INTERVAL '4 days');