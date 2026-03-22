import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsIn, IsNotEmpty, IsString } from "class-validator";
import sanitizeHtml from 'sanitize-html';
import { GOOGLE_PLACE_CATEGORIES } from "src/types/place-types";

export class CreateUserInterestDto {
    @ApiProperty({ default: "bar" })
    @IsNotEmpty()
    @IsString()
    @IsIn(GOOGLE_PLACE_CATEGORIES)
    @Transform((params: TransformFnParams) =>
        sanitizeHtml(
            params.value,
            { allowedAttributes: {}, allowedTags: [] }
        )
    )
    interest: string
}