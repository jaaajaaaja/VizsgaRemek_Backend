import { Transform, TransformFnParams } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";
import sanitizeHtml from 'sanitize-html';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Transform((params: TransformFnParams) =>
        sanitizeHtml(
            params.value,
            { allowedAttributes: {}, allowedTags: [] }
        )
    )
    userName: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string

    @IsOptional()
    @IsNumber()
    @Min(18)
    age?: number
}