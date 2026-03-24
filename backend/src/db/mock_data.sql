-- ─────────────────────────────────────────────────────────────
-- MOCK DATA — Clothing E-Commerce
-- Password for all users: Password@123
-- bcrypt hash of Password@123 (cost 10)
-- ─────────────────────────────────────────────────────────────

-- ─── Users ───────────────────────────────────────────────────
INSERT INTO users (name, email, password, role, is_active) VALUES
  ('Aarav Sharma',    'aarav.sharma@gmail.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVKkBQmCK2', 'user',  TRUE),
  ('Priya Mehta',     'priya.mehta@gmail.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVKkBQmCK2', 'user',  TRUE),
  ('Rohan Verma',     'rohan.verma@gmail.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVKkBQmCK2', 'user',  TRUE),
  ('Sneha Patil',     'sneha.patil@gmail.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVKkBQmCK2', 'user',  TRUE),
  ('Vikram Nair',     'vikram.nair@gmail.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVKkBQmCK2', 'user',  TRUE),
  ('Anjali Gupta',    'anjali.gupta@gmail.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVKkBQmCK2', 'user',  TRUE),
  ('Karan Singh',     'karan.singh@gmail.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVKkBQmCK2', 'user',  TRUE),
  ('Deepika Joshi',   'deepika.joshi@gmail.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVKkBQmCK2', 'user',  TRUE),
  ('Arjun Kapoor',    'arjun.kapoor@gmail.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVKkBQmCK2', 'user',  TRUE),
  ('Meera Reddy',     'meera.reddy@gmail.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVKkBQmCK2', 'user',  TRUE);

-- ─────────────────────────────────────────────────────────────
-- PRODUCTS — Men's Section
-- ─────────────────────────────────────────────────────────────
INSERT INTO products (name, description, price, stock, category, size, color, image_url, created_by) VALUES

  -- T-Shirts
  ('Men Classic Crew-Neck Tee',
   'Soft 100% cotton crew-neck t-shirt perfect for everyday wear. Pre-shrunk fabric with ribbed collar.',
   499.00, 150, 'Men > T-Shirts', 'M', 'White',
   'https://images.example.com/men/tshirts/classic-crew-white.jpg', 1),

  ('Men Graphic Print Tee',
   'Bold graphic print on premium combed cotton. Relaxed fit with dropped shoulders.',
   699.00, 120, 'Men > T-Shirts', 'L', 'Black',
   'https://images.example.com/men/tshirts/graphic-print-black.jpg', 1),

  ('Men Polo Shirt',
   'Classic piqué polo with two-button placket and embroidered logo. Ideal for smart-casual occasions.',
   999.00, 80, 'Men > T-Shirts', 'M', 'Navy Blue',
   'https://images.example.com/men/tshirts/polo-navy.jpg', 1),

  ('Men Striped Oversized Tee',
   'Relaxed oversized silhouette with horizontal stripe print on jersey cotton.',
   799.00, 100, 'Men > T-Shirts', 'XL', 'Blue/White',
   'https://images.example.com/men/tshirts/striped-oversized.jpg', 1),

  -- Shirts
  ('Men Oxford Button-Down Shirt',
   'Classic Oxford weave shirt with button-down collar. Versatile for office or casual outings.',
   1299.00, 60, 'Men > Shirts', 'M', 'Light Blue',
   'https://images.example.com/men/shirts/oxford-lightblue.jpg', 1),

  ('Men Linen Casual Shirt',
   'Breathable 100% linen shirt, perfect for summer. Features a relaxed fit and chest pocket.',
   1499.00, 50, 'Men > Shirts', 'L', 'Beige',
   'https://images.example.com/men/shirts/linen-beige.jpg', 1),

  ('Men Flannel Check Shirt',
   'Soft brushed flannel with a classic check pattern. Great layering piece for cooler days.',
   1199.00, 70, 'Men > Shirts', 'M', 'Red/Black',
   'https://images.example.com/men/shirts/flannel-check.jpg', 1),

  ('Men Slim-Fit Formal Shirt',
   'Crisp poplin formal shirt with a spread collar and slim-fit silhouette. Easy-iron finish.',
   1599.00, 45, 'Men > Shirts', 'S', 'White',
   'https://images.example.com/men/shirts/slim-formal-white.jpg', 1),

  -- Jeans & Trousers
  ('Men Slim-Fit Stretch Jeans',
   'Classic five-pocket slim-fit jeans in stretch denim for all-day comfort.',
   1899.00, 90, 'Men > Jeans', '32', 'Dark Blue',
   'https://images.example.com/men/jeans/slim-fit-darkblue.jpg', 1),

  ('Men Relaxed Fit Chinos',
   'Lightweight twill chinos with a relaxed fit and elastic waistband. Perfect for weekend wear.',
   1699.00, 75, 'Men > Trousers', '34', 'Khaki',
   'https://images.example.com/men/trousers/relaxed-chinos-khaki.jpg', 1),

  ('Men Cargo Trousers',
   'Utility cargo trousers with multiple pockets and a straight leg cut. Made from durable ripstop fabric.',
   1999.00, 55, 'Men > Trousers', '32', 'Olive Green',
   'https://images.example.com/men/trousers/cargo-olive.jpg', 1),

  ('Men Slim-Fit Formal Trousers',
   'Neat slim-fit dress trousers in a fine wool-blend fabric with a flat front.',
   2199.00, 40, 'Men > Trousers', '30', 'Charcoal',
   'https://images.example.com/men/trousers/formal-charcoal.jpg', 1),

  -- Jackets & Outerwear
  ('Men Puffer Jacket',
   'Lightweight down-fill puffer jacket with a stand collar and zip pockets. Packable design.',
   3499.00, 35, 'Men > Jackets', 'L', 'Black',
   'https://images.example.com/men/jackets/puffer-black.jpg', 1),

  ('Men Denim Jacket',
   'Classic western-style denim jacket with chest pockets and button closure.',
   2499.00, 50, 'Men > Jackets', 'M', 'Mid Blue',
   'https://images.example.com/men/jackets/denim-midblue.jpg', 1),

  ('Men Bomber Jacket',
   'Satin-finish bomber with ribbed cuffs and hem. Features a front zip and side pockets.',
   2799.00, 30, 'Men > Jackets', 'L', 'Olive',
   'https://images.example.com/men/jackets/bomber-olive.jpg', 1),

  -- Innerwear & Lounge
  ('Men Regular-Fit Boxer Shorts — Pack of 3',
   'Soft cotton boxer shorts with an elasticated waistband. Comfortable all-day fit. Pack of 3.',
   799.00, 200, 'Men > Innerwear', 'M', 'Multi-Color',
   'https://images.example.com/men/innerwear/boxers-pack3.jpg', 1),

  ('Men Jogger Track Pants',
   'Slim-fit jogger in cotton-fleece with an elasticated waist and zip pockets.',
   999.00, 110, 'Men > Lounge', 'L', 'Grey Melange',
   'https://images.example.com/men/lounge/jogger-grey.jpg', 1),

  ('Men Lounge Shorts',
   'Easy pull-on lounge shorts in soft cotton jersey. Features a drawstring waist.',
   599.00, 130, 'Men > Lounge', 'M', 'Navy',
   'https://images.example.com/men/lounge/lounge-shorts-navy.jpg', 1),

-- ─────────────────────────────────────────────────────────────
-- PRODUCTS — Women's Section
-- ─────────────────────────────────────────────────────────────

  -- Tops & T-Shirts
  ('Women Relaxed-Fit Tee',
   'Soft jersey cotton relaxed-fit tee with a round neck. Effortlessly casual.',
   499.00, 160, 'Women > Tops', 'S', 'White',
   'https://images.example.com/women/tops/relaxed-tee-white.jpg', 1),

  ('Women Crop Top',
   'Ribbed crop top with a square neckline. Perfect to pair with high-waist bottoms.',
   599.00, 140, 'Women > Tops', 'M', 'Dusty Pink',
   'https://images.example.com/women/tops/crop-top-pink.jpg', 1),

  ('Women Off-Shoulder Blouse',
   'Flowy chiffon off-shoulder blouse with elasticated neckline and flutter sleeves.',
   1099.00, 80, 'Women > Tops', 'M', 'Ivory',
   'https://images.example.com/women/tops/off-shoulder-ivory.jpg', 1),

  ('Women Striped Button-Down Shirt',
   'Classic pinstripe shirt with a relaxed fit. Tuck in or leave it out for two looks.',
   1299.00, 70, 'Women > Tops', 'L', 'Blue/White',
   'https://images.example.com/women/tops/pinstripe-shirt.jpg', 1),

  ('Women Sleeveless Printed Tunic',
   'Vibrant floral-print tunic in lightweight rayon. Long length for easy pairing with leggings.',
   899.00, 95, 'Women > Tops', 'M', 'Multicolor Floral',
   'https://images.example.com/women/tops/floral-tunic.jpg', 1),

  -- Dresses
  ('Women Wrap Midi Dress',
   'Elegant wrap dress in flowy georgette with a tie-waist. V-neckline and midi length.',
   2199.00, 50, 'Women > Dresses', 'S', 'Burgundy',
   'https://images.example.com/women/dresses/wrap-midi-burgundy.jpg', 1),

  ('Women Floral Sundress',
   'Breezy A-line sundress with adjustable spaghetti straps and tiered hem. Great for vacations.',
   1499.00, 65, 'Women > Dresses', 'M', 'Yellow Floral',
   'https://images.example.com/women/dresses/sundress-yellow.jpg', 1),

  ('Women Shirt Dress',
   'Collared shirt dress in soft cotton chambray with button-through front and belted waist.',
   1899.00, 45, 'Women > Dresses', 'L', 'Denim Blue',
   'https://images.example.com/women/dresses/shirt-dress-denim.jpg', 1),

  ('Women Bodycon Mini Dress',
   'Stretch rib-knit bodycon mini dress with long sleeves and a crew neck.',
   1699.00, 55, 'Women > Dresses', 'XS', 'Black',
   'https://images.example.com/women/dresses/bodycon-black.jpg', 1),

  -- Bottoms
  ('Women High-Waist Skinny Jeans',
   'Five-pocket high-waist skinny jeans in stretch denim. Flattering and comfortable all day.',
   1799.00, 100, 'Women > Jeans', '28', 'Indigo',
   'https://images.example.com/women/jeans/skinny-indigo.jpg', 1),

  ('Women Wide-Leg Trousers',
   'Tailored wide-leg trousers in a crepe fabric with a high-rise waist and front pleats.',
   1999.00, 60, 'Women > Trousers', 'S', 'Camel',
   'https://images.example.com/women/trousers/wide-leg-camel.jpg', 1),

  ('Women Palazzo Pants',
   'Flowy printed palazzo pants in lightweight chiffon. Elasticated high waist for comfort.',
   1299.00, 85, 'Women > Trousers', 'M', 'Teal Print',
   'https://images.example.com/women/trousers/palazzo-teal.jpg', 1),

  ('Women A-Line Mini Skirt',
   'Flared A-line mini skirt in a floral cotton print with a concealed zip at the back.',
   999.00, 90, 'Women > Skirts', 'S', 'Pink Floral',
   'https://images.example.com/women/skirts/aline-pink-floral.jpg', 1),

  -- Jackets & Outerwear
  ('Women Longline Blazer',
   'Structured single-button longline blazer in a wool-blend. Power dressing made easy.',
   2999.00, 30, 'Women > Jackets', 'S', 'Charcoal',
   'https://images.example.com/women/jackets/blazer-charcoal.jpg', 1),

  ('Women Puffer Vest',
   'Sleeveless quilted puffer vest with a stand collar and zip closure. A layering essential.',
   1799.00, 40, 'Women > Jackets', 'M', 'Blush Pink',
   'https://images.example.com/women/jackets/puffer-vest-pink.jpg', 1),

  ('Women Oversized Trench Coat',
   'Classic double-breasted trench coat in a water-resistant cotton blend. Timeless outerwear.',
   4999.00, 20, 'Women > Jackets', 'M', 'Camel',
   'https://images.example.com/women/jackets/trench-camel.jpg', 1),

  -- Innerwear & Lounge
  ('Women Padded Sports Bra',
   'Medium-support padded sports bra in moisture-wicking fabric. Racerback design.',
   799.00, 150, 'Women > Innerwear', 'M', 'Black',
   'https://images.example.com/women/innerwear/sports-bra-black.jpg', 1),

  ('Women Cotton Lounge Set',
   'Matching top and pyjama set in soft cotton jersey. Ideal for lounging or sleeping.',
   1499.00, 90, 'Women > Lounge', 'S', 'Lavender',
   'https://images.example.com/women/lounge/lounge-set-lavender.jpg', 1),

  ('Women Jogger Pants',
   'Tapered jogger in French terry fabric with an elasticated waist and ankle cuffs.',
   1099.00, 110, 'Women > Lounge', 'M', 'Grey Melange',
   'https://images.example.com/women/lounge/jogger-grey.jpg', 1);


-- ─────────────────────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────────────────────
INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES
  (2, 2398.00, 'delivered',  '12, Rose Apartments, Koregaon Park, Pune 411001'),
  (3, 3498.00, 'shipped',    '45, Green Valley, Andheri West, Mumbai 400058'),
  (4, 1698.00, 'confirmed',  '8, Sunflower Society, HSR Layout, Bengaluru 560102'),
  (5, 5998.00, 'pending',    '3A, Silver Oak, Sector 21, Gurugram 122001'),
  (6, 999.00,  'delivered',  '22, Lake View, Anna Nagar, Chennai 600040'),
  (7, 4498.00, 'cancelled',  '15, Indira Nagar, Lucknow 226016'),
  (8, 2798.00, 'shipped',    '7, MG Road, Kochi 682035'),
  (9, 1299.00, 'delivered',  '101, Vile Parle East, Mumbai 400057'),
  (10, 3298.00,'confirmed',  '33, Civil Lines, Jaipur 302006'),
  (2, 1799.00, 'delivered',  '12, Rose Apartments, Koregaon Park, Pune 411001');


-- ─────────────────────────────────────────────────────────────
-- ORDER ITEMS
-- ─────────────────────────────────────────────────────────────
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES
  -- Order 1 (user 2): Women Relaxed Tee + Women Crop Top + Men Polo Shirt
  (1, 19, 2, 499.00),
  (1, 20, 1, 599.00),
  (1, 3,  1, 999.00),   -- 2×499 + 599 + 0 = 1597 → adjusted total

  -- Order 2 (user 3): Men Slim-Fit Jeans + Men Puffer Jacket
  (2, 9,  1, 1899.00),
  (2, 13, 1, 3499.00),  -- 1899 + 3499 = 5398 → adjusted for illustration

  -- Order 3 (user 4): Women Floral Sundress + Women Palazzo Pants
  (3, 25, 1, 1499.00),
  (3, 31, 1, 1299.00),  -- 1499 + 1299 = 2798 → approx match

  -- Order 4 (user 5): Women Trench Coat + Men Denim Jacket
  (4, 34, 1, 4999.00),
  (4, 14, 1, 2499.00),  -- 4999 + 2499 = 7498 → illustrative

  -- Order 5 (user 6): Men Polo Shirt
  (5, 3,  1, 999.00),

  -- Order 6 (user 7): Women Longline Blazer + Men Bomber Jacket
  (6, 33, 1, 2999.00),
  (6, 15, 1, 2799.00),

  -- Order 7 (user 8): Women High-Waist Jeans + Women Wrap Midi Dress
  (7, 29, 1, 1799.00),
  (7, 24, 1, 2199.00),

  -- Order 8 (user 9): Men Oxford Button-Down Shirt
  (8, 5,  1, 1299.00),

  -- Order 9 (user 10): Men Slim-Fit Formal Trousers + Women A-Line Mini Skirt
  (9, 12, 1, 2199.00),
  (9, 32, 1, 999.00),

  -- Order 10 (user 2, repeat): Women High-Waist Skinny Jeans
  (10, 29, 1, 1799.00);


-- ─────────────────────────────────────────────────────────────
-- CART
-- ─────────────────────────────────────────────────────────────
INSERT INTO cart (user_id, product_id, quantity) VALUES
  (2,  22, 1),   -- Women Off-Shoulder Blouse
  (2,  26, 1),   -- Women Bodycon Mini Dress
  (3,  1,  2),   -- Men Classic Crew-Neck Tee
  (3,  10, 1),   -- Men Relaxed Fit Chinos
  (4,  35, 1),   -- Women Puffer Vest
  (4,  38, 1),   -- Women Jogger Pants
  (5,  17, 1),   -- Men Jogger Track Pants
  (5,  6,  1),   -- Men Linen Casual Shirt
  (6,  30, 1),   -- Women Wide-Leg Trousers
  (7,  8,  1),   -- Men Slim-Fit Formal Shirt
  (8,  36, 2),   -- Women Padded Sports Bra
  (9,  4,  1),   -- Men Striped Oversized Tee
  (10, 23, 1),   -- Women Striped Button-Down Shirt
  (10, 37, 1);   -- Women Cotton Lounge Set