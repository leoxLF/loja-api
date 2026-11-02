import { ApiProperty } from "@nestjs/swagger";
import { IsString, Min, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({ description: 'Nome de usuário para login. Deve ser um login já cadastrado.', example: 'usuario123', minLength: 2 })
    @IsString()
    @MinLength(2)
    username: string;

    @ApiProperty({ description: 'Senha para login. Deve ser uma senha já cadastrada.', example: 'senha123', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;
}