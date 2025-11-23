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
    user: {
      email: string;
    };
  };
  customer: {
    user: {
      name: string;
      email: string;
    };
  };
  stepper?: {
    user: {
      name: string;
      phone: string;
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
