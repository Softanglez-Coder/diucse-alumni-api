import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice, InvoiceDocument } from './invoice.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '@core';

@Injectable()
export class InvoiceRepository extends BaseRepository<InvoiceDocument> {
  constructor(
    @InjectModel(Invoice.name)
    private readonly invoiceModel: Model<InvoiceDocument>,
  ) {
    super(invoiceModel);
  }
}
