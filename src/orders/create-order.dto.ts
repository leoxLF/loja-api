import { ArrayMinSize, IsArray, IsInt, isInt, Min, Validate, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class OrderItemInput{

    @IsInt()
    @Min(1)
    productId: number;

    @IsInt()
    @Min(1) 
    quantity: number;
}

export class CreateOrderDto {

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemInput)
    items: OrderItemInput[];



}