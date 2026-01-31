import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import sanitizeHtml from 'sanitize-html'

export class CreateNewsDto {
    @IsString()
    @MinLength(10)
    @MaxLength(4000)
    @Transform((params: TransformFnParams) =>
            sanitizeHtml(
                params.value,
                { allowedAttributes: {}, allowedTags: [] }
            )
        )
    text: string

    @IsNotEmpty()
    @IsNumber()
    placeID: number
}