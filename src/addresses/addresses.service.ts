import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './addresses.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>


    ) { }
    async create(dto: CreateAddressDto, userId: number): Promise<Address> {
        const address = this.addressRepository.create({
            ...dto,
            userId,
        });
        return this.addressRepository.save(address);
    }
    async findAll(userId: number): Promise<Address[]> {
        return this.addressRepository.find({
            where: { userId },
        });
    }

    async findOne(id: number, userId: number): Promise<Address> {
        const address = await this.addressRepository.findOne({
            where: { id, userId },
        });

        if (!address) {
            throw new NotFoundException('Endereço não encontrado');
        }

        return address;
    }

    async update(
        id: number,
        dto: UpdateAddressDto,
        userId: number
    ): Promise<Address> {
        const address = await this.findOne(id, userId);

        this.addressRepository.merge(address, dto);

        return this.addressRepository.save(address);
    }

    async remove(id: number, userId: number): Promise<void> {
    const address = await this.findOne(id, userId);

    await this.addressRepository.remove(address);
}
}
