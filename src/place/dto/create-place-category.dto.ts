import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsIn, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import sanitizeHtml from 'sanitize-html';
import { GOOGLE_PLACE_CATEGORIES } from "src/types/place-types";

export class CreatePlaceCategoryDto {
    @ApiProperty({ default: "nightclub" })
    @IsNotEmpty()
    @IsString()
    @IsIn(GOOGLE_PLACE_CATEGORIES)
    @Transform((params: TransformFnParams) =>
        sanitizeHtml(
            params.value,
            { allowedAttributes: {}, allowedTags: [] }
        )
    )
    category: string
}