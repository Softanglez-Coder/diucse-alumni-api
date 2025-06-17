import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Batch, BatchSchema } from './batch.schema';
import { BatchRepository } from './batch.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Batch.name,
        schema: BatchSchema,
      },
    ]),
  ],
  controllers: [BatchController],
  providers: [BatchService, BatchRepository],
})
export class BatchModule {}
