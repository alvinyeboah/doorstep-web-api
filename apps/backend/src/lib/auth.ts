import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      enabled:
        !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'CUSTOMER',
        input: true,
      },
      phone: {
        type: 'string',
        required: false,
        input: true,
      },
      verified: {
        type: 'boolean',
        required: false,
        defaultValue: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  advanced: {
    database: {
      generateId: () => randomUUID(),
    },
  },
  middleware: {
    pre: async (request: any) => {
      console.log(`[Auth Middleware] ${request.method} ${request.url}`);
      return request;
    },
    post: async (response: any) => {
      return response;
    },
  },
  onUserCreated: async (user: any) => {
    console.log('[Auth] User created:', user.id, user.email, user.role);
    // You can add additional logic here like sending welcome emails
  },
  onUserUpdated: async (user: any) => {
    console.log('[Auth] User updated:', user.id, user.email);
  },
  onUserDeleted: async (user: any) => {
    console.log('[Auth] User deleted:', user.id, user.email);
  },
  cors: [
    'http://localhost:3001',
    process.env.FRONTEND_URL || '',
    'https://doorstepvendor.alvinyeboah.com',
  ].filter(Boolean),
  trustedOrigins: [
    'http://localhost:3001',
    process.env.FRONTEND_URL || '',
    'https://doorstepvendor.alvinyeboah.com',
    process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  ].filter(Boolean),
  secret:
    process.env.BETTER_AUTH_SECRET || 'your-secret-key-change-in-production',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
});

export type Session = typeof auth.$Infer.Session;
