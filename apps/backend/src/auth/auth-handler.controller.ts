import { All, Controller, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { auth } from '../lib/auth';

@Controller('api/auth')
export class AuthHandlerController {
  @All('*')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return auth.handler(req as any);
  }
}