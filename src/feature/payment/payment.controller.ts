import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public, Role, Roles } from '@core';

@Controller('payment')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService
    ) {}

    @Roles(
        Role.Admin,
        Role.Accountant
    )
    @Get()
    async findAll() {
        return await this.paymentService.findAll();
    }

    @Public()
    @Get('webhook')
    async handlePaymentWebhook(
        @Query('invoiceId') invoiceId: string,
        @Query('val_id') validationId: string, 
    ) {
        return await this.paymentService.handlePaymentWebhook(invoiceId, validationId);
    }
}
