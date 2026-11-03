import { Type } from 'class-transformer';
import { IsInt, Min, Max, IsOptional, IsString, IsIn } from 'class-validator';

export class GetTeamsDto {

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit: number = 10;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsIn(['createdAt', 'name'])
    sort?: 'createdAt' | 'name';

    @IsOptional()
    @IsIn(['asc', 'desc'])
    order?: 'asc' | 'desc';
}