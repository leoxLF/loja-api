import { ArrayMinSize, IsArray, IsInt, isInt, Min, Validate, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class OrderItemInput{

    @ApiProperty({ description: 'ID do produto', example: 1 })
    @IsInt()
    @Min(1)
    productId: number;

    @IsInt()
    @Min(1) 
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({ description: 'Lista de itens do pedido', type: [OrderItemInput], example: [{ productId: 1, quantity: 2 }, { productId: 2, quantity: 1 }] })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemInput)
    items: OrderItemInput[];



}