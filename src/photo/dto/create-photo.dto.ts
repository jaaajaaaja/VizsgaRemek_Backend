import { IsNotEmpty, IsNumber } from "class-validator";

export class CreatePhotoDto {
    @IsNotEmpty()
    @IsNumber()
    placeID: number

    @IsNotEmpty()
    @IsNumber()
    userID: number
}