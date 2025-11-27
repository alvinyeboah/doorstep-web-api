// User & Auth
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'VENDOR' | 'STEPPER' | 'CUSTOMER' | 'SUPER_ADMIN';
  verified: boolean;
}

// Vendor
export interface Vendor {
  id: string;
  shopName: string;
  businessType?: string;
  address?: string;
  logoUrl?: string;
  description?: string;
  hours?: {
    open: string;
    close: string;
  };
  verified: boolean;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  _count?: {
    products: number;
    orders: number;
  };
}

// Product
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  photoUrl?: string;
  category?: string;
  available: boolean;
  vendorId: string;
  vendor?: Vendor;
}

// Order
export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

export interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  deliveryAddress?: string;
  createdAt: string;
  vendor: {
    shopName: string;
    address?: string;
    user: {
      email: string;
    };
  };
  customer: {
    hall?: string;
    user: {
      name: string;
      email: string;
      phone?: string;
    };
  };
  stepper?: {
    user: {
      name: string;
      phone?: string;
    };
  };
  items: OrderItem[];
}

// Analytics
export interface PlatformAnalytics {
  totalVendors: number;
  totalSteppers: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeOrders: number;
  completedOrders: number;
}

export interface VendorRevenue {
  vendorId: string;
  vendorName: string;
  ownerName: string;
  totalOrders: number;
  totalRevenue: number;
}

// Stepper
export interface Stepper {
  id: string;
  walletBalance: number;
  available: boolean;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
}

// Customer
export interface Customer {
  id: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
}

// Cart
export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Wallet & Stepper Financial
export interface Wallet {
  balance: number;
  totalEarned: number;
  depositAmount: number;
}

export interface Commission {
  id: string;
  amount: number;
  orderId: string;
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

// Dashboard Stats
export interface VendorStats {
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalProducts: number;
  averageRating: number;
}

export interface StepperStats {
  balance: number;
  totalEarned: number;
  depositAmount: number;
}

export interface CustomerStats {
  totalOrders: number;
}

export type DashboardStats = VendorStats | StepperStats | CustomerStats | Record<string, never>;
