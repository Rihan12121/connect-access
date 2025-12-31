// Product Types
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  category: string;
  description?: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
}

// Category Types
export interface Category {
  slug: string;
  name: string;
  image: string;
  productCount?: number;
}

// Banner Types
export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

// Order Types
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  shippingAddress: ShippingAddress;
}

// Address Types
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Language Types
export type Language = 'de' | 'en';
