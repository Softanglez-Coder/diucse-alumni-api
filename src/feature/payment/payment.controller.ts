import { Controller, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { BaseController, Public, Role, Roles } from '@core';
import { PaymentDocument } from './payment.schema';

@Controller('payments')
export class PaymentController extends BaseController<PaymentDocument> {
  constructor(private readonly paymentService: PaymentService) {
    super(paymentService);
  }

  @Public()
  @Get('webhook')
  async handlePaymentWebhook(
    @Query('invoiceId') invoiceId: string,
    @Query('val_id') validationId: string,
  ) {
    return await this.paymentService.handlePaymentWebhook(
      invoiceId,
      validationId,
    );
  }
}
