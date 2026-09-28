// // import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
// // import { AuthService } from './auth.service';
// // import { AuthGuard } from '@nestjs/passport';

// // @Controller('auth')
// // export class AuthController {
// //   constructor(private authService: AuthService) {}

// //   @Post('register')
// //   async register(@Body() body: { email: string; password: string; tenantSlug: string }) {
// //     return this.authService.register(body);
// //   }

// //   @Post('login')
// //   async login(@Body() body: { email: string; password: string; tenantSlug: string }) {
// //     return this.authService.login(body);
// //   }

// //   // প্রোটেক্টেড রাউট (যেখানে টোকেন ছাড়া ঢোকা যাবে না)
// //   @UseGuards(AuthGuard('jwt'))
// //   @Get('profile')
// //   getProfile(@Request() req: any) {
// //     return {
// //       message: 'Access granted to protected route',
// //       user: req.user, // টোকেন থেকে ডিকোড করা ইউজারের তথ্য
// //     };
// //   }
// // }

// // ---------------
// import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthGuard } from '@nestjs/passport';

// @Controller('auth')
// export class AuthController {
//   constructor(private authService: AuthService) {}

//   @Post('register')
//   async register(@Body() body: { email: string; password: string; tenantSlug: string }) {
//     return this.authService.register(body);
//   }

//   @Post('login')
//   async login(@Body() body: { email: string; password: string; tenantSlug: string }) {
//     return this.authService.login(body);
//   }

//   // রিফ্রেশ টোকেন এন্ডপয়েন্ট (প্রোটেক্টেড অথবা টোকেন ভিত্তিক)
//   @UseGuards(AuthGuard('jwt'))
//   @Post('refresh')
//   async refreshTokens(@Request() req: any) {
//     const userId = req.user.sub || req.user.userId;
//     const refreshToken = req.body.refreshToken;
//     return this.authService.refreshTokens(userId, refreshToken);
//   }

//   // লগআউট এন্ডপয়েন্ট
//   @UseGuards(AuthGuard('jwt'))
//   @Post('logout')
//   async logout(@Request() req: any) {
//     const userId = req.user.sub || req.user.userId;
//     return this.authService.logout(userId);
//   }

//   // পাসওয়ার্ড রিকভারি
//   @Post('forgot-password')
//   async forgotPassword(@Body() body: { email: string }) {
//     return this.authService.forgotPassword(body.email);
//   }

//   // পাসওয়ার্ড রিসেট
//   @Post('reset-password')
//   async resetPassword(@Body() body: { email: string; newPassword: string }) {
//     return this.authService.resetPassword(body);
//   }

//   // প্রোটেক্টেড প্রোফাইল রাউট
//   @UseGuards(AuthGuard('jwt'))
//   @Get('profile')
//   getProfile(@Request() req: any) {
//     return {
//       message: 'Access granted to protected route',
//       user: req.user,
//     };
//   }
// }

// ---------------
import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'manager@beta.com' },
        password: { type: 'string', example: 'newpassword123' },
        tenantSlug: { type: 'string', example: 'beta-corp' },
      },
    },
  })
  async register(@Body() body: { email: string; password: string; tenantSlug: string }) {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'manager@beta.com' },
        password: { type: 'string', example: 'newpassword123' },
        tenantSlug: { type: 'string', example: 'beta-corp' },
      },
    },
  })
  async login(@Body() body: { email: string; password: string; tenantSlug: string }) {
    return this.authService.login(body);
  }

  // রিফ্রেশ টোকেন এন্ডপয়েন্ট
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT tokens' })
  async refreshTokens(@Request() req: any) {
    const userId = req.user.sub || req.user.userId;
    const refreshToken = req.body.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  // লগআউট এন্ডপয়েন্ট
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  async logout(@Request() req: any) {
    const userId = req.user.sub || req.user.userId;
    return this.authService.logout(userId);
  }

  // পাসওয়ার্ড রিকভারি
  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password request' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'manager@beta.com' },
      },
    },
  })
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  // পাসওয়ার্ড রিসেট
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'manager@beta.com' },
        newPassword: { type: 'string', example: 'newpassword123' },
      },
    },
  })
  async resetPassword(@Body() body: { email: string; newPassword: string }) {
    return this.authService.resetPassword(body);
  }

  // প্রোটেক্টেড প্রোফাইল রাউট
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  getProfile(@Request() req: any) {
    return {
      message: 'Access granted to protected route',
      user: req.user,
    };
  }
}