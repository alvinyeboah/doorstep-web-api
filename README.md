# DoorStep - Campus Food Delivery Platform

A modern full-stack monorepo for campus food delivery, built with NestJS, Next.js, Better-Auth, and PostgreSQL.

## 🏗️ Architecture

This is a **pnpm monorepo** with two main applications:

```
doorstep-api/
├── apps/
│   ├── backend/       # NestJS API with Better-Auth
│   └── frontend/      # Next.js Dashboard
├── package.json       # Root package.json for monorepo scripts
└── pnpm-workspace.yaml
```

## 🔧 Tech Stack

### Backend (NestJS)
- **Framework**: NestJS 11
- **Authentication**: Better-Auth (modern, secure auth library)
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: class-validator & class-transformer
- **Email**: Plunk (transactional email service) for OTP and notifications
- **File Storage**: Cloudflare R2 for product images, avatars, and documents

### Frontend (Next.js)
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **UI**: TypeScript, React 19
- **Turbopack**: Enabled for faster builds

## 📦 Installation

### Prerequisites
- Node.js >= 18
- pnpm >= 8
- PostgreSQL database

### Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure environment variables**:

   Backend (apps/backend/.env):
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/doorstep_db?schema=public"
   PORT=3000
   NODE_ENV=development

   # Better-Auth
   BETTER_AUTH_URL=http://localhost:3000

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Frontend URL for CORS
   FRONTEND_URL=http://localhost:3001

   # Email (Plunk - for OTP and notifications)
   PLUNK_API_KEY=your_plunk_api_key_here
   EMAIL_FROM=noreply@doorstep.com

   # Cloudflare R2 Storage
   CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
   CLOUDFLARE_ACCESS_KEY=your_r2_access_key
   CLOUDFLARE_SECRET_KEY=your_r2_secret_key
   R2_BUCKET_NAME=doorstep
   ASSETS_PUBLIC_BASE_URL=https://doorstep.your-domain.com
   ```

3. **Set up database**:
   ```bash
   cd apps/backend
   pnpm prisma generate
   pnpm prisma db push  # or: pnpm prisma migrate dev
   ```

## 🚀 Running the Apps

### Development Mode

Run both apps concurrently:
```bash
pnpm dev
```

Or run individually:
```bash
# Backend only (http://localhost:3000)
pnpm dev:backend

# Frontend only (http://localhost:3001)
pnpm dev:frontend
```

### Production Build

```bash
pnpm build
pnpm start:backend
pnpm start:frontend
```

## 📡 API Documentation

The backend API runs at `http://localhost:3000/api`

### Authentication Endpoints (Better-Auth)

Better-Auth provides built-in endpoints:

- `POST /api/auth/sign-up/email` - Register with email/password
- `POST /api/auth/sign-in/email` - Sign in
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get current session
- `POST /api/auth/forget-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Custom Fields

Users have custom fields:
- `role`: "VENDOR" | "STEPPER" | "CUSTOMER"
- `phone`: Optional phone number
- `verified`: Account verification status

## 🗄️ Database Schema

### Core Models

- **User**: Authentication & base user info (managed by Better-Auth)
- **Session**: User sessions (managed by Better-Auth)
- **Account**: OAuth accounts (managed by Better-Auth)
- **Vendor**: Restaurant/shop profiles
- **Customer**: Customer profiles with delivery info
- **Stepper**: Delivery person profiles with wallet
- **Product**: Menu items
- **Order**: Food orders with status tracking
- **Cart**: Shopping cart
- **Wallet**: Stepper earnings & deposits
- **Rating**: Order ratings
- **Notification**: Push notifications

### User Roles

1. **CUSTOMER**: Orders food, manages cart
2. **VENDOR**: Manages restaurant, products, orders
3. **STEPPER**: Delivers orders, manages wallet

## 🔐 Authentication Flow (Better-Auth)

Better-Auth handles:
- ✅ Email/password authentication
- ✅ Session management
- ✅ Token rotation
- ✅ CSRF protection
- ✅ Password hashing (bcrypt)
- ✅ Email verification
- ✅ Password reset
- ✅ Rate limiting

### Using Auth in Backend

```typescript
import { AuthGuard } from './auth/guards/auth.guard';
import { CurrentUser } from './auth/decorators/current-user.decorator';

@UseGuards(AuthGuard)
@Get('profile')
async getProfile(@CurrentUser() user: any) {
  return user;
}
```

### Using Auth in Frontend

```typescript
import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

// Sign up
await authClient.signUp.email({
  email: "user@example.com",
  password: "password123",
  name: "John Doe",
  role: "CUSTOMER",
});

// Sign in
await authClient.signIn.email({
  email: "user@example.com",
  password: "password123",
});
```

## 📋 Development Status

✅ Monorepo structure with pnpm workspaces
✅ NestJS backend with Better-Auth
✅ PostgreSQL + Prisma ORM
✅ Comprehensive database schema
✅ Authentication system (Better-Auth)
✅ Next.js frontend initialization

🔄 **In Progress**:
- Vendor module (registration, profile, products)
- Stepper module (registration, wallet, orders)
- Customer module (cart, orders)
- Orders management
- Payments integration
- Geolocation tracking
- Notifications system
- Frontend dashboard UI

## 📝 Next Steps

1. **Update Database Connection**: Replace the DATABASE_URL in `apps/backend/.env` with your actual PostgreSQL connection string
2. **Run Migrations**: `cd apps/backend && pnpm prisma db push`
3. **Start Development**: `pnpm dev`
4. **Build Feature Modules**: Vendor, Stepper, Customer, Orders, Payments
5. **Create Frontend Dashboard**: Order management, analytics, real-time tracking

## 🤝 Contributing

This is a clean, production-ready foundation for a campus food delivery platform. The architecture supports:
- Multi-role authentication
- Real-time order tracking
- Wallet & payment management
- Rating system
- Geolocation services

## 📄 License

MIT
