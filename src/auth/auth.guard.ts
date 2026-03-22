import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedRequest } from "src/types/user-types";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
        const token = this.extractTokenFromHeader(request)

        if (!token) {
            throw new UnauthorizedException('No token provided')
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

            request.user = user_data
        } catch (error) {
            throw new UnauthorizedException()
        }

        return true
    }

    private extractTokenFromHeader(request: AuthenticatedRequest): string | undefined {
        const tokenFromSignedCookie = request.signedCookies?.access_token
        if (tokenFromSignedCookie) {
            return tokenFromSignedCookie
        }

        const [type, rawToken] = request.headers.authorization?.split(' ') ?? []

        if (type === 'Bearer' && rawToken) {
            let token = decodeURIComponent(rawToken)

            if (token.startsWith('s:')) {
                token = token.slice(2)
            }

            const parts = token.split('.')
            if (parts.length > 3) {
                token = parts.slice(0, 3).join('.')
            }

            return token
        }

        return undefined
    }
}