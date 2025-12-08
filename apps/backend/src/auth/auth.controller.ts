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
} from '@nestjs/swagger';
import { AuthGuard } from './guards/auth.guard';
import { Public } from './decorators/public.decorator';
import { AuthService } from './services/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new user account',
    description: 'Creates a user account with Better Auth. Automatically creates linked user_profiles record.',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
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
  @ApiResponse({
    status: 200,
    description: 'User signed in successfully',
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
    description: 'Returns the authenticated user with linked user_profiles data',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
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
  })
  async signOut(@Headers() headers: Record<string, any>) {
    return await this.authService.signOut(headers);
  }
}
