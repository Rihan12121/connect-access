// Site Configuration
export const SITE_CONFIG = {
  name: 'Noor',
  title: 'Noor - Online Shop',
  description: 'Dein Online-Shop für Qualitätsprodukte zu fairen Preisen.',
  url: 'https://noor-shop.de',
  email: 'info@noor-shop.de',
  phone: '+49 123 456 789',
} as const;

// Shipping Configuration
export const SHIPPING_CONFIG = {
  freeShippingThreshold: 50,
  standardShippingCost: 4.99,
  expressShippingCost: 9.99,
} as const;

// Pagination
export const PAGINATION = {
  productsPerPage: 12,
  defaultPage: 1,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  cart: 'noor-cart',
  favorites: 'noor-favorites',
  language: 'noor-language',
  policyAccepted: 'noor-policy-accepted',
  theme: 'noor-theme',
} as const;

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  products: '/api/products',
  categories: '/api/categories',
  orders: '/api/orders',
} as const;

// Animation Durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;
