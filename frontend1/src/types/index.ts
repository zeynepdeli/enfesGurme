export interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  data?: T;
}
export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  _count?: {
    orders: number;
    addresses: number;
  };
  orders?: Order[];
  addresses?: Address[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  categoryId: string;
  category?: Category;
  images?: ProductImage[];
  createdAt: string;
  updatedAt: string;
  story?: string;
  features?: string;
  servingSuggestion?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: {
    products: number;
  };
}

export type FeaturedCard = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
};

export type BestsellerCard = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  slug: string;
  order: number;
  isActive: boolean;
};

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

export interface Address {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  zipCode?: string;
  isDefault?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  orderId?: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  userId?: string;
  addressId: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  address: Address;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  lowStockProducts: Product[];
  recentProducts: Product[];
  recentOrders: Order[];
}
