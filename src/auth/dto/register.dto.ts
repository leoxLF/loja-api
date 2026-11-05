import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({ description: 'Nome de usuário para registro. Deve ter no mínimo 2 caracteres.', example: 'usuario123', minLength: 2 })
    @IsString()
    @MinLength(2)
    username: string;

    @ApiProperty({ description: 'Endereço de e-mail do usuário. Deve ser um e-mail válido.', example: 'usuario@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Senha para registro. Deve ter no mínimo 6 caracteres.', example: 'senha123', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;
}