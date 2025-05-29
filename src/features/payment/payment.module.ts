import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './payment.schema';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';
import { PaymentController } from './payment.controller';
import { MailerModule } from '@core';
import { ZinipayService } from './providers/zinipay';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
    ]),
    MailerModule,
    HttpModule
  ],
  exports: [PaymentService],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentRepository,
    Logger,
    ZinipayService
  ],
})
export class PaymentModule {}
