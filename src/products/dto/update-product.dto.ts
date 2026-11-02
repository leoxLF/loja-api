import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class UpdateProductDto {
    @ApiProperty({ description: 'O nome do produto', example: 'Product A', minLength: 3, required: false })
    @IsString({message: 'O nome do produto deve ser uma string'}) 
    @MinLength(3, { message: 'O nome do produto deve ter pelo menos 3 caracteres' })
    name: string;

    @ApiProperty({ description: 'O preço do produto', example: 19.99, minimum: 0.01, required: false })
    @IsNumber({maxDecimalPlaces: 2}, { message: 'O preço do produto deve ser um número válido' })
    @Min(0.01, { message: 'O preço do produto deve ser um valor positivo' })
    price: number;

    @ApiProperty({ description: 'O estoque do produto', example: 100, minimum: 0, required: false })
    @IsInt({ message: 'O estoque do produto deve ser um número inteiro' })
    @Min(0, { message: 'O estoque do produto deve ser um valor não negativo' })
    stock: number;    
}