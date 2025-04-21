import { PartialType } from '@nestjs/mapped-types';
import { CreatePassingYearDto } from './create-passing-year.dto';

export class UpdatePassingYearDto extends PartialType(CreatePassingYearDto) {}
