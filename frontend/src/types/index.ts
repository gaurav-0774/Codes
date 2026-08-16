export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  productCount?: number;
}

export interface Store {
  id: string;
  name: string;
  website?: string;
  logo?: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  rating: number;
  listedPricesCount?: number;
}

export interface StorePrice {
  id: string;
  productId: string;
  storeId: string;
  price: number;
  originalPrice: number;
  discount: number;
  availability: string;
  deliveryText: string;
  productUrl: string;
  lastUpdated: string;
  lastUpdatedFormatted?: string;
  store: Store;
  badges?: {
    isBestPrice: boolean;
    isFastestDelivery: boolean;
    isBestRatedStore: boolean;
  };
}

export interface PriceHistoryItem {
  id: string;
  productId: string;
  storeId: string;
  storeName: string;
  price: number;
  recordedAt: string;
  dateFormatted: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  helpfulCount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface SmartBuyScore {
  score: number;
  label: 'Excellent Deal' | 'Good Deal' | 'Fair Deal' | 'Consider Alternatives';
  color: string;
  breakdown: {
    priceScore: number;
    ratingScore: number;
    reviewScore: number;
    specScore: number;
    discountScore: number;
    historyScore: number;
  };
  explanation: string;
}

export interface BuyWaitRecommendation {
  recommendation: 'BUY NOW' | 'FAIR PRICE' | 'WAIT FOR PRICE DROP';
  badgeColor: string;
  currentPrice: number;
  thirtyDayAverage: number;
  historicalLowest: number;
  savingsVsAverage: number;
  savingsPercentage: number;
  reason: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  brandId: string;
  categoryId: string;
  image: string;
  rating: number;
  reviewCount: number;
  specifications: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  brand?: Brand;
  category?: Category;
  prices?: StorePrice[];
  priceHistories?: PriceHistoryItem[];
  reviews?: ProductReview[];
  bestPrice: number;
  originalPrice: number;
  discount: number;
  storeCount?: number;
  smartBuyScore?: SmartBuyScore;
  buyWaitRecommendation?: BuyWaitRecommendation;
  keyAdvantage?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
