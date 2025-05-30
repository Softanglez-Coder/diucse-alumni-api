import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Batch, BatchSchema } from './batch.schema';
import { BatchController } from './batch.controller';
import { BatchRepository } from './batch.repository';
import { BatchService } from './batch.service';

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
  providers: [BatchRepository, BatchService],
  exports: [BatchService],
})
export class BatchModule {}
