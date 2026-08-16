# PRICEPILOT ✈️
> **Compare Smarter. Buy Better.**

PricePilot is an independent, full-stack product discovery and multi-store price comparison web platform developed for BCA Semester 3 Project.

The platform does **NOT** sell products directly. It empowers consumers to answer:
1. *What product should I buy?*
2. *Which available store offers the best price right now?*
3. *Is the current store price good?*
4. *Should I buy now or wait for a price drop?*
5. *What are the best alternatives in this category?*

---

## 🌟 Key Features

### 1. Proprietary Smart Buy Score Engine (0–100)
- Multi-vector weighted algorithm evaluating value without paid external AI APIs:
  - **Price Value Score** (30%)
  - **Customer Rating Score** (20%)
  - **Review Volume Confidence** (15%)
  - **Specification Richness** (15%)
  - **Store Discount Percentage** (10%)
  - **60-Day Price Trend History** (10%)
- Deal Badges: **90–100: Excellent Deal**, **75–89: Good Deal**, **60–74: Fair Deal**, **<60: Consider Alternatives**.

### 2. Rule-Based "Buy or Wait" Recommendation Engine
- Analyzes current best price against 30-day average prices and 60-day historical lowest prices.
- Recommends: **BUY NOW**, **FAIR PRICE**, or **WAIT FOR PRICE DROP**.

### 3. Multi-Store Price Comparison & Audit Badging
- Displays price listings across partner stores (TechWorld Hub, Croma, Reliance Digital, Vijay Sales, Amazon India).
- Highlights badges: **BEST PRICE**, **FASTEST DELIVERY**, **BEST RATED STORE**.
- **Mandatory Audit Requirement**: Every price displays a explicit `"Last updated: [Date]"` badge.

### 4. Interactive 60-Day Price Trend Chart
- Recharts interactive timeline visualizer plotting historical price movements across stores.

### 5. Category-Aware 3-Product Side-by-Side Comparison
- Side-by-side comparison matrix comparing Best Price, Smart Buy Score, User Rating, Processor, RAM, Storage, Display, Battery, and Store Links.

### 6. OpenStreetMap & Leaflet Retail Store Locator
- Interactive map locating offline retail store branches in Mumbai, Delhi, Pune, and Bengaluru.
- **Zero Google Maps API key required** — 100% free open-source mapping.

### 7. Financial Shopping Calculators
- **EMI Calculator**: Monthly Installment, Principal, Interest Payable, and Total Outflow Cost based on tenure sliders.
- **Discount Calculator**: Original list price, discount %, final deal price, and total savings.

### 8. Full Admin Control Panel (`/admin`)
- Real-time dashboard metrics (Users, Products, Stores, Reviews, Wishlists).
- Product CRUD Management with JSON specifications editor.
- Store Price Management with **Automatic `PriceHistory` Timeline Logging**.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, Leaflet / React-Leaflet, Axios, React Router DOM v7 |
| **Backend** | Node.js, Express.js, TypeScript, Prisma ORM, Zod, JWT, bcryptjs |
| **Database** | SQLite (`prisma/dev.db`, zero-config offline execution ready; compatible with PostgreSQL) |
| **Mapping** | Leaflet + OpenStreetMap (No Google Maps API key needed) |

---

## 📁 Repository Architecture

```
PRICEPILOT/
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Footer, ProductCard, SmartBuyScoreBadge, SearchModal, PriceHistoryChart, ReviewSection, StoreMap, SkeletonCard
│   │   ├── context/          # AuthContext (JWT & User state management)
│   │   ├── pages/            # HomePage, ProductsPage, ProductDetailPage, ComparePage, WishlistPage, CalculatorsPage, StoresPage, AdminDashboardPage, LoginPage, RegisterPage
│   │   ├── routes/           # AppRoutes routing table
│   │   ├── services/         # Axios API client functions
│   │   ├── types/            # TypeScript domain interfaces
│   │   ├── index.css         # Tailwind base & custom scrollbar styles
│   │   ├── main.tsx          # React DOM mounting
│   │   └── App.tsx           # Application layout wrapper
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── backend/
│   ├── src/
│   │   ├── config/           # App config & Prisma client instance
│   │   ├── controllers/      # Auth, Product, Category, Brand, Store, Price, UserFeature, Admin controllers
│   │   ├── middleware/       # Auth token verification & requireAdmin middleware
│   │   ├── routes/           # Express REST API routes
│   │   ├── services/         # Business logic services & Smart Buy Score algorithm
│   │   ├── utils/            # JWT & bcrypt password utilities
│   │   ├── validators/       # Zod input validation schemas
│   │   ├── app.ts            # Express application instance & CORS middleware
│   │   └── server.ts         # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Prisma database schema
│   │   └── seed.ts           # 32 Products, 111 Prices, 666 Price Histories, 64 Reviews seed script
│   └── package.json
├── .env.example
└── README.md
```

---

## 🔑 Demo Account Credentials

For development, testing, and BCA project presentation:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@pricepilot.com` | `Admin@123` | Full Admin Dashboard (`/admin`), Product CRUD, Price Management |
| **Demo User** | `user@pricepilot.com` | `User@123` | Wishlist Manager, Product Reviews, Compare Tool |

*Tip: The `/login` page features 1-click Quick Demo Autofill buttons for both accounts.*

---

## 🚀 Installation & Setup Guide

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- NPM (v9.0.0 or higher)

### 2. Backend Setup
```bash
cd PRICEPILOT/backend

# Install dependencies
npm install

# Push database schema (creates local SQLite database dev.db)
npx prisma db push

# Seed database with 32 Products, 111 Prices, 666 Price Histories & Reviews
npm run seed

# Start backend development server (Runs on http://localhost:5000)
npm run dev
```

### 3. Frontend Setup
```bash
cd PRICEPILOT/frontend

# Install dependencies
npm install

# Start frontend development server (Runs on http://localhost:5173)
npm run dev
```

---

## 🧪 Production Build & Verification

To verify production bundle build:

```bash
# Build Backend TypeScript
cd PRICEPILOT/backend
npm run build

# Build Frontend Bundle
cd PRICEPILOT/frontend
npm run build
```

---

*Built with ❤️ for BCA Semester 3 Project.*
