import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AcademicLevelController } from './academic-level.controller';
import { AcademicLevelService } from './academic-level.service';
import {
  AcademicLevel,
  AcademicLevelSchema,
} from './schemas/academic-level.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AcademicLevel.name, schema: AcademicLevelSchema },
    ]),
  ],
  controllers: [AcademicLevelController],
  providers: [AcademicLevelService],
})
export class AcademicLevelModule {}
