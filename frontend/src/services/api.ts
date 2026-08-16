import axios from 'axios';
import { Product, Category, Brand, Store, StorePrice, PriceHistoryItem, PaginatedResponse } from '../types';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pricepilot_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Helper Functions
export const fetchProducts = async (params?: Record<string, any>): Promise<PaginatedResponse<Product>> => {
  const res = await api.get('/products', { params });
  return res.data;
};

export const fetchFeaturedProducts = async (): Promise<{
  trending: Product[];
  bestDeals: Product[];
  topRated: Product[];
}> => {
  const res = await api.get('/products/featured');
  return res.data.data;
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const res = await api.get(`/products/${slug}`);
  return res.data.data;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await api.get('/categories');
  return res.data.data;
};

export const fetchBrands = async (): Promise<Brand[]> => {
  const res = await api.get('/brands');
  return res.data.data;
};

export const fetchStores = async (): Promise<Store[]> => {
  const res = await api.get('/stores');
  return res.data.data;
};

export const fetchProductPrices = async (productId: string): Promise<StorePrice[]> => {
  const res = await api.get(`/prices/product/${productId}`);
  return res.data.data;
};

export const fetchPriceHistory = async (productId: string): Promise<PriceHistoryItem[]> => {
  const res = await api.get(`/prices/history/${productId}`);
  return res.data.data;
};

export const fetchProductAlternatives = async (productId: string): Promise<Product[]> => {
  const res = await api.get(`/products/${productId}/alternatives`);
  return res.data.data;
};
