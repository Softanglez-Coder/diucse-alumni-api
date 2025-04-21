import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DesignationsController } from './designations.controller';
import { DesignationsService } from './designations.service';
import { Designation, DesignationSchema } from './schemas/designations.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Designation.name, schema: DesignationSchema },
    ]),
  ],
  controllers: [DesignationsController],
  providers: [DesignationsService],
})
export class DesignationsModule {}
