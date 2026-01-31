import { Transform, TransformFnParams } from "class-transformer";
import { IsIn, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import sanitizeHtml from 'sanitize-html';

export class CreatePlaceCategoryDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(['bar', 'pub', 'nightclub', 'dance_club', 'wine_bar', 'karaoke', 'bowling_alley'])
    @Transform((params: TransformFnParams) =>
        sanitizeHtml(
            params.value,
            { allowedAttributes: {}, allowedTags: [] }
        )
    )
    category: string
}