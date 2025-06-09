import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { MongooseError } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Batch, BatchSchema } from './batch.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Batch.name,
        schema: BatchSchema
      }
    ])
  ],
  controllers: [BatchController],
  providers: [BatchService]
})
export class BatchModule {}
