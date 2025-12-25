import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class FollowUserDto {
    @IsNotEmpty()
    @IsString()
    fromUsername: string;

    @IsNotEmpty()
    @IsString()
    toUsername: string;
}