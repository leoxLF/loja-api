import { PartialType } from '@nestjs/swagger';
import { UpdateProductDto } from './update-product.dto';

export class PatchProductDto extends PartialType(UpdateProductDto) {}