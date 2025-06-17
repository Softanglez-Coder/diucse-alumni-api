import { Logger, Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './invoice.schema';
import { InvoiceRepository } from './invoice.repository';
import { PaymentGatewayModule } from '@core';
import { UserModule } from '../user';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Invoice.name,
        schema: InvoiceSchema,
      },
    ]),
    PaymentGatewayModule,
    UserModule,
  ],
  exports: [InvoiceService],
  providers: [InvoiceService, InvoiceRepository, Logger],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
