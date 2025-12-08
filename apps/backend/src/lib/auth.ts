import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { onUserCreated, onUserUpdated, onUserDeleted, onUserSignIn } from './auth-hooks';

const prisma = new PrismaClient();

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  // Database configuration using Prisma
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  // Base URL for proper OAuth redirects - should point to API
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',

  // Enable CORS for frontend domains
  cors: {
    origin: [
      'http://localhost:3001', // Frontend
      ...(process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
        : []),
      'https://doorstepvendor.alvinyeboah.com',
    ].filter(Boolean) as string[],
    credentials: true,
  },

  // Email/password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Can enable later
  },

  // Google OAuth provider
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Always get refresh tokens and force account selection for better UX
      accessType: "offline",
      prompt: "select_account consent",
      // Configure redirect URIs for frontend app
      redirectUri: `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/api/auth/callback/google`,
    },
  },

  // User configuration with role field for RBAC
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'CUSTOMER',
        input: false, // Not settable by user input
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

  // Account linking - automatically link Google OAuth to existing email/password accounts
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'], // Trust Google to link accounts with same email
    },
  },

  // Session management (using Better Auth's built-in system)
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,      // Refresh session if older than 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // Advanced configuration
  advanced: {
    database: {
      generateId: () => uuidv4(),
    },
  },

  // Trusted origins for CORS - include all possible frontend URLs
  trustedOrigins: [
    'http://localhost:3001', // Frontend
    'http://localhost:3001/auth/callback', // Frontend callback
    ...(process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
      : []),
    'https://doorstepvendor.alvinyeboah.com',
    ...(process.env.NEXT_PUBLIC_BASE_URL
      ? [process.env.NEXT_PUBLIC_BASE_URL]
      : []),
  ].filter(Boolean) as string[],

  // Note: Better Auth uses default cookie names
  // - better-auth.session_token (the session token)
  // - better-auth.session_data (cached session data if cookieCache is enabled)
  // These cookies are set automatically and handled by Better Auth

  // Register custom middleware to handle user profile creation
  middleware: {
    pre: async (request) => {
      // Log all auth requests for debugging
      console.log(`[BETTER AUTH MIDDLEWARE] ${request.method} ${request.url}`);
      return request;
    },
    post: async (response) => {
      // Check if this was a successful sign-up or sign-in
      const url = new URL(response.url);

      if (url.pathname.includes('/sign-up') && response.status === 200) {
        console.log('[BETTER AUTH MIDDLEWARE] Sign-up completed, checking user...');

        // Try to get the user from session and create profile
        try {
          const session = await auth.api.getSession({
            headers: Object.fromEntries(response.headers.entries()),
          });

          if (session?.user) {
            console.log('[BETTER AUTH MIDDLEWARE] Creating profile for user:', session.user.email);
            await onUserCreated({
              id: session.user.id,
              email: session.user.email,
              name: session.user.name,
            });
          }
        } catch (error) {
          console.error('[BETTER AUTH MIDDLEWARE] Failed to create user profile:', error);
        }
      }

      // Track sign-in activity
      if ((url.pathname.includes('/sign-in') || url.pathname.includes('/callback')) && response.status === 200) {
        console.log('[BETTER AUTH MIDDLEWARE] Sign-in detected, updating last_sign_in_at...');

        try {
          const session = await auth.api.getSession({
            headers: Object.fromEntries(response.headers.entries()),
          });

          if (session?.user) {
            console.log('[BETTER AUTH MIDDLEWARE] Updating last_sign_in_at for user:', session.user.email);
            await onUserSignIn(session.user.id);
          }
        } catch (error) {
          console.error('[BETTER AUTH MIDDLEWARE] Failed to update last_sign_in_at:', error);
        }
      }

      return response;
    },
  },

  }) as any;

export type Auth = typeof auth;
