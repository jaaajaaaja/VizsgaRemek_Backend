import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import sanitizeHtml from 'sanitize-html';

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    commentText:string

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating:number

    @IsNotEmpty()
    @IsNumber()
    userID:number

    @IsNotEmpty()
    @IsNumber()
    placeID:number
}