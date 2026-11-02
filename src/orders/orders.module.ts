import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderItem } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../addresses/addresses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Address])],

  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
