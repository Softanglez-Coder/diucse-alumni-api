import { Module } from '@nestjs/common';
import { PaymentGatewayModule } from '@core';

@Module({
  imports: [
    PaymentGatewayModule
  ],
})
export class PaymentModule {}
