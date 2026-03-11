import { CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

export class DisabledGuard implements CanActivate {
    constructor(private readonly url: string) { }

    canActivate(context: ExecutionContext): any {
        throw new HttpException(
            `This endpoint has been disabled!${this.url.length > 0 ? ` Use ${this.url} instead!` : ""}`,
            HttpStatus.GONE, // 410
        )
    }
}