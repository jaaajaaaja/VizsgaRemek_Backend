import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength, NotContains } from "class-validator";
import sanitizeHtml from 'sanitize-html';

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    @Transform((params: TransformFnParams) =>
        sanitizeHtml(
            params.value,
            { allowedAttributes: {}, allowedTags: [] }
        )
    )
    commentText: string

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number

    @IsNotEmpty()
    @IsNumber()
    placeID: number
}