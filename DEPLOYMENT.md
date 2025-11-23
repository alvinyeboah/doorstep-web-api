# Deployment Guide - DoorStep Platform

## Environment Configuration

### Backend API (NestJS)

**Local Development:**
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/doorstep_db"
BETTER_AUTH_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
```

**Production:**
```bash
# Use your actual domain
DATABASE_URL="postgresql://user:password@your-db-host:5432/doorstep_db"
BETTER_AUTH_URL=https://api.doorstepvendor.alvinyeboah.com
FRONTEND_URL=https://doorstepvendor.alvinyeboah.com
```

### Frontend (Next.js)

**Local Development:**
```bash
# apps/frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Production:**
```bash
# apps/frontend/.env.production or Vercel environment variables
NEXT_PUBLIC_API_URL=https://api.doorstepvendor.alvinyeboah.com
```

## Deployment Steps

### 1. Backend Deployment (API)

**Option A: VPS/Server (DigitalOcean, AWS EC2, etc.)**

```bash
# 1. Clone repository
git clone <your-repo>
cd doorstep-api

# 2. Install dependencies
pnpm install

# 3. Set environment variables
cd apps/backend
cp .env.example .env
# Edit .env with production values

# 4. Run database migrations
pnpm prisma generate
pnpm prisma db push

# 5. Build and start
pnpm build
pnpm start:prod
```

**Option B: Docker**

```dockerfile
# Create Dockerfile in apps/backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

**Domain Setup:**
- Point `api.doorstepvendor.alvinyeboah.com` to your backend server
- Use Nginx/Caddy as reverse proxy
- Enable SSL with Let's Encrypt

### 2. Frontend Deployment

**Vercel (Recommended):**

1. Connect your GitHub repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://api.doorstepvendor.alvinyeboah.com`
3. Deploy from `apps/frontend` directory
4. Custom domain: `doorstepvendor.alvinyeboah.com`

**Netlify:**

1. Build command: `cd apps/frontend && pnpm build`
2. Publish directory: `apps/frontend/.next`
3. Environment variables: Same as Vercel

### 3. Database Setup

**PostgreSQL Options:**

1. **Neon** (Serverless Postgres) - Free tier available
   - https://neon.tech
   - Copy connection string to `DATABASE_URL`

2. **Supabase** - Free tier with excellent features
   - https://supabase.com
   - Use the connection string from project settings

3. **Railway** - Simple deployment with database
   - https://railway.app
   - One-click PostgreSQL provisioning

4. **Self-hosted** - Your own server
   - Install PostgreSQL
   - Create database: `createdb doorstep_db`

### 4. CORS Configuration

The backend is configured to allow:
- `http://localhost:3001` (development)
- `https://doorstepvendor.alvinyeboah.com` (production frontend)
- Any URL set in `FRONTEND_URL` environment variable

**To add more domains**, edit `apps/backend/src/main.ts`:

```typescript
const allowedOrigins = [
  'http://localhost:3001',
  process.env.FRONTEND_URL,
  'https://doorstepvendor.alvinyeboah.com',
  'https://your-other-domain.com', // Add here
].filter(Boolean);
```

## Production Checklist

### Security
- [ ] Change all secret keys in `.env`
- [ ] Use strong `BETTER_AUTH_SECRET`
- [ ] Enable HTTPS on both frontend and backend
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Use environment variables (never commit `.env`)

### Performance
- [ ] Enable caching headers
- [ ] Use CDN for static assets
- [ ] Optimize images
- [ ] Enable gzip compression
- [ ] Database connection pooling

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Application monitoring (DataDog, New Relic)
- [ ] Database monitoring
- [ ] Set up alerts for downtime

## Testing the Deployment

### 1. Test Backend API

```bash
curl https://api.doorstepvendor.alvinyeboah.com/api
# Should return API is running
```

### 2. Test Frontend

Visit: https://doorstepvendor.alvinyeboah.com

### 3. Test Authentication Flow

1. Sign up at `/signup`
2. Sign in at `/login`
3. Access dashboard
4. Check browser console for API calls

### 4. Check CORS

Open browser console on frontend:
```javascript
fetch('https://api.doorstepvendor.alvinyeboah.com/api/auth/session', {
  credentials: 'include'
})
```

Should not show CORS errors.

## Troubleshooting

### CORS Errors

**Problem:** Frontend can't connect to backend

**Solution:**
1. Check `FRONTEND_URL` in backend `.env`
2. Verify CORS configuration in `main.ts`
3. Ensure credentials: true on both ends

### Database Connection Failed

**Problem:** Can't connect to PostgreSQL

**Solution:**
1. Verify `DATABASE_URL` format
2. Check firewall rules
3. Test connection: `psql $DATABASE_URL`

### Better-Auth Session Issues

**Problem:** Can't stay logged in

**Solution:**
1. Check `BETTER_AUTH_URL` matches your domain
2. Verify cookies are being set (check DevTools)
3. Ensure HTTPS in production

## Environment Variables Reference

### Backend (`apps/backend/.env`)

```bash
DATABASE_URL=              # PostgreSQL connection string
PORT=3000                  # API port
NODE_ENV=production        # Environment
FRONTEND_URL=              # Frontend URL for CORS
BETTER_AUTH_SECRET=        # Secret for Better-Auth
BETTER_AUTH_URL=           # Backend URL (with /api prefix)
EMAIL_HOST=                # SMTP host
EMAIL_PORT=587             # SMTP port
EMAIL_USER=                # Email username
EMAIL_PASSWORD=            # Email password
```

### Frontend (`apps/frontend/.env.production`)

```bash
NEXT_PUBLIC_API_URL=       # Backend API URL (without /api prefix)
```

## Support

For issues, check:
1. Application logs
2. Database logs
3. Browser console
4. Network tab in DevTools

## Scaling

As your platform grows:

1. **Database**: Move to managed PostgreSQL (RDS, Cloud SQL)
2. **Backend**: Add load balancer, multiple instances
3. **Frontend**: Already handled by Vercel/Netlify CDN
4. **File Storage**: Use S3/CloudFlare R2 for images
5. **Caching**: Add Redis for sessions and queries
