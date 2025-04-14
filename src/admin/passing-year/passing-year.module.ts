import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassingYear, PassingYearSchema } from './schemas/passing-year.schema';
import { PassingYearController } from './passing-year.controller';
import { PassingYearService } from './passing-year.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PassingYear.name, schema: PassingYearSchema },
    ]),
  ],
  controllers: [PassingYearController],
  providers: [PassingYearService],
})
export class PassingYearModule {}
