import { BaseRepository } from '@core';
import { Injectable } from '@nestjs/common';
import { Payment, PaymentDocument } from './payment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaymentDto } from './dtos';
import { PaymentStatus } from './enums';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment.name) private readonly model: Model<PaymentDocument>,
  ) {
  }

  async findById(id: string) {
    return await this.model.findById(id).exec();
  }

  async create(dto: Partial<PaymentDocument>) {
    const document = new this.model(dto);
    return await document.save();
  }

  async update(id: string, dto: Partial<CreatePaymentDto>) {
    return await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findPending() {
    return await this.model
      .find()
      .where({
        status: PaymentStatus.PENDING
      })
      .exec();
  }

  async findCompleted() {
    return await this.model
      .find()
      .where({
        status: PaymentStatus.COMPLETED
      })
      .exec();
  }

  async findRefunded() {
    return await this.model
      .find()
      .where({
        status: PaymentStatus.REFUNDED
      })
      .exec();
  }

  async findByInvoiceId(invoiceId: string) {
    return await this.model.findOne({ invoiceId }).exec();
  }
}
