import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { ComparePage } from '../pages/ComparePage';
import { WishlistPage } from '../pages/WishlistPage';
import { CalculatorsPage } from '../pages/CalculatorsPage';
import { StoresPage } from '../pages/StoresPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/product/:slug" element={<ProductDetailPage />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/calculators" element={<CalculatorsPage />} />
      <Route path="/stores" element={<StoresPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};
