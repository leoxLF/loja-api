import { IsInt, IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(3)
    name: string;

    @IsNumber({maxDecimalPlaces: 2})
    @Min(0.01)
    price: number;

    @IsInt()
    @Min(0)
    stock: number;    
}