import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreatePhotoDto {    
    @ApiProperty({ default: 1 })
    @IsNotEmpty()
    @IsNumber()    
    placeID: number

    @ApiProperty({ default: 1 })
    @IsNotEmpty()
    @IsNumber()
    userID: number
}