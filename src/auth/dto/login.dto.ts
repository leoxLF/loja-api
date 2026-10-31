import { IsString, Min, MinLength } from "class-validator";

export class LoginDto {
    @IsString()
    @MinLength(2)
    username: string;

    @IsString()
    @MinLength(6)
    password: string;
}