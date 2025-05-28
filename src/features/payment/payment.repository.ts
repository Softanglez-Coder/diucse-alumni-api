import { BaseRepository } from '@core';
import { Injectable } from '@nestjs/common';
import { Payment, PaymentDocument } from './payment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PaymentRepository extends BaseRepository<PaymentDocument> {
  constructor(
    @InjectModel(Payment.name) private readonly model: Model<PaymentDocument>,
  ) {
    super(model);
  }

  async findByTrxId(trxId: string): Promise<PaymentDocument | null> {
    return this.findByProperty('trxId', trxId);
  }
}
