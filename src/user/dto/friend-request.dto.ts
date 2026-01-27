import { Transform, TransformFnParams } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import sanitizeHtml from 'sanitize-html';

export class FriendRequestDto {
    @IsNotEmpty()
    @IsNumber()
    recievedFromUserId: number

    @IsNotEmpty()
    @IsBoolean()
    accepted: boolean
}