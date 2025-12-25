import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    username: string;
    
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsNotEmpty()
    @IsString()
    slug: string;  

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsString()
    img: string;
}