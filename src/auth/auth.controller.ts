import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request, Res, Req, } from '@nestjs/common';
import express from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { GetMe, GetProfile, Login, Logout } from 'src/decorators/auth.decorator';
import { DisabledGuard } from 'src/decorators/disabled.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Login()
  @HttpCode(HttpStatus.OK)
  @SkipThrottle({ place: true, basic: true, postput: true })
  @Post('login')
  async signIn(
    @Body() body: Record<string, any>,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.signIn(body.email, body.password)
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600000,
      signed: true,
    })

    return {
      userId: result.userId,
      email: result.email,
    }
  }

  /**
  * @deprecated Use `getUserProfile()` instead.
  */
  @GetProfile()
  @UseGuards(DisabledGuard)
  @SkipThrottle({ place: true, login: true, postput: true })
  @Get('profile')
  async getProfile(@Request() req: any) {
    return req.user
  }

  @GetMe()
  @UseGuards(AuthGuard)
  @SkipThrottle({ place: true, login: true, postput: true })
  @Get('me')
  getUserProfile(@Req() request: Request) {
    return this.authService.getProfile(request["user"].sub)
  }

  @Logout()
  @UseGuards(AuthGuard)
  @SkipThrottle({ place: true, login: true, postput: true })
  @Post('logout')
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('access_token', { path: '/', httpOnly: true, sameSite: 'lax' })
    return { message: 'Logged out successfully' }
  }
}
