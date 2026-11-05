import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { Address } from './addresses.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  providers: [AddressesService],
  controllers: [AddressesController]
})
export class AddressesModule {}
