import { ApiProperty } from "@nestjs/swagger"
import { Transform, TransformFnParams } from "class-transformer"
import { IsAlphanumeric, IsNotEmpty, IsString, Length } from "class-validator"
import sanitizeHtml from 'sanitize-html'

export class CreatePlaceDto {
    @ApiProperty({ default: "PELDA123ID" })
    @IsAlphanumeric()
    @Length(1, 200)
    @Transform((params: TransformFnParams) =>
        sanitizeHtml(
            params.value,
            { allowedAttributes: {}, allowedTags: [] }
        )
    )
    googleplaceID: string

    @ApiProperty({ default: "Hely neve" })
    @IsNotEmpty()
    @IsString()
    @Length(1, 40)
    @Transform((params: TransformFnParams) =>
        sanitizeHtml(
            params.value,
            { allowedAttributes: {}, allowedTags: [] }
        )
    )
    name: string

    @ApiProperty({ default: "Hely címe" })
    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    @Transform((params: TransformFnParams) =>
        sanitizeHtml(
            params.value,
            { allowedAttributes: {}, allowedTags: [] }
        )
    )
    address: string
}