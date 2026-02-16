import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Res,
  Req,
} from '@nestjs/common';
import express from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiOperation({ summary: 'Bejelentkezés (JWT cookie-ba)' })
  @ApiOkResponse({ description: 'Sikeres bejelentkezés' })
  @ApiBadRequestResponse({
    description: 'Sikertelen bejelentkezés (helytelen email vagy jelszó)',
  })
  @ApiUnauthorizedResponse({
    description: 'Sikertelen bejelentkezés (hibás jelszó)',
  })
  @HttpCode(HttpStatus.OK)
  @SkipThrottle({ place: true, basic: true, postput: true })
  @Post('login')
  async signIn(
    @Body() body: Record<string, any>,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.signIn(body.email, body.password);
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600000,
      signed: true,
    });

    return {
      userId: result.userId,
      email: result.email,
    };
  }

  @ApiOperation({ summary: 'Profil lekérése', deprecated: true })
  @ApiOkResponse({ description: 'Lekért profil' })
  @UseGuards(AuthGuard)
  @SkipThrottle({ place: true, login: true, postput: true })
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'Profil lekérése' })
  @ApiCookieAuth()
  @ApiOkResponse({
    description: 'Lekért profil',
    schema: {
      type: "object",
      properties: {
        id: { type: "number", example: 1 },
        userName: { type: "string", example: "felhasználónév" },
        email: { type: "string", example: "felhasznalo@pelda.com" },
        age: { type: "number", example: 18 }
      }
    }
  })
  @UseGuards(AuthGuard)
  @SkipThrottle({ place: true, login: true, postput: true })
  @Get('me')
  getUserProfile(@Req() request: Request) {
    return this.authService.getProfile(request["user"].sub)
  }

  @ApiOperation({
    summary: 'Kijelentkezés',
    description: 'Szükséges hogy a felhasználó be legyen jelentkezve!',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ description: 'Sikeres kijelentkezés' })
  @UseGuards(AuthGuard)
  @SkipThrottle({ place: true, login: true, postput: true })
  @Post('logout')
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
}
