import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';

// Use a singleton pattern to ensure we use the same Prisma instance
let prisma: PrismaClient | null = null;
const logger = new Logger('AuthHooks');

function getPrismaInstance(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: ['error'], // Only log errors to reduce noise
    });
  }
  return prisma;
}

/**
 * Hook that runs after a user is created via Better Auth
 * NOTE: Current schema uses User table with role-specific tables (Vendor, Customer, Stepper)
 * User profile creation is handled by the application logic when registering for specific roles
 */
export async function onUserCreated(user: {
  id: string;
  email: string;
  name?: string | null;
}) {
  logger.log(`[AUTH HOOK] User created ${user.id} (${user.email})`);

  // The User table in Better Auth already contains the user data
  // Role-specific profile creation (Vendor, Customer, Stepper) is handled
  // by their respective registration endpoints

  // No action needed here - just logging for audit purposes
  return;
}

/**
 * Hook that runs after a user is updated via Better Auth
 * Syncs email and name changes to User table (handled automatically by Better Auth)
 */
export async function onUserUpdated(user: {
  id: string;
  email?: string;
  name?: string | null;
}) {
  logger.log(`[AUTH HOOK] User updated ${user.id}`);

  // Better Auth automatically updates the User table
  // No additional sync needed

  return;
}

/**
 * Hook that runs after a user is deleted via Better Auth
 * Cascade deletes handled by Prisma schema relations
 */
export async function onUserDeleted(userId: string) {
  logger.log(`[AUTH HOOK] User deleted ${userId}`);

  // Prisma cascade delete rules automatically handle deletion of:
  // - Vendor, Customer, Stepper records (onDelete: Cascade)
  // - Sessions, Accounts, etc.

  return;
}

/**
 * Hook that runs after a user signs in
 * Can be used for tracking or analytics
 */
export async function onUserSignIn(userId: string) {
  logger.log(`[AUTH HOOK] User signed in ${userId}`);

  // Can implement sign-in tracking here if needed in the future
  // For now, just logging for audit purposes

  return;
}
