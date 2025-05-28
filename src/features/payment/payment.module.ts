import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './payment.schema';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';
import { PaymentController } from './payment.controller';
import { SSLComz } from './providers';
import { MailerModule } from '@core';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
    ]),
    MailerModule,
  ],
  exports: [PaymentService],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository, SSLComz, Logger],
})
export class PaymentModule {}
