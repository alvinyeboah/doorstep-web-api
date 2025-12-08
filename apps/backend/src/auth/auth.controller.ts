import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Headers,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from './guards/auth.guard';
import { Public } from './decorators/public.decorator';
import { AuthService } from './services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new user account',
    description: 'Creates a user account with Better Auth. User can then register for specific role (Vendor, Customer, Stepper).',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password', 'name'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'user@example.com',
          description: 'User email address',
        },
        password: {
          type: 'string',
          format: 'password',
          example: 'SecurePass123!',
          description: 'User password (min 8 characters)',
          minLength: 8,
        },
        name: {
          type: 'string',
          example: 'John Doe',
          description: 'User full name',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clp123abc456def' },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            role: { type: 'string', example: 'CUSTOMER', enum: ['VENDOR', 'CUSTOMER', 'STEPPER'] },
          },
        },
        message: { type: 'string', example: 'User created successfully' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data or email already exists',
  })
  async signUp(@Body() signUpDto: any) {
    return await this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sign in to an existing account',
    description: 'Authenticates user and returns session cookie.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'user@example.com',
          description: 'User email address',
        },
        password: {
          type: 'string',
          format: 'password',
          example: 'SecurePass123!',
          description: 'User password',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User signed in successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clp123abc456def' },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            role: { type: 'string', example: 'CUSTOMER', enum: ['VENDOR', 'CUSTOMER', 'STEPPER'] },
          },
        },
        message: { type: 'string', example: 'User signed in successfully' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid credentials',
  })
  async signIn(@Body() signInDto: any) {
    return await this.authService.signIn(signInDto);
  }

  @Post('google-signin')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Handle Google OAuth sign-in completion',
    description: 'Called after Google OAuth redirect to ensure user profile is created.',
  })
  @ApiResponse({
    status: 200,
    description: 'Google sign-in completed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clp123abc456def' },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            role: { type: 'string', example: 'CUSTOMER' },
          },
        },
        message: { type: 'string', example: 'Google sign-in successful' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - no valid session found',
  })
  async handleGoogleSignIn(@Headers() headers: Record<string, any>) {
    return await this.authService.handleGoogleSignIn(headers);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the authenticated user information',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clp123abc456def' },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            role: { type: 'string', example: 'CUSTOMER', enum: ['VENDOR', 'CUSTOMER', 'STEPPER'] },
            verified: { type: 'boolean', example: true },
          },
        },
        session: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            expiresAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  async getCurrentUser(@Headers() headers: Record<string, any>) {
    // For now, verify session and return user
    return await this.authService.verifySession(headers);
  }

  @Post('signout')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sign out from current session',
    description: 'Invalidates the current session token',
  })
  @ApiResponse({
    status: 200,
    description: 'User signed out successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'User signed out successfully' },
      },
    },
  })
  async signOut(@Headers() headers: Record<string, any>) {
    return await this.authService.signOut(headers);
  }
}
