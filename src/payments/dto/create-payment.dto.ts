import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import type { PaymentMethod } from '../payment.entity';

export class CreatePaymentDto {

    @ApiProperty({
        example: 'PIX',
        enum: ['CARD', 'BOLETO', 'PIX']
    })
    @IsEnum(['CARD', 'BOLETO', 'PIX'])
    method: PaymentMethod;
}