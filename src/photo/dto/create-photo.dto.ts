import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePhotoDto {    
    @ApiProperty({ default: 1 })
    @IsNotEmpty()
    placeID: string
}