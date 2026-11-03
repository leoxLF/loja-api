import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { CategoryType } from '../category.entity';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'Tipo da categoria',
        example: 'CAMISA',
        enum: ['CAMISA', 'ACTION FIGURE']
    })
    @IsString()
    @IsNotEmpty()
    @IsIn(['CAMISA', 'ACTION FIGURE'])
    type: CategoryType;
}