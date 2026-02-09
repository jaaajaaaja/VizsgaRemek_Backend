import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength, NotContains } from "class-validator";
import sanitizeHtml from 'sanitize-html';

export class CreateCommentDto {
    @ApiProperty({ default: "Komment szöveg" })
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

    @ApiProperty({ default: 4 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number

    @ApiProperty({ default: 1 })
    @IsNotEmpty()
    @IsNumber()
    placeID: number
}