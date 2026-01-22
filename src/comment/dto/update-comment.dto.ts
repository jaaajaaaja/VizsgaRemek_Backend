import { Transform, TransformFnParams } from "class-transformer"
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator"
import sanitizeHtml from 'sanitize-html';

export class UpdateCommentDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(200)
    @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    commentText:string

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating:number
}