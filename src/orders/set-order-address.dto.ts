import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class SetOrderAddressDto {
    @ApiProperty({ example: 1, description: 'ID do endereço' })
    @IsInt()
    @Min(1)
    addressId: number;
}