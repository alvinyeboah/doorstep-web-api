# DoorStep Mobile API Documentation

**Base URL:** `http://localhost:3000/api` (replace with production URL)
**Swagger UI:** `http://localhost:3000/api/docs`

This documentation covers endpoints needed for the mobile app (Customer and Stepper roles). Vendor functionality is handled via web interface.

---

## Table of Contents
1. [Authentication](#authentication)
2. [Customer Endpoints](#customer-endpoints)
3. [Stepper Endpoints](#stepper-endpoints)
4. [Products (Public)](#products-public)
5. [Orders](#orders)
6. [File Uploads](#file-uploads)
7. [Notifications](#notifications)
8. [Error Handling](#error-handling)

---

## Authentication

### Better Auth Overview
- **Session Management:** Cookie-based (automatic)
- **Providers:** Email/Password + Google OAuth
- **Session Duration:** 7 days (auto-refreshed)

### 1. Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "user": {
    "id": "clp123abc456def",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
  },
  "message": "User created successfully"
}
```

**Notes:**
- Default role is `CUSTOMER`
- Session cookie automatically set in response headers
- Password minimum 8 characters

---

### 2. Sign In
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "clp123abc456def",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
  },
  "message": "User signed in successfully"
}
```

---

### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "clp123abc456def",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER",
    "verified": true
  },
  "session": {
    "id": "session123",
    "expiresAt": "2025-12-15T12:00:00.000Z"
  }
}
```

---

### 4. Sign Out
```http
POST /api/auth/signout
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User signed out successfully"
}
```

---

### 5. Google Sign-In (OAuth)
```http
POST /api/auth/google-signin
Cookie: <session-cookie-from-oauth>
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "clp123abc456def",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
  },
  "message": "Google sign-in successful"
}
```

**OAuth Flow:**
1. Direct user to Google OAuth URL (configured in backend)
2. Google redirects back with session cookie
3. Call this endpoint to complete sign-in

---

## Customer Endpoints

**Role Required:** `CUSTOMER` (all endpoints require authentication)

### 1. Register Customer Profile
After signing up, user must register as a customer to access customer features.

```http
POST /api/customer/register
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "hall": "Hall 7",
  "address": "Room 204, Hall 7, University Campus"
}
```

**Response (201 Created):**
```json
{
  "id": "customer123",
  "userId": "user123",
  "hall": "Hall 7",
  "address": "Room 204, Hall 7, University Campus",
  "createdAt": "2025-12-08T12:00:00.000Z"
}
```

**Notes:**
- Both `hall` and `address` are optional
- Automatically creates a shopping cart for the customer

---

### 2. Get Customer Profile
```http
GET /api/customer/profile
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
{
  "id": "customer123",
  "userId": "user123",
  "hall": "Hall 7",
  "address": "Room 204, Hall 7, University Campus",
  "user": {
    "email": "user@example.com",
    "name": "John Doe"
  },
  "orderCount": 15
}
```

---

### 3. Update Customer Profile
```http
PUT /api/customer/profile
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "hall": "Hall 8",
  "address": "Room 301, Hall 8"
}
```

**Response (200 OK):**
```json
{
  "id": "customer123",
  "hall": "Hall 8",
  "address": "Room 301, Hall 8",
  "updatedAt": "2025-12-08T13:00:00.000Z"
}
```

---

### 4. Get Shopping Cart
```http
GET /api/customer/cart
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
{
  "id": "cart123",
  "customerId": "customer123",
  "items": [
    {
      "id": "cartitem123",
      "productId": "product456",
      "quantity": 2,
      "product": {
        "id": "product456",
        "name": "Jollof Rice with Chicken",
        "price": 25.99,
        "photoUrl": "https://...",
        "vendor": {
          "id": "vendor789",
          "shopName": "Campus Bites",
          "logoUrl": "https://..."
        }
      },
      "subtotal": 51.98
    }
  ],
  "total": 51.98,
  "itemCount": 2
}
```

---

### 5. Add Item to Cart
```http
POST /api/customer/cart/add
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "productId": "product456",
  "quantity": 2
}
```

**Response (201 Created):**
```json
{
  "id": "cartitem123",
  "cartId": "cart123",
  "productId": "product456",
  "quantity": 2,
  "product": {
    "name": "Jollof Rice with Chicken",
    "price": 25.99
  }
}
```

**Notes:**
- If item already exists in cart, quantity is updated (added to existing)
- Product must be available (`available: true`)

---

### 6. Update Cart Item Quantity
```http
PUT /api/customer/cart/item/:itemId
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "quantity": 3
}
```

**Response (200 OK):**
```json
{
  "id": "cartitem123",
  "quantity": 3,
  "updatedAt": "2025-12-08T13:30:00.000Z"
}
```

**Notes:**
- Set `quantity: 0` to remove item from cart
- No separate DELETE endpoint

---

### 7. Clear Cart
```http
DELETE /api/customer/cart/clear
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
{
  "message": "Cart cleared successfully"
}
```

---

### 8. Get Customer Orders
```http
GET /api/customer/orders
Authorization: Bearer <session-token>

# Optional: filter by status
GET /api/customer/orders?status=DELIVERED
```

**Response (200 OK):**
```json
[
  {
    "id": "order123",
    "status": "DELIVERED",
    "total": 51.98,
    "deliveryFee": 5.00,
    "deliveryAddress": "Room 204, Hall 7",
    "customerNotes": "Please call when you arrive",
    "createdAt": "2025-12-08T10:00:00.000Z",
    "vendor": {
      "shopName": "Campus Bites",
      "logoUrl": "https://..."
    },
    "stepper": {
      "user": {
        "name": "Delivery Guy"
      }
    },
    "items": [
      {
        "product": {
          "name": "Jollof Rice with Chicken"
        },
        "quantity": 2,
        "price": 25.99
      }
    ]
  }
]
```

**Valid Status Values:**
- `PLACED`, `ACCEPTED`, `PREPARING`, `READY`, `OUT_FOR_DELIVERY`, `DELIVERED`, `COMPLETED`, `CANCELLED`

---

### 9. Get Specific Order
```http
GET /api/customer/orders/:orderId
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
{
  "id": "order123",
  "customerId": "customer123",
  "vendorId": "vendor789",
  "stepperId": "stepper456",
  "status": "DELIVERED",
  "total": 51.98,
  "deliveryFee": 5.00,
  "deliveryAddress": "Room 204, Hall 7",
  "deliveryLocation": {
    "type": "Point",
    "coordinates": [-0.1234, 5.6789]
  },
  "customerNotes": "Please call when you arrive",
  "estimatedDelivery": "2025-12-08T11:30:00.000Z",
  "items": [...],
  "vendor": {...},
  "stepper": {...},
  "rating": {
    "vendorRating": 5,
    "stepperRating": 4,
    "feedback": "Great food, fast delivery!"
  }
}
```

---

## Stepper Endpoints

**Role Required:** `STEPPER` (all endpoints require authentication)

### 1. Register Stepper Profile
After signing up with role STEPPER, user must register as a stepper.

```http
POST /api/stepper/register
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "studentIdUrl": "https://r2.../student-id.jpg",
  "governmentIdUrl": "https://r2.../govt-id.jpg",
  "bankDetails": {
    "accountNumber": "1234567890",
    "bankName": "Example Bank",
    "accountHolderName": "John Doe"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+233501234567",
    "relationship": "Sister"
  },
  "pictureUrl": "https://r2.../profile.jpg"
}
```

**Response (201 Created):**
```json
{
  "id": "stepper123",
  "userId": "user123",
  "available": false,
  "verified": false,
  "rating": 0,
  "wallet": {
    "balance": 0,
    "depositAmount": 0
  }
}
```

**Notes:**
- All fields are optional
- Wallet is automatically created
- `verified` starts as `false` (admin must verify)
- `available` starts as `false` (stepper must toggle on)

---

### 2. Get Stepper Profile
```http
GET /api/stepper/profile
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
{
  "id": "stepper123",
  "userId": "user123",
  "studentIdUrl": "https://...",
  "governmentIdUrl": "https://...",
  "bankDetails": {
    "accountNumber": "1234567890",
    "bankName": "Example Bank",
    "accountHolderName": "John Doe"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+233501234567",
    "relationship": "Sister"
  },
  "pictureUrl": "https://...",
  "rating": 4.8,
  "available": true,
  "verified": true,
  "user": {
    "email": "stepper@example.com",
    "name": "John Stepper"
  },
  "wallet": {
    "balance": 150.50,
    "totalEarned": 500.00,
    "totalWithdrawn": 349.50
  },
  "totalDeliveries": 42
}
```

---

### 3. Update Stepper Profile
```http
PUT /api/stepper/profile
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "bankDetails": {
    "accountNumber": "9876543210",
    "bankName": "New Bank"
  },
  "location": {
    "type": "Point",
    "coordinates": [-0.1234, 5.6789]
  }
}
```

**Response (200 OK):**
```json
{
  "id": "stepper123",
  "bankDetails": {...},
  "location": {...},
  "updatedAt": "2025-12-08T14:00:00.000Z"
}
```

---

### 4. Toggle Availability
```http
PUT /api/stepper/availability
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "available": true
}
```

**Response (200 OK):**
```json
{
  "id": "stepper123",
  "available": true,
  "message": "Availability updated successfully"
}
```

**Notes:**
- Set `true` to start accepting delivery orders
- Set `false` to stop receiving new orders

---

### 5. Get Available Orders (for delivery)
```http
GET /api/orders/available/list
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
[
  {
    "id": "order123",
    "status": "READY",
    "total": 51.98,
    "deliveryFee": 5.00,
    "deliveryAddress": "Room 204, Hall 7",
    "deliveryLocation": {
      "type": "Point",
      "coordinates": [-0.1234, 5.6789]
    },
    "vendor": {
      "shopName": "Campus Bites",
      "address": "Main Campus, Building A"
    },
    "customer": {
      "user": {
        "name": "John Customer",
        "phone": "+233501234567"
      }
    },
    "createdAt": "2025-12-08T12:00:00.000Z"
  }
]
```

**Notes:**
- Returns orders with status `READY` and no assigned stepper
- Ordered by creation time (oldest first)

---

### 6. Accept Order for Delivery
```http
POST /api/orders/:orderId/accept
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
{
  "id": "order123",
  "stepperId": "stepper123",
  "status": "OUT_FOR_DELIVERY",
  "message": "Order accepted for delivery"
}
```

**Notes:**
- Order must be in `READY` status
- Order must not already have a stepper assigned
- Status automatically updated to `OUT_FOR_DELIVERY`

---

### 7. Get Stepper Orders
```http
GET /api/stepper/orders
Authorization: Bearer <session-token>

# Optional: filter by status
GET /api/stepper/orders?status=OUT_FOR_DELIVERY
```

**Response (200 OK):**
```json
[
  {
    "id": "order123",
    "status": "OUT_FOR_DELIVERY",
    "total": 51.98,
    "deliveryFee": 5.00,
    "deliveryAddress": "Room 204, Hall 7",
    "vendor": {...},
    "customer": {...},
    "items": [...]
  }
]
```

---

### 8. Get Wallet Balance
```http
GET /api/stepper/wallet
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
{
  "id": "wallet123",
  "stepperId": "stepper123",
  "balance": 150.50,
  "depositAmount": 100.00,
  "depositGrowth": 15.00,
  "totalEarned": 500.00,
  "totalWithdrawn": 349.50,
  "createdAt": "2025-11-01T10:00:00.000Z",
  "updatedAt": "2025-12-08T14:00:00.000Z"
}
```

**Wallet Fields Explained:**
- `balance`: Current available balance
- `depositAmount`: Initial deposit made by stepper
- `depositGrowth`: Growth/interest on deposit
- `totalEarned`: Total commissions earned from deliveries
- `totalWithdrawn`: Total amount withdrawn

---

### 9. Make Wallet Deposit
```http
POST /api/stepper/deposit
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "amount": 100.00
}
```

**Response (201 Created):**
```json
{
  "wallet": {
    "balance": 250.50,
    "depositAmount": 200.00
  },
  "message": "Deposit successful"
}
```

**Notes:**
- Amount must be positive number
- Updates both `balance` and `depositAmount`

---

### 10. Request Withdrawal
```http
POST /api/stepper/withdrawal
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "amount": 50.00
}
```

**Response (201 Created):**
```json
{
  "id": "withdrawal123",
  "stepperId": "stepper123",
  "amount": 50.00,
  "status": "PENDING",
  "twoFactorCode": "123456",
  "createdAt": "2025-12-08T15:00:00.000Z",
  "message": "Withdrawal request created. Please verify with 2FA code."
}
```

**Notes:**
- Amount must not exceed available balance
- Status: `PENDING` → `APPROVED` or `REJECTED` (admin action)
- 2FA code is generated but mobile must handle SMS/email delivery
- Withdrawal doesn't deduct from balance until approved

---

### 11. Get Withdrawal History
```http
GET /api/stepper/withdrawals
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
[
  {
    "id": "withdrawal123",
    "amount": 50.00,
    "status": "APPROVED",
    "twoFactorCode": "123456",
    "processedAt": "2025-12-08T16:00:00.000Z",
    "createdAt": "2025-12-08T15:00:00.000Z"
  },
  {
    "id": "withdrawal124",
    "amount": 100.00,
    "status": "PENDING",
    "createdAt": "2025-12-08T15:30:00.000Z"
  }
]
```

**Status Values:**
- `PENDING`: Awaiting admin approval
- `APPROVED`: Processed and money sent
- `REJECTED`: Rejected by admin (see `rejectionNote` field)

---

### 12. Get Commission History
```http
GET /api/stepper/commission-history
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
[
  {
    "id": "commission123",
    "stepperId": "stepper123",
    "orderId": "order789",
    "amount": 5.00,
    "createdAt": "2025-12-08T12:00:00.000Z",
    "order": {
      "id": "order789",
      "total": 51.98,
      "vendor": {
        "shopName": "Campus Bites"
      }
    }
  }
]
```

---

## Vendors (Public)

These endpoints don't require authentication.

### 1. Get All Vendors
```http
GET /api/vendor/list

# Optional: search by name or business type
GET /api/vendor/list?search=campus
```

**Response (200 OK):**
```json
[
  {
    "id": "vendor789",
    "shopName": "Campus Bites",
    "logoUrl": "https://...",
    "businessType": "Restaurant",
    "description": "Best Ghanaian food on campus",
    "address": "Main Campus, Building A",
    "location": {
      "type": "Point",
      "coordinates": [-0.1234, 5.6789]
    },
    "hours": {
      "open": "08:00",
      "close": "22:00"
    },
    "verified": true,
    "rating": 4.5,
    "productCount": 15
  }
]
```

**Notes:**
- Only returns verified vendors
- Search filters by shop name and business type
- GeoJSON location format: `[longitude, latitude]`

---

### 2. Get Vendor Profile
```http
GET /api/vendor/profile/:vendorId
```

**Response (200 OK):**
```json
{
  "id": "vendor789",
  "userId": "user123",
  "shopName": "Campus Bites",
  "logoUrl": "https://...",
  "businessType": "Restaurant",
  "description": "Best Ghanaian food on campus serving authentic Ghanaian cuisine",
  "address": "Main Campus, Building A",
  "location": {
    "type": "Point",
    "coordinates": [-0.1234, 5.6789]
  },
  "hours": {
    "open": "08:00",
    "close": "22:00"
  },
  "verified": true,
  "rating": 4.5,
  "totalRatings": 120,
  "productCount": 15,
  "completedOrders": 450,
  "user": {
    "email": "vendor@example.com",
    "name": "Vendor Owner",
    "phone": "+233501234567"
  }
}
```

**Use Cases:**
- Display vendor details page
- Show vendor location on map
- Display opening hours
- Show ratings and review count

---

## Products (Public)

These endpoints don't require authentication.

### 1. Get Vendor's Products
```http
GET /api/products/vendor/:vendorId
```

**Response (200 OK):**
```json
[
  {
    "id": "product456",
    "vendorId": "vendor789",
    "name": "Jollof Rice with Chicken",
    "price": 25.99,
    "description": "Delicious Jollof rice served with grilled chicken",
    "photoUrl": "https://...",
    "category": "Main Dish",
    "available": true,
    "createdAt": "2025-11-15T10:00:00.000Z"
  }
]
```

**Notes:**
- Only returns products where `available: true`

---

### 2. Search Products
```http
GET /api/products/search?q=jollof
```

**Response (200 OK):**
```json
[
  {
    "id": "product456",
    "name": "Jollof Rice with Chicken",
    "price": 25.99,
    "photoUrl": "https://...",
    "vendor": {
      "id": "vendor789",
      "shopName": "Campus Bites"
    }
  }
]
```

**Notes:**
- Searches name, description, and category
- Case-insensitive
- Only available products

---

### 3. Get Product Details
```http
GET /api/products/:productId
```

**Response (200 OK):**
```json
{
  "id": "product456",
  "vendorId": "vendor789",
  "name": "Jollof Rice with Chicken",
  "price": 25.99,
  "description": "Delicious Jollof rice served with grilled chicken",
  "photoUrl": "https://...",
  "category": "Main Dish",
  "available": true,
  "vendor": {
    "id": "vendor789",
    "shopName": "Campus Bites",
    "logoUrl": "https://...",
    "rating": 4.5
  }
}
```

---

## Orders

### 1. Create Order (Customer)
```http
POST /api/orders
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "vendorId": "vendor789",
  "items": [
    {
      "productId": "product456",
      "quantity": 2
    },
    {
      "productId": "product789",
      "quantity": 1
    }
  ],
  "deliveryAddress": "Room 204, Hall 7, University Campus",
  "customerNotes": "Please call when you arrive"
}
```

**Response (201 Created):**
```json
{
  "id": "order123",
  "customerId": "customer123",
  "vendorId": "vendor789",
  "status": "PLACED",
  "total": 77.97,
  "deliveryFee": 5.00,
  "deliveryAddress": "Room 204, Hall 7, University Campus",
  "customerNotes": "Please call when you arrive",
  "items": [
    {
      "productId": "product456",
      "quantity": 2,
      "price": 25.99
    }
  ],
  "createdAt": "2025-12-08T12:00:00.000Z"
}
```

**Notes:**
- All items must belong to same vendor
- Product prices are locked at order time
- Delivery fee calculated automatically
- Status starts as `PLACED`

---

### 2. Get Order Details
```http
GET /api/orders/:orderId
Authorization: Bearer <session-token>
```

**Response:** (See Customer Orders endpoint for full response)

---

### 3. Update Order Status (Vendor/Stepper)
```http
PUT /api/orders/:orderId/status
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "status": "DELIVERED"
}
```

**Response (200 OK):**
```json
{
  "id": "order123",
  "status": "DELIVERED",
  "updatedAt": "2025-12-08T13:00:00.000Z"
}
```

**Valid Status Transitions:**
- Vendor: `PLACED` → `ACCEPTED` → `PREPARING` → `READY`
- Stepper: `READY` → `OUT_FOR_DELIVERY` → `DELIVERED`
- System: `DELIVERED` → `COMPLETED` (automatic after rating)

---

### 4. Cancel Order (Customer)
```http
POST /api/orders/:orderId/cancel
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
{
  "id": "order123",
  "status": "CANCELLED",
  "message": "Order cancelled successfully"
}
```

**Notes:**
- Only customers can cancel their own orders
- Can only cancel if status is `PLACED` or `ACCEPTED`
- Cannot cancel once vendor starts `PREPARING`

---

### 5. Rate Order (Customer)
```http
POST /api/orders/:orderId/rate
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "vendorRating": 5,
  "stepperRating": 4,
  "feedback": "Great food, fast delivery!"
}
```

**Response (200 OK):**
```json
{
  "id": "rating123",
  "orderId": "order123",
  "vendorId": "vendor789",
  "stepperId": "stepper456",
  "vendorRating": 5,
  "stepperRating": 4,
  "feedback": "Great food, fast delivery!",
  "createdAt": "2025-12-08T14:00:00.000Z"
}
```

**Notes:**
- Can only rate orders with status `DELIVERED` or `COMPLETED`
- Ratings are 1-5 (integer)
- Both ratings are optional but at least one required
- Can only rate once per order

---

## File Uploads

### Check Upload Service Status
```http
POST /api/upload/status
```

**Response (200 OK):**
```json
{
  "configured": true,
  "message": "Upload service is ready"
}
```

**Notes:**
- If `configured: false`, file uploads will fail with 400 error
- R2 (Cloudflare) credentials must be set in environment variables

---

### 1. Upload User Avatar
```http
POST /api/upload/avatar
Authorization: Bearer <session-token>
Content-Type: multipart/form-data

file: <binary-image-data>
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "url": "https://r2.cloudflare.com/.../avatar-123.jpg",
    "key": "avatars/user123/avatar-123.jpg"
  }
}
```

---

### 2. Upload Stepper Document
```http
POST /api/upload/stepper-document
Authorization: Bearer <session-token>
Content-Type: multipart/form-data

file: <binary-file-data>
documentType: "government-id"
```

**Document Types:**
- `student-id`
- `government-id`
- `driver-license`
- `proof-of-vehicle`

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "url": "https://r2.cloudflare.com/.../govt-id-123.jpg",
    "key": "steppers/stepper123/govt-id-123.jpg"
  }
}
```

---

### 3. Upload Order Receipt
```http
POST /api/upload/order-receipt
Authorization: Bearer <session-token>
Content-Type: multipart/form-data

file: <binary-image-data>
orderId: "order123"
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "url": "https://r2.cloudflare.com/.../receipt-123.jpg",
    "key": "receipts/order123/receipt-123.jpg"
  }
}
```

---

**Upload Constraints:**
- Max file size: 5MB
- Allowed image types: JPEG, PNG, WebP
- Allowed document types: PDF, JPEG, PNG

---

## Notifications

### 1. Get User Notifications
```http
GET /api/notifications
Authorization: Bearer <session-token>

# Optional: unread only
GET /api/notifications?unread=true
```

**Response (200 OK):**
```json
[
  {
    "id": "notif123",
    "userId": "user123",
    "message": "Your order #12345 has been delivered",
    "type": "ORDER_UPDATE",
    "read": false,
    "metadata": {
      "orderId": "order123",
      "status": "DELIVERED"
    },
    "createdAt": "2025-12-08T12:00:00.000Z"
  }
]
```

**Notification Types:**
- `ORDER_UPDATE`: Order status changes
- `RATING`: Received a rating
- `PROMOTION`: Marketing messages
- `SYSTEM`: System notifications

---

### 2. Mark Notification as Read
```http
PUT /api/notifications/:notificationId/read
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
{
  "id": "notif123",
  "read": true,
  "message": "Notification marked as read"
}
```

---

### 3. Mark All Notifications as Read
```http
PUT /api/notifications/read-all
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
{
  "count": 5,
  "message": "All notifications marked as read"
}
```

---

### 4. Delete Notification
```http
DELETE /api/notifications/:notificationId
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
{
  "message": "Notification deleted successfully"
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

### Common HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | OK | Successful GET/PUT/DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input, validation failed |
| 401 | Unauthorized | No session or expired session |
| 403 | Forbidden | Wrong role (e.g., CUSTOMER trying VENDOR endpoint) |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry (e.g., already registered) |

### Validation Errors
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be at least 8 characters"
  ],
  "error": "Bad Request"
}
```

---

## Mobile App Flow Examples

### Customer Journey
```
1. Sign Up → POST /api/auth/signup
2. Register as Customer → POST /api/customer/register
3. Browse Vendors → GET /api/vendor/list
4. View Products → GET /api/products/vendor/:vendorId
5. Add to Cart → POST /api/customer/cart/add
6. View Cart → GET /api/customer/cart
7. Create Order → POST /api/orders
8. Track Order → GET /api/customer/orders/:orderId
9. Rate Order → POST /api/orders/:orderId/rate
```

### Stepper Journey
```
1. Sign Up → POST /api/auth/signup
2. Register as Stepper → POST /api/stepper/register
3. Upload Documents → POST /api/upload/stepper-document
4. Toggle Availability → PUT /api/stepper/availability (available: true)
5. View Available Orders → GET /api/orders/available/list
6. Accept Order → POST /api/orders/:orderId/accept
7. Update Status → PUT /api/orders/:orderId/status (status: DELIVERED)
8. View Wallet → GET /api/stepper/wallet
9. Request Withdrawal → POST /api/stepper/withdrawal
```

---

## Important Implementation Notes

### Session Management
- Sessions are cookie-based and automatically managed
- Session duration: 7 days
- Auto-refreshed if user is active
- Check `/api/auth/me` to verify session validity

### Order Status Flow
```
PLACED (customer creates order)
  ↓
ACCEPTED (vendor accepts)
  ↓
PREPARING (vendor preparing food)
  ↓
READY (ready for pickup)
  ↓
OUT_FOR_DELIVERY (stepper delivering)
  ↓
DELIVERED (delivered to customer)
  ↓
COMPLETED (after customer rates)
```

### Cart Behavior
- Cart is NOT automatically cleared after order
- Mobile app should manually clear cart after successful order
- Cart persists across sessions

### File Uploads
- Always check `/api/upload/status` first
- If not configured, show error to user
- Max file size: 5MB
- Use multipart/form-data encoding

### Notifications
- Currently database-only (no real-time push)
- Mobile should poll `/api/notifications` periodically
- Consider implementing WebSocket for real-time updates

### Missing Features (Not Yet Implemented)
- ❌ Real-time order tracking (location updates)
- ❌ Delivery fee calculation (currently hardcoded)
- ❌ Distance-based vendor filtering
- ❌ Push notifications (database only)
- ❌ Payment processing integration
- ❌ Commission auto-calculation for steppers
- ❌ SMS/Email for 2FA codes

---

## Testing with Swagger UI

Visit `http://localhost:3000/api/docs` to test all endpoints interactively.

**Steps:**
1. Test sign up/sign in first
2. Click "Authorize" button (top right)
3. Enter your session token
4. Test protected endpoints

---

## Appendix: Constants & Enums

### Order Status Enum
```typescript
enum OrderStatus {
  PLACED = "PLACED",              // Order created by customer
  ACCEPTED = "ACCEPTED",          // Vendor accepted the order
  PREPARING = "PREPARING",        // Vendor preparing the food
  READY = "READY",                // Order ready for pickup
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",  // Stepper delivering
  DELIVERED = "DELIVERED",        // Delivered to customer
  COMPLETED = "COMPLETED",        // Order completed (after rating)
  CANCELLED = "CANCELLED"         // Cancelled by customer
}
```

### User Roles
```typescript
enum UserRole {
  CUSTOMER = "CUSTOMER",    // Customers who order food
  VENDOR = "VENDOR",        // Food vendors/shops
  STEPPER = "STEPPER",      // Delivery persons
  SUPER_ADMIN = "SUPER_ADMIN"  // Platform admins (not used in mobile)
}
```

### Notification Types
```typescript
enum NotificationType {
  ORDER_UPDATE = "ORDER_UPDATE",  // Order status changed
  RATING = "RATING",              // Received a rating
  PROMOTION = "PROMOTION",        // Marketing/promotional messages
  SYSTEM = "SYSTEM"               // System notifications
}
```

### Withdrawal Status
```typescript
enum WithdrawalStatus {
  PENDING = "PENDING",      // Awaiting admin approval
  APPROVED = "APPROVED",    // Approved and processed
  REJECTED = "REJECTED"     // Rejected by admin
}
```

### Document Types (for Stepper uploads)
```typescript
type DocumentType =
  | "student-id"
  | "government-id"
  | "driver-license"
  | "proof-of-vehicle"
```

### GeoJSON Location Format
```typescript
interface Location {
  type: "Point";
  coordinates: [number, number];  // [longitude, latitude]
}

// Example
{
  "type": "Point",
  "coordinates": [-0.1867, 5.6037]  // Accra, Ghana
}
```

### Bank Details Format
```typescript
interface BankDetails {
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
}
```

### Emergency Contact Format
```typescript
interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}
```

### Hours Format (Vendor)
```typescript
interface Hours {
  open: string;   // "HH:MM" format (24-hour)
  close: string;  // "HH:MM" format (24-hour)
}

// Example
{
  "open": "08:00",
  "close": "22:00"
}
```

---

## Rate Limiting & Performance

### Polling Recommendations
- **Notifications**: Poll every 30-60 seconds when app is active
- **Order Status**: Poll every 10-15 seconds during active order
- **Available Orders (Stepper)**: Poll every 15-30 seconds when available

### Pagination
⚠️ **Note**: Most list endpoints do NOT currently support pagination
- Consider implementing client-side pagination for large lists
- Future API versions may add `?page=1&limit=20` support

### Caching Recommendations
- **Vendor List**: Cache for 5-10 minutes
- **Product List**: Cache for 2-5 minutes
- **Vendor Profile**: Cache for 10 minutes
- **User Profile**: Cache until update
- **Orders**: Don't cache (always fetch fresh)

---

## Security Best Practices

### Session Management
- Store session cookies securely (use secure HTTP-only cookies if possible)
- Clear session on logout
- Handle 401 responses by redirecting to login
- Refresh session token before expiry

### Data Validation
- Validate all user inputs client-side before sending
- Don't trust client-side validation alone (API validates too)
- Sanitize file uploads (check size, type before upload)

### Sensitive Data
- Never log user passwords or session tokens
- Don't store sensitive data in app logs
- Use HTTPS for all API requests (production)

### File Uploads
- Check file size before upload (max 5MB)
- Validate file type (images: JPEG, PNG, WebP; docs: PDF)
- Show upload progress to user
- Handle upload failures gracefully

---

## Testing Accounts (for Development)

Create test accounts for each role:

**Customer Test Account:**
```
Email: customer@test.com
Password: Test123!
Role: CUSTOMER
```

**Stepper Test Account:**
```
Email: stepper@test.com
Password: Test123!
Role: STEPPER
```

Remember to register profiles after signup:
- Customer: POST `/api/customer/register`
- Stepper: POST `/api/stepper/register`

---

## Common Implementation Patterns

### 1. Login Flow
```typescript
// 1. Sign in
const response = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
  credentials: 'include'  // Important: include cookies
});

const data = await response.json();

// 2. Store user role locally
localStorage.setItem('userRole', data.user.role);

// 3. Check if profile exists
if (data.user.role === 'CUSTOMER') {
  const profile = await fetch('/api/customer/profile', {
    credentials: 'include'
  });

  if (profile.status === 404) {
    // Redirect to customer registration
  }
}
```

### 2. Create Order from Cart
```typescript
// 1. Get cart
const cart = await fetch('/api/customer/cart', {
  credentials: 'include'
}).then(r => r.json());

// 2. Transform cart items to order items
const orderItems = cart.items.map(item => ({
  productId: item.productId,
  quantity: item.quantity
}));

// 3. Create order
const order = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    vendorId: cart.items[0].product.vendorId,
    items: orderItems,
    deliveryAddress: 'Room 204, Hall 7',
    customerNotes: 'Please call when you arrive'
  })
});

// 4. Clear cart after successful order
if (order.ok) {
  await fetch('/api/customer/cart/clear', {
    method: 'DELETE',
    credentials: 'include'
  });
}
```

### 3. Real-time Order Tracking (Polling)
```typescript
let orderPolling: NodeJS.Timeout;

function startOrderTracking(orderId: string) {
  orderPolling = setInterval(async () => {
    const order = await fetch(`/api/orders/${orderId}`, {
      credentials: 'include'
    }).then(r => r.json());

    // Update UI with new status
    updateOrderStatus(order.status);

    // Stop polling when completed
    if (['COMPLETED', 'CANCELLED'].includes(order.status)) {
      stopOrderTracking();
    }
  }, 10000); // Poll every 10 seconds
}

function stopOrderTracking() {
  if (orderPolling) {
    clearInterval(orderPolling);
  }
}
```

### 4. File Upload with Progress
```typescript
async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const xhr = new XMLHttpRequest();

  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percentComplete = (e.loaded / e.total) * 100;
      updateProgressBar(percentComplete);
    }
  });

  xhr.addEventListener('load', () => {
    if (xhr.status === 201) {
      const response = JSON.parse(xhr.responseText);
      console.log('Upload successful:', response.data.url);
    }
  });

  xhr.open('POST', '/api/upload/avatar');
  xhr.withCredentials = true;  // Include cookies
  xhr.send(formData);
}
```

### 5. Handle Session Expiry
```typescript
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include'
  });

  // Session expired
  if (response.status === 401) {
    // Clear local data
    localStorage.clear();
    // Redirect to login
    window.location.href = '/login';
    return null;
  }

  return response;
}
```

---

## Support & Questions

For any questions or issues:
- Check Swagger UI for live documentation: `http://localhost:3000/api/docs`
- Review error messages carefully
- Ensure correct role for each endpoint
- Verify session hasn't expired (401 = expired session)
- Test endpoints in Swagger UI before implementing in mobile app
