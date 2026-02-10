import { ApiProperty } from "@nestjs/swagger"
import { Transform, TransformFnParams } from "class-transformer"
import { IsNotEmpty, IsString } from "class-validator"
import sanitizeHtml from 'sanitize-html'

export class CreatePlaceDto {
    @ApiProperty({ default: "PELDA123ID" })
    @IsString()
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
    @Transform((params: TransformFnParams) =>
        sanitizeHtml(
            params.value,
            { allowedAttributes: {}, allowedTags: [] }
        )
    )
    address: string
}