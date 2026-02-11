import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";
import sanitizeHtml from 'sanitize-html';

export class CreateUserDto {
    @ApiProperty({ default: "felhaszálónév" })
    @IsNotEmpty()
    @IsString()
    @Transform((params: TransformFnParams) =>
        sanitizeHtml(
            params.value,
            { allowedAttributes: {}, allowedTags: [] }
        )
    )
    userName: string

    @ApiProperty({ default: "pelda@pelda.pelda" })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({ default: "asd123" })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string

    @ApiProperty({ default: 18 })
    @IsOptional()
    @IsNumber()
    @Min(18)
    age?: number
}