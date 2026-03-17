import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Length, } from "class-validator";
import sanitizeHtml from 'sanitize-html'

export class CreateNewsDto {
    @ApiProperty({ default: "Hely neve" })
    @IsString()
    @Length(10, 4000)
    @Transform((params: TransformFnParams) =>
        sanitizeHtml(
            params.value,
            { allowedAttributes: {}, allowedTags: [] }
        )
    )
    text: string
}