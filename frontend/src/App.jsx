import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { api } from './services/api.js';

// Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CartPage from './pages/CartPage.jsx';
import AddProductPage from './pages/AddProductPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  useEffect(() => {
    // Proactively warm up backend instance on Render so cold starts don't block user actions
    api.get('/health', { timeout: 60000 }).catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected routes */}
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/add-product"
                    element={
                      <ProtectedRoute>
                        <AddProductPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Catch-All */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
