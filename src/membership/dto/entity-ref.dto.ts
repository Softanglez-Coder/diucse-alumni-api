import { IsString } from 'class-validator';

export class EntityRefDto {
    @IsString()
    id: string;

    @IsString()
    name: string;
}
