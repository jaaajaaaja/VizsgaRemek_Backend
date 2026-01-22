import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @SkipThrottle({place: true, basic: true, postput:true})
    @SkipThrottle({place: true})
    @Post('login')
    async signIn(@Body() body: Record<string, any>) {
        return this.authService.signIn(body.email, body.password)
    }

    @UseGuards(AuthGuard)
    @SkipThrottle({place: true, login: true, basic: true, postput:true})
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
