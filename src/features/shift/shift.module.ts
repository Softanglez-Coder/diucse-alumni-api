import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shift, ShiftSchema } from './shift.schema';
import { ShiftService } from './shift.service';
import { ShiftRepository } from './shift.repository';
import { ShiftController } from './shift.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Shift.name,
        schema: ShiftSchema,
      },
    ]),
  ],
  controllers: [ShiftController],
  providers: [ShiftService, ShiftRepository],
  exports: [ShiftService],
})
export class ShiftModule {}
