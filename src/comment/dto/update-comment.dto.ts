import { PartialType } from '@nestjs/mapped-types'
import { CreateCommentDto } from "./create-comment.dto";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
    @ApiProperty({ example: "Frissített komment szöveg" })
    commentText: string;

    @ApiProperty({ example: 4 })
    rating: number;

    @ApiProperty({ example: 1 })
    placeID: number;
}