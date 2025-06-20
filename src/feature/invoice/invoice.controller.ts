import { BaseController } from '@core';
import { Controller } from '@nestjs/common';
import { InvoiceDocument } from './invoice.schema';
import { InvoiceService } from './invoice.service';

@Controller('invoices')
export class InvoiceController extends BaseController<InvoiceDocument> {
  constructor(private readonly invoiceService: InvoiceService) {
    super(invoiceService);
  }
}
