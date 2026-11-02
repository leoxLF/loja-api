import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import type { PaymentStatus } from '../payment.entity';

export class UpdatePaymentStatusDto {

    @ApiProperty({
        example: 'PAID',
        enum: ['PAID', 'CANCELLED']
    })
    @IsEnum(['PAID', 'CANCELLED'])
    status: PaymentStatus;
}