import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class DisabledGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        throw new HttpException(
            "This endpoint has been disabled! Use /me instead!",
            HttpStatus.GONE, // 410
        );
    }
}