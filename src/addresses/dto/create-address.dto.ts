import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MaxLength } from 'class-validator';

export class CreateAddressDto {
    @ApiProperty({ example: 'Rua das Flores', description: 'Nome da rua ou avenida' })
    @IsString()
    @MaxLength(150)
    street: string;

    @ApiProperty({ example: 'Recife', description: 'Cidade do endereço' })
    @IsString()
    @MaxLength(100)
    city: string;

    @ApiProperty({ example: 'PE', description: 'Sigla do estado' })
    @IsString()
    @Length(2, 2)
    state: string;

    @ApiProperty({ example: '150A', description: 'Número do imóvel' })
    @IsString()
    @MaxLength(20)
    number: string;
}