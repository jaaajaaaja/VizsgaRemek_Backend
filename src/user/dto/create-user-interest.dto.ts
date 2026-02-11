import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsIn, IsNotEmpty, IsString, MinLength } from "class-validator";
import sanitizeHtml from 'sanitize-html';

export class CreateUserInterestDto {
    @ApiProperty({ default: "bar" })
    @IsNotEmpty()
    @IsString()
    @IsIn(['bar', 'pub', 'nightclub', 'dance_club', 'wine_bar', 'karaoke', 'bowling_alley'])
    @Transform((params: TransformFnParams) =>
        sanitizeHtml(
            params.value,
            { allowedAttributes: {}, allowedTags: [] }
        )
    )
    interest: string
}