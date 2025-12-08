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
 * Creates a corresponding user_profiles record with the same UUID
 */
export async function onUserCreated(user: {
  id: string;
  email: string;
  name?: string | null;
}) {
  const prisma = getPrismaInstance();
  logger.log(`[AUTH HOOK] Creating user_profile for user ${user.id} (${user.email})`);

  try {
    let firstName: string | undefined;
    let lastName: string | undefined;

    if (user.name) {
      const nameParts = user.name.trim().split(' ');
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ') || undefined;
    }

    // Check if profile already exists before creating
    const existingProfile = await prisma.user_profiles.findUnique({
      where: { id: user.id },
    });

    if (existingProfile) {
      logger.log(`[AUTH HOOK] User profile already exists for user ${user.id}, skipping creation`);
      return;
    }

    // Create user_profiles with same UUID as Better Auth user
    await prisma.user_profiles.create({
      data: {
        id: user.id, // Same UUID as Better Auth user
        email: user.email,
        first_name: firstName,
        last_name: lastName,
        preferences: {},
        phone_number: null,
        verified: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    logger.log(`[AUTH HOOK] ✅ Successfully created user_profile for user ${user.id}`);
  } catch (error) {
    logger.error(`[AUTH HOOK] ❌ Failed to create user_profile for user ${user.id}:`, error);
    // Don't throw - profile creation failure shouldn't block authentication
  }
}

/**
 * Hook that runs after a user is updated via Better Auth
 * Syncs email and name changes to user_profiles
 */
export async function onUserUpdated(user: {
  id: string;
  email?: string;
  name?: string | null;
}) {
  const prisma = getPrismaInstance();
  logger.log(`[AUTH HOOK] Updating user_profile for user ${user.id}`);

  try {
    interface ProfileUpdates {
      email?: string;
      first_name?: string | null;
      last_name?: string | null;
    }

    const updates: ProfileUpdates = {};

    if (user.email) {
      updates.email = user.email;
    }

    if (user.name !== undefined) {
      const nameParts = user.name ? user.name.trim().split(' ') : [];
      updates.first_name = nameParts[0] || null;
      updates.last_name = nameParts.slice(1).join(' ') || null;
    }

    if (Object.keys(updates).length > 0) {
      // First check if profile exists
      const existingProfile = await prisma.user_profiles.findUnique({
        where: { id: user.id },
      });

      if (existingProfile) {
        await prisma.user_profiles.update({
          where: { id: user.id },
          data: {
            ...updates,
            updated_at: new Date(),
          },
        });
        logger.log(`[AUTH HOOK] ✅ Successfully updated user_profile for user ${user.id}`);
      } else {
        logger.log(`[AUTH HOOK] User profile not found for user ${user.id}, skipping update`);
      }
    }
  } catch (error) {
    logger.error(`[AUTH HOOK] ❌ Failed to update user_profile for user ${user.id}:`, error);
    // Don't throw - sync issues shouldn't block auth operations
  }
}

/**
 * Hook that runs after a user is deleted via Better Auth
 * Deletes the corresponding user_profiles record
 */
export async function onUserDeleted(userId: string) {
  const prisma = getPrismaInstance();
  logger.log(`[AUTH HOOK] Deleting user_profile for user ${userId}`);

  try {
    await prisma.user_profiles.delete({
      where: { id: userId },
    });
    logger.log(`[AUTH HOOK] ✅ Successfully deleted user_profile for user ${userId}`);
  } catch (error) {
    logger.error(`[AUTH HOOK] ❌ Failed to delete user_profile for user ${userId}:`, error);
    // Don't throw - profile might already be deleted by cascade
  }
}

/**
 * Hook that runs after a user signs in
 * Updates last_sign_in_at timestamp to track user activity
 */
export async function onUserSignIn(userId: string) {
  const prisma = getPrismaInstance();

  try {
    // Update last_sign_in_at to current timestamp
    await prisma.user_profiles.updateMany({
      where: { id: userId },
      data: {
        last_sign_in_at: new Date(),
        updated_at: new Date(),
      },
    });

    logger.log(`[AUTH HOOK] ✅ Updated last_sign_in_at for user ${userId}`);
  } catch (error) {
    logger.error(`[AUTH HOOK] ❌ Failed to update last_sign_in_at for user ${userId}:`, error);
    // Don't throw - tracking failure shouldn't block sign-in
  }
}