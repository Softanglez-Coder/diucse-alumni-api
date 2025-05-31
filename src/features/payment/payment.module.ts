import { Module } from '@nestjs/common';
import { ZinipayService } from './providers/zinipay';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [
    ZinipayService
  ],
})
export class PaymentModule {}
