import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ description: 'The name of the product', example: 'Product A', minLength: 3 })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({ description: 'The price of the product', example: 19.99, minimum: 0.01, required: true })
    @IsNumber({maxDecimalPlaces: 2})
    @Min(0.01)
    price: number;

    @ApiProperty({ description: 'The stock of the product', example: 100, minimum: 0, required: true })
    @IsInt()
    @Min(0)
    stock: number;    
}