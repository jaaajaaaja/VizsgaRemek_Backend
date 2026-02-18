import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)

        if (!token) {
            throw new UnauthorizedException()
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: process.env.JWT_SECRET
                }
            )

            const email = payload.email;
            if (!email) {
                throw new UnauthorizedException('Email not found in token payload')
            }

            const user = await this.prisma.user.findUnique({ where: { email } })
            if (!user) {
                throw new UnauthorizedException('User not found')
            }

            const user_data = { sub: user.id, email: user.email, role: user.role }

            request['user'] = user_data
        } catch {
            throw new UnauthorizedException()
        }

        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const tokenFromCookie = request.signedCookies?.access_token
        if (tokenFromCookie) {
            return tokenFromCookie
        }

        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}