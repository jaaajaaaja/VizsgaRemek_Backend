import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class FriendRequestDto {
    @ApiProperty({ default: 1 })
    @IsNotEmpty()
    @IsNumber()
    recievedFromUserId: number

    @ApiProperty({ default: true })
    @IsNotEmpty()
    @IsBoolean()
    accepted: boolean
}