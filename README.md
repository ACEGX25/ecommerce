# 🛍️ Ecom Backend — Node.js + Express + PostgreSQL

A learning project for developers coming from **Spring Boot + Flutter** background.

## 🗂️ Project Structure

```
ecom-backend/
├── sql/
│   └── schema.sql          # Database tables (run once)
├── client/
│   └── frontend(next.js)
├── src/
│   ├── index.js            # Entry point 
│   ├── config/
│   │   └── db.js           # PostgreSQL connection pool
│   ├── middleware/
│   │   └── auth.js         # JWT guard 
│   ├── controllers/        # Business logic 
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   └── routes/             # URL mapping 
│       ├── authRoutes.js
│       ├── productRoutes.js
│       ├── cartRoutes.js
│       ├── orderRoutes.js
│       └── adminRoutes.js
├── POSTMAN_COLLECTION.json  # Import this into Postman
├── .env.example
└── package.json
```

## 🚀 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create PostgreSQL database
```bash
psql -U postgres
CREATE DATABASE ecom_db;
\q
```

### 3. Run the schema
```bash
psql -U postgres -d ecom_db -f sql/schema.sql
```

### 4. Create .env file
```bash
cp .env.example .env
# Edit .env and fill in your DB password and a JWT secret
```

### 5. Start the server
```bash
npm run dev     # development (auto-restart with nodemon)
npm start       # production
```

Server starts at: **http://localhost:5000**

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login, get JWT token |
| GET | `/api/auth/me` | User | Get own profile |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | None | List all (with filters) |
| GET | `/api/products/:id` | None | Get one product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

**Product filters:** `?category=t-shirt&size=M&color=white&minPrice=10&maxPrice=200&page=1&limit=10`

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | User | Get my cart |
| POST | `/api/cart` | User | Add item |
| PUT | `/api/cart/:id` | User | Update quantity |
| DELETE | `/api/cart/:id` | User | Remove item |
| DELETE | `/api/cart/clear` | User | Clear cart |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | User | Place order from cart |
| GET | `/api/orders` | User/Admin | My orders / all orders |
| GET | `/api/orders/:id` | User/Admin | Order details |
| PATCH | `/api/orders/:id/status` | Admin | Update order status |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET | `/api/admin/users` | Admin | List all users |

---

## 🧪 Testing with Postman

1. Import `POSTMAN_COLLECTION.json` into Postman
2. Run **"Login as Admin"** first → token auto-saves to collection variable
3. Run **"Login as User"** → user token auto-saves
4. All subsequent requests use the saved tokens automatically

**Default Admin:** `admin@ecom.com` / `password`
