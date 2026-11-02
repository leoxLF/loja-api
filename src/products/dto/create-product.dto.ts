import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ description: 'The name of the product', example: 'Product A', minLength: 3 })
    @IsString({message: 'O nome do produto deve ser uma string'}) 
    @MinLength(3,  { message: 'O nome do produto deve ter pelo menos 3 caracteres' })
    name: string;

    @ApiProperty({ description: 'The price of the product', example: 19.99, minimum: 0.01, required: true })
    @IsNumber({maxDecimalPlaces: 2}, { message: 'O preço do produto deve ser um número válido' })
    @Min(0.01, { message: 'O preço do produto deve ser um valor positivo' })
    price: number;

    @ApiProperty({ description: 'The stock of the product', example: 100, minimum: 0, required: true })
    @IsInt({ message: 'O estoque do produto deve ser um número inteiro' })
    @Min(0, { message: 'O estoque do produto deve ser um valor não negativo' })
    stock: number;    
}