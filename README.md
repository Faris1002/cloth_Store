# ModernWear — Full-Stack Clothing Store E-Commerce Application

A complete, production-ready full-stack clothing store application built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express.js**, and **Supabase PostgreSQL**.

---

## 🌟 Features Overview

- **Supabase Authentication**:
  - Secure email/password user registration, login, session persistence, and logout.
  - Automatic token management; protected routes on both client and server.
- **Product Catalog**:
  - Browse apparel by category: **Men**, **Women**, **Kids**, **Accessories**, **Footwear**.
  - Search by keywords across product names and descriptions.
  - Sort by newest arrivals, price (ascending/descending), or alphabetical order.
  - Pagination controls with responsive grid layouts and skeleton loaders.
- **Product Details & Stock Validation**:
  - High-resolution imagery, descriptions, unit price, and real-time stock availability.
  - Interactive quantity stepper constrained by database stock limits.
- **Persistent Shopping Cart (Supabase)**:
  - Add items to cart, increment/decrement quantities, remove individual items, or clear cart.
  - Cart data is stored in Supabase PostgreSQL per user and restored across sessions/devices.
  - Server-calculated subtotal, tax, and shipping (never trusting client-supplied prices).
  - Free shipping progress bar ($75 threshold) and checkout simulation.
- **Product Creation (Authorized Users)**:
  - Form to publish new apparel to the store catalog.
  - Field validation with live card preview and image URL verification.
- **Security & Architecture**:
  - Helmet security headers, CORS origin whitelisting, and API rate limiting.
  - Zod validation on incoming request bodies, queries, and parameters.
  - Database Row Level Security (RLS) guaranteeing strict cart isolation and product ownership.

---

## 📁 Project Structure

```
clothing-store/
├── .gitignore                      # Root Git ignore
├── package.json                    # Root scripts to orchestrate frontend & backend
├── README.md                       # Complete guide & documentation
├── backend/
│   ├── package.json
│   ├── server.js                   # Server entry point & graceful shutdown
│   ├── .env.example                # Backend environment template
│   ├── .gitignore
│   ├── supabase/
│   │   └── migrations/
│   │       └── 001_initial_schema.sql # Production PostgreSQL migration & seed data
│   └── src/
│       ├── app.js                  # Express setup (Helmet, CORS, rate limits)
│       ├── config/
│       │   ├── env.js              # Environment variable validation via Zod
│       │   └── supabase.js         # Supabase admin and scoped client factories
│       ├── controllers/
│       │   ├── authController.js   # User info and signout endpoints
│       │   ├── productController.js# Product listing, details, CRUD
│       │   └── cartController.js   # User-isolated cart operations & calculations
│       ├── middleware/
│       │   ├── auth.js             # Bearer JWT verification using Supabase Auth
│       │   ├── errorHandler.js     # Centralized error & 404 handlers
│       │   ├── rateLimiter.js      # Global & auth rate limits
│       │   └── validate.js         # Generic Zod validation middleware
│       ├── routes/
│       │   ├── authRoutes.js       # /api/auth endpoints
│       │   ├── productRoutes.js    # /api/products endpoints
│       │   ├── cartRoutes.js       # /api/cart endpoints
│       │   └── healthRoutes.js     # /api/health endpoint
│       ├── utils/
│       │   └── response.js         # Consistent API success & error responses
│       └── validators/
│           ├── authValidator.js
│           ├── productValidator.js
│           ├── cartValidator.js
│           └── commonValidator.js
└── frontend/
    ├── index.html                  # HTML entry with SEO metadata and Google Font
    ├── package.json
    ├── vite.config.js              # Vite configuration
    ├── tailwind.config.js          # Tailwind CSS design system
    ├── postcss.config.js
    ├── .env.example                # Frontend environment template
    ├── .gitignore
    └── src/
        ├── App.jsx                 # App routing & provider setup
        ├── main.jsx                # React DOM root entry
        ├── index.css               # Tailwind directives & styles
        ├── constants/
        │   └── categories.js       # Categories metadata & images
        ├── lib/
        │   └── supabase.js         # Client-side Supabase client
        ├── services/
        │   ├── api.js              # Axios client with automatic Bearer token injection
        │   ├── authService.js      # Auth API & Supabase Auth client methods
        │   ├── productService.js   # Products API client
        │   └── cartService.js      # Cart API client
        ├── context/
        │   ├── AuthContext.jsx     # Supabase Auth state synchronization
        │   ├── CartContext.jsx     # Persistent cart management
        │   └── ToastContext.jsx    # User feedback notifications
        ├── components/
        │   ├── Navbar.jsx          # Glassmorphic header with live cart count
        │   ├── Footer.jsx          # Footer with store policies and links
        │   ├── ProductCard.jsx     # Card with image, stock check, and quick-add
        │   ├── ProductGrid.jsx     # Responsive grid with skeleton loaders
        │   ├── ProductSearch.jsx   # Debounced search bar
        │   ├── CategoryFilter.jsx  # Category filter pills
        │   ├── CartItem.jsx        # Cart line item with quantity stepper
        │   ├── CartSummary.jsx     # Order summary and checkout
        │   ├── ProtectedRoute.jsx  # Route guard for authenticated views
        │   ├── LoadingSpinner.jsx
        │   ├── ErrorMessage.jsx
        │   └── EmptyState.jsx
        └── pages/
            ├── HomePage.jsx        # Landing page with hero banner & arrivals
            ├── ProductsPage.jsx    # Filterable and sortable catalog
            ├── ProductDetailsPage.jsx # Full garment view with stock check
            ├── LoginPage.jsx       # Email & password login
            ├── RegisterPage.jsx    # New user registration
            ├── CartPage.jsx        # Shopping bag page
            ├── AddProductPage.jsx  # New apparel listing form
            └── NotFoundPage.jsx    # Custom 404 page
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- Node.js (v18.x or v20.x or v22.x)
- npm (v9.x or higher)
- A free account at [Supabase](https://supabase.com)

### 2. Install All Dependencies
From the repository root, install dependencies for both frontend and backend:
```bash
npm run install:all
```
Or install each separately:
```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

---

## 🗄️ Database Setup (Supabase PostgreSQL Migration)

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. In your project dashboard, navigate to **SQL Editor** from the left navigation.
3. Open the migration files in this repository:
   - `backend/supabase/migrations/001_initial_schema.sql` (Creates products, cart_items, and seed catalog)
   - `backend/supabase/migrations/002_create_users_table.sql` (Creates custom users credentials table to bypass email rate limits)
4. Copy the contents of each file and paste them into the Supabase SQL Editor.
5. Click **Run** to execute the scripts.

### What the Migration Does:
- Creates the `products` table with constraints (`price > 0`, `stock_quantity >= 0`, supported categories).
- Creates the `cart_items` table with foreign keys referencing `auth.users(id)` and `products(id)`, with a unique constraint on `(user_id, product_id)`.
- Sets up automatic `updated_at` timestamps using a PostgreSQL trigger.
- Creates indexes on `category`, `name`, `created_at`, `price`, `user_id`, and `product_id`.
- Configures **Row Level Security (RLS)**:
  - Products: publicly readable; inserts, updates, and deletes restricted to product creators.
  - Cart items: users can only view, insert, update, or delete their own cart rows (`user_id = auth.uid()`).
- Inserts curated initial seed apparel across Men, Women, Kids, Accessories, and Footwear with high-resolution imagery.

---

## 🔑 Environment Variables Configuration

### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-publishable-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-secret-key
```

### Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-anon-key
```

### Where to Find Your Supabase Credentials:
1. In your Supabase Project, click **Project Settings** (gear icon) > **API**.
2. **Project URL**: Copy this for `SUPABASE_URL` / `VITE_SUPABASE_URL`.
3. **Project API Keys**:
   - `anon` `public`: Copy this for `SUPABASE_ANON_KEY` and `VITE_SUPABASE_ANON_KEY`.
   - `service_role` `secret`: Copy this for `SUPABASE_SERVICE_ROLE_KEY` (**never** put this in the frontend).

---

## 🚀 Running the Application Locally

You can run both backend and frontend concurrently with a single command from the project root:

```bash
npm run dev
```

Or run them in separate terminals:

```bash
# Terminal 1 - Backend API (Port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend React App (Port 5173)
cd frontend
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 🧪 Production Build & Verification

To build and verify the frontend production bundle:

```bash
# From root
npm run build

# Or directly in frontend
cd frontend
npm run build
```

---

## 🌐 Deployment Instructions

### Frontend (e.g., Vercel, Netlify, Cloudflare Pages)
1. Link your Git repository to Vercel or Netlify.
2. Set the **Root Directory** to `frontend`.
3. Set **Build Command** to `npm run build` and **Output Directory** to `dist`.
4. Configure Environment Variables in the hosting dashboard:
   - `VITE_API_BASE_URL`: The production URL of your backend (e.g., `https://api.yourdomain.com/api`).
   - `VITE_SUPABASE_URL`: Your Supabase Project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.

### Backend (e.g., Render, Railway, Fly.io, Heroku)
1. Deploy from the `backend` folder.
2. Set **Start Command** to `node server.js`.
3. Configure Environment Variables:
   - `PORT`: Provided by host or `5000`.
   - `NODE_ENV`: `production`.
   - `FRONTEND_URL`: Your deployed frontend URL (e.g., `https://modernwear.vercel.app`).
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

---

## 🔒 Security Best Practices Implemented

- **Cart Isolation**: Database RLS and server token checks ensure users can never view or modify another user's cart.
- **Server Price Calculation**: Cart line totals and order subtotals are computed strictly using database price values.
- **Stock Guard**: Adding to cart and updating quantities are validated against live database stock counts.
- **Request Validation**: All inputs (bodies, query parameters, route UUIDs) are parsed and sanitized with Zod schemas.
- **Safe Authentication**: Bearer tokens are verified server-side with Supabase Auth; no plain passwords or service-role keys are ever exposed to the client.
