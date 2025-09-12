import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommitteeController } from './committee.controller';
import { CommitteeService } from './committee.service';
import { CommitteeRepository } from './committee.repository';
import { Committee, CommitteeSchema } from './committee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Committee.name, schema: CommitteeSchema },
    ]),
  ],
  controllers: [CommitteeController],
  providers: [CommitteeService, CommitteeRepository],
  exports: [CommitteeService],
})
export class CommitteeModule {}
