import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request, Res } from '@nestjs/common';
import express from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @SkipThrottle({ place: true, basic: true, postput: true })
    @Post('login')
    async signIn(@Body() body: Record<string, any>, @Res({ passthrough: true }) res: express.Response) {
        const result = await this.authService.signIn(body.email, body.password)
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 3600000,
            signed: true
        })
    }

    @UseGuards(AuthGuard)
    @SkipThrottle({ place: true, login: true, postput: true })
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(AuthGuard)
    @SkipThrottle({ place: true, login: true, postput: true })
    @Post('logout')
    logout(@Res({ passthrough: true }) res: express.Response) {
        res.clearCookie('access_token')
        return { message: 'Logged out successfully' }
    }
}
