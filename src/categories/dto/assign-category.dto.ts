import { IsInt, IsPositive } from 'class-validator';

export class AssignCategoryDto {
    @IsInt()
    @IsPositive()
    categoryId: number;
}