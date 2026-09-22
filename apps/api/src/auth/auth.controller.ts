import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; tenantSlug: string }) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string; tenantSlug: string }) {
    return this.authService.login(body);
  }

  // প্রোটেক্টেড রাউট (যেখানে টোকেন ছাড়া ঢোকা যাবে না)
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req: any) {
    return {
      message: 'Access granted to protected route',
      user: req.user, // টোকেন থেকে ডিকোড করা ইউজারের তথ্য
    };
  }
}