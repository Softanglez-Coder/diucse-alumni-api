import { BaseService, ZinipayPaymentStatus, ZinipayService } from '@core';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InvoiceService, InvoiceStatus } from '../invoice';
import { Payment, PaymentDocument } from './payment.schema';
import { PaymentRepository } from './payment.repository';
import { PaymentStatus } from './payment-status';

@Injectable()
export class PaymentService extends BaseService<PaymentDocument> {
    constructor(
        private readonly logger: Logger,
        private readonly paymentGatewayService: ZinipayService,
        private readonly invoiceService: InvoiceService,
        private readonly paymentRepository: PaymentRepository
    ) {
        super(paymentRepository);
    }

    async handlePaymentWebhook(invoiceId: string, validationId: string) {
        const varified = await this.paymentGatewayService.verify(validationId, invoiceId);
        
        const invoice = await this.invoiceService.findByProperty('validationId', validationId);
        if (!invoice) {
            this.logger.error(`Invoice not found for validationId: ${validationId}`);
            throw new NotFoundException(`Invoice not found for validationId: ${validationId}`);
        }

        if (varified.status !== ZinipayPaymentStatus.COMPLETED) {
            this.logger.warn(`Payment verification failed for invoiceId: ${invoiceId}, status: ${varified.status}`);
            return {
                status: varified.status,
            }
        }

        if (invoice.amount === varified.amount) {
            invoice.status = InvoiceStatus.Paid;
        }

        const updatedInvoice = await this.invoiceService.update(invoice.id, invoice);
        if (!updatedInvoice) {
            throw new InternalServerErrorException('Failed to update invoice status');
        }

        const payment: Payment = {
            invoice: invoice.id,
            sender: varified.senderNumber,
            trxId: varified.transaction_id,
            method: varified.payment_method,
            status: PaymentStatus.Verified
        };

        const newPaymant = await this.create(payment);

        if (!newPaymant) {
            throw new InternalServerErrorException('Failed to create payment record');
        }
        
        return newPaymant;
    }
}
