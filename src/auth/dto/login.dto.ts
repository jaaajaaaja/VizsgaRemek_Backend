import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class LoginDto {
    @ApiProperty({ example: "email@email.email" })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({ example: "jelszo123" })
    @IsNotEmpty()
    @IsString()
    password: string
}