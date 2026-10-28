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

## 🌐 Step-by-Step Deployment Guide (Render + Vercel)

This project is organized as a monorepo containing both the backend Express API and the frontend React application. Follow these instructions to deploy the **Backend on Render** and the **Frontend on Vercel**.

```
┌────────────────────────┐         ┌────────────────────────┐         ┌────────────────────────┐
│     Vercel (React)     │ ──────> │     Render (Express)   │ ──────> │   Supabase PostgreSQL  │
│  modernwear.vercel.app │  REST   │ modernwear.onrender.com│ SQL/Auth│  gsarrfbnnvdpyqikqkmb  │
└────────────────────────┘         └────────────────────────┘         └────────────────────────┘
```

---

### Step 1: Push Code to GitHub

Ensure your project is pushed to a remote GitHub repository:

1. Check that `.env` files are ignored so secrets are not pushed:
   ```bash
   git status
   ```
   *(Ensure `backend/.env` and `frontend/.env` are listed in `.gitignore` and not tracked)*
  
2. Commit and push your code:
   ```bash
   git add .
   git commit -m "Configure production deployment for Render and Vercel"
   git push origin main
   ```

---

### Step 2: Deploy Backend on Render (Web Service)

[Render](https://render.com) hosts the Node.js Express API.

1. **Sign in to Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com) and log in with your GitHub account.

2. **Create a New Web Service**:
   - Click the **New +** button in the top navigation bar.
   - Select **Web Service**.
   - Choose **Build and deploy from a Git repository**.
   - Select your repository from the list and click **Connect**.

3. **Configure the Web Service Settings**:
   Fill in the service details:
   - **Name**: `cloth-store-backend` *(or any unique name of your choice)*
   - **Region**: Choose the region closest to your users (e.g., *Frankfurt*, *Oregon*, *Singapore*)
   - **Branch**: `main`
   - **Root Directory**: `backend`  *(⚠️ CRITICAL: do not leave blank! This tells Render to run inside the backend folder)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` *(or `node server.js`)*
   - **Instance Type**: Select **Free**

4. **Add Environment Variables**:
   Scroll down to the **Environment Variables** section and click **Add Environment Variable** for each of the following:

   | Key | Value | Description |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `PORT` | `5000` | Render assigns port dynamically, handled automatically |
   | `FRONTEND_URL` | `https://*.vercel.app` *(or your Vercel URL once created)* | Allowed CORS origin |
   | `SUPABASE_URL` | `https://gsarrfbnnvdpyqikqkmb.supabase.co` | Your Supabase Project URL |
   | `SUPABASE_ANON_KEY` | `your-supabase-anon-key` | Your public Supabase anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | `your-supabase-service-role-key` | Privileged Supabase secret key |
   | `JWT_SECRET` | *(Enter any random 32+ character string)* | Secret for auth token signing |

5. **Deploy the Service**:
   - Click **Create Web Service** at the bottom of the page.
   - Render will clone your repository, run `npm install`, and boot `server.js`.
   - Once deployment completes, you will see a green **"Live"** badge.

6. **Copy Your Backend URL & Test Health**:
   - At the top of your Render service page, copy the generated URL:
     `https://cloth-store-backend.onrender.com`
   - Open a new browser tab and navigate to:
     `https://cloth-store-backend.onrender.com/api/health`
   - You should see a JSON response confirming health:
     ```json
     { "status": "ok", "service": "clothing-store-backend", "timestamp": "..." }
     ```

---

### Step 3: Deploy Frontend on Vercel

[Vercel](https://vercel.com) provides global CDN hosting for the Vite + React frontend.

1. **Sign in to Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in using your GitHub account.

2. **Import Your Project**:
   - From your Vercel dashboard, click **Add New...** > **Project**.
   - Find your GitHub repository and click **Import**.

3. **Configure Project Settings**:
   - **Project Name**: `cloth-store-frontend` *(or your preferred name)*
   - **Framework Preset**: `Vite` *(detected automatically)*
   - **Root Directory**:
     - Click **Edit** next to Root Directory.
     - Select the **`frontend`** folder and click **Continue**. *(⚠️ CRITICAL: Must be set to `frontend`!)*
   - **Build and Output Settings**:
     - *Build Command*: `npm run build` *(default)*
     - *Output Directory*: `dist` *(default)*
     - *Install Command*: `npm install` *(default)*

4. **Set Production Environment Variables**:
   Expand the **Environment Variables** panel and add:

   | Key | Value | Notes |
   |---|---|---|
   | `VITE_API_BASE_URL` | `https://cloth-store-backend.onrender.com/api` | **Must include `/api`** and use your Render URL from Step 2 |
   | `VITE_SUPABASE_URL` | `https://gsarrfbnnvdpyqikqkmb.supabase.co` | Your Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | `your-supabase-anon-key` | Your public Supabase anon key |

5. **Deploy**:
   - Click **Deploy**.
   - Vercel will build the frontend assets using Vite and deploy to edge servers worldwide in under a minute.
   - Once completed, click **Go to Dashboard** or click the preview image to view your live site (e.g., `https://cloth-store-frontend.vercel.app`).

---

### Step 4: Final Connection & CORS Sync

Now that your frontend has a live production URL:

1. Copy your Vercel production domain (e.g., `https://cloth-store-frontend.vercel.app`).
2. Go back to your [Render Dashboard](https://dashboard.render.com).
3. Open your backend service > Navigate to **Environment**.
4. Update the **`FRONTEND_URL`** variable:
   ```
   FRONTEND_URL = https://cloth-store-frontend.vercel.app
   ```
5. Click **Save Changes**. Render will automatically redeploy the backend with the updated CORS origin.

---

### 💡 Deployment Notes & Troubleshooting

#### 1. Single Page Application (SPA) Routing on Vercel
Vite React apps use client-side routing (`react-router-dom`). Without rewrite configuration, refreshing routes like `/products`, `/cart`, or `/login` on Vercel can cause a `404: NOT_FOUND` error.
- This project includes [`frontend/vercel.json`](file:///c:/Users/NXTWAVE/cloth%20store/frontend/vercel.json) configured with rewrites to route all traffic to `/index.html`:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

#### 2. Render Free Tier Cold Starts
- Render's free tier spins down web services after **15 minutes of inactivity** to conserve resources.
- When waking from spin-down, the first request may take **30 to 50 seconds** to respond.
- Subsequent requests will be instantaneous.

#### 3. Database Schema Verification
Make sure you have executed both SQL migration scripts in your Supabase SQL Editor:
1. `001_initial_schema.sql` (Creates products catalog & seed apparel items)
2. `002_create_users_table.sql` (Creates users credentials table & relaxes foreign key constraints)

---

## 🔒 Security Best Practices Implemented

- **Cart Isolation**: Database RLS and server token checks ensure users can never view or modify another user's cart.
- **Server Price Calculation**: Cart line totals and order subtotals are computed strictly using database price values.
- **Stock Guard**: Adding to cart and updating quantities are validated against live database stock counts.
- **Request Validation**: All inputs (bodies, query parameters, route UUIDs) are parsed and sanitized with Zod schemas.
- **Safe Authentication**: Bearer tokens are verified server-side with Supabase Auth; no plain passwords or service-role keys are ever exposed to the client.
