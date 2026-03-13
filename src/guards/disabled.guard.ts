import { CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

/**
 * @constructor you can pass an url to show what endpoint is active currently instead of this
 * @throws 410
 */
export class DisabledGuard implements CanActivate {
    constructor(private readonly url: string) { }

    canActivate(context: ExecutionContext): any {
        throw new HttpException(
            `This endpoint has been disabled!${this.url.length > 0 ? ` Use ${this.url} instead!` : ""}`,
            HttpStatus.GONE
        )
    }
}