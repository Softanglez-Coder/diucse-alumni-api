import { Logger, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentGatewayModule } from '@core';
import { InvoiceModule } from '../invoice';
import { PaymentRepository } from './payment.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './payment.schema';
import { MailModule } from '../mail';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
    ]),
    PaymentGatewayModule,
    InvoiceModule,
    MailModule,
  ],
  providers: [PaymentService, PaymentRepository, Logger],
  controllers: [PaymentController],
})
export class PaymentModule {}
