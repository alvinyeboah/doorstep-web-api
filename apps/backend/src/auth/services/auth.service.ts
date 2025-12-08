import { Injectable, Logger, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { auth } from '../../lib/auth';
import { onUserCreated } from '../../lib/auth-hooks';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  /**
   * Sign up a new user with Better Auth
   * Better Auth manages sessions via cookies - no manual tokens needed
   */
  async signUp(signUpDto: any) {
    try {
      // Use Better Auth API directly for sign up
      const result = await auth.api.signUpEmail({
        body: {
          email: signUpDto.email,
          password: signUpDto.password,
          name: signUpDto.name,
        },
      });

      // Database trigger automatically creates user_profiles
      // This is just a safety check in case trigger fails
      if (result?.user) {
        // Run in background, don't block signup
        this.ensureUserProfileExists(result.user.id, result.user.email, result.user.name).catch(error => {
          this.logger.warn('Profile check failed (trigger should have created it):', error);
        });
      }

      // Better Auth handles session via cookies automatically
      // No need to return token - the Set-Cookie header is already set by Better Auth
      return {
        success: true,
        user: result.user,
        message: 'User created successfully'
      };
    } catch (error) {
      this.logger.error('Sign up failed:', error);
      throw new BadRequestException(error.message || 'Failed to create user account');
    }
  }

  /**
   * Sign in an existing user with Better Auth
   * Better Auth manages sessions via cookies - no manual tokens needed
   */
  async signIn(signInDto: any) {
    try {
      // Use Better Auth API directly for sign in
      const result = await auth.api.signInEmail({
        body: {
          email: signInDto.email,
          password: signInDto.password,
        },
      });

      // Profile should already exist from database trigger during signup
      // This is just a safety check for legacy users or edge cases
      if (result?.user) {
        this.ensureUserProfileExists(result.user.id, result.user.email, result.user.name).catch(error => {
          this.logger.warn('Profile check failed during signin:', error);
        });
      }

      // Better Auth handles session via cookies automatically
      // No need to return token - the Set-Cookie header is already set by Better Auth
      return {
        success: true,
        user: result.user,
        message: 'User signed in successfully'
      };
    } catch (error) {
      this.logger.error('Sign in failed:', error);
      throw new BadRequestException(error.message || 'Failed to sign in');
    }
  }

  /**
   * Handle Google OAuth sign-in and ensure user profile is created
   * This method should be called after successful Google OAuth
   */
  async handleGoogleSignIn(headers: Record<string, any>) {
    try {
      // Get the session from Better Auth after OAuth
      const session = await auth.api.getSession({
        headers: headers,
      });

      if (!session?.user) {
        throw new UnauthorizedException('No user session found after Google sign-in');
      }

      const user = session.user;
      this.logger.log(`Google sign-in successful for user: ${user.email}`);

      // Ensure user profile exists for Google OAuth users
      await this.ensureUserProfileExists(user.id, user.email, user.name);

      return {
        success: true,
        user: user,
        message: 'Google sign-in successful'
      };
    } catch (error) {
      this.logger.error('Google sign-in failed:', error);
      throw new BadRequestException(error.message || 'Failed to complete Google sign-in');
    }
  }

  /**
   * Sign out a user
   * Better Auth handles session cleanup via cookies
   */
  async signOut(headers: Record<string, any>) {
    try {
      await auth.api.signOut({
        headers: headers,
      });

      return {
        success: true,
        message: 'User signed out successfully'
      };
    } catch (error) {
      this.logger.error('Sign out failed:', error);
      throw new BadRequestException(error.message || 'Failed to sign out');
    }
  }

  /**
   * Get user profile with linked user_profiles data
   */
  async getUserProfile(userId: string) {
    try {
      const userWithProfile = await this.findUserWithProfile(userId);

      if (!userWithProfile) {
        throw new NotFoundException('User not found');
      }

      return userWithProfile;
    } catch (error) {
      this.logger.error('Get user profile failed:', error);
      throw error;
    }
  }

  /**
   * Verify session - now handled by AuthGuard using Better Auth
   * This method is deprecated but kept for backward compatibility
   */
  async verifySession(headers: Record<string, any>) {
    try {
      const session = await auth.api.getSession({
        headers: headers,
      });

      if (!session || !session.user) {
        throw new UnauthorizedException('Invalid session');
      }

      return session;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }

  /**
   * Check if user has a specific role
   */
  hasRole(user: any, role: string): boolean {
    return user.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(user: any, roles: string[]): boolean {
    return roles.includes(user.role);
  }

  /**
   * Ensure user profile exists, create if it doesn't
   * Database trigger should handle this, but this is a safety net for edge cases
   */
  private async ensureUserProfileExists(
    userId: string,
    email: string,
    name?: string | null
  ): Promise<void> {
    try {
      // Use the auth hook function which handles Prisma properly
      await onUserCreated({
        id: userId,
        email: email,
        name: name,
      });
    } catch (error) {
      this.logger.error(`Failed to ensure user profile exists for ${email}:`, error);
      // Don't throw - profile creation failure shouldn't block auth
    }
  }

  /**
   * Helper method to find user with profile - would need database implementation
   */
  private async findUserWithProfile(userId: string) {
    // This would need to be implemented based on your database schema
    // For now, return the basic user from Better Auth
    try {
      const session = await auth.api.getSession({
        headers: {}, // This won't work without proper headers
      });
      return session?.user || null;
    } catch (error) {
      this.logger.error('Failed to find user with profile:', error);
      return null;
    }
  }
}