import { BaseService, ZinipayPaymentStatus, ZinipayService } from '@core';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InvoiceService, InvoiceStatus } from '../invoice';
import { Payment, PaymentDocument } from './payment.schema';
import { PaymentRepository } from './payment.repository';
import { PaymentStatus } from './payment-status';
import { MailService, Template } from '../mail';
import { UserDocument } from '../user';

@Injectable()
export class PaymentService extends BaseService<PaymentDocument> {
  constructor(
    private readonly logger: Logger,
    private readonly paymentGatewayService: ZinipayService,
    private readonly invoiceService: InvoiceService,
    private readonly paymentRepository: PaymentRepository,
    private readonly mailService: MailService,
  ) {
    super(paymentRepository);
  }

  async handlePaymentWebhook(invoiceId: string, validationId: string) {
    const varified = await this.paymentGatewayService.verify(
      validationId,
      invoiceId,
    );

    const invoice = await this.invoiceService.findByProperty(
      'validationId',
      validationId,
    );
    if (!invoice) {
      this.logger.error(`Invoice not found for validationId: ${validationId}`);
      throw new NotFoundException(
        `Invoice not found for validationId: ${validationId}`,
      );
    }

    if (varified.status !== ZinipayPaymentStatus.COMPLETED) {
      this.logger.warn(
        `Payment verification failed for invoiceId: ${invoiceId}, status: ${varified.status}`,
      );
      return {
        status: varified.status,
      };
    }

    if (invoice.amount === varified.amount) {
      invoice.status = InvoiceStatus.Paid;
    }

    const updatedInvoice = await this.invoiceService.update(
      invoice.id,
      invoice,
    );
    if (!updatedInvoice) {
      throw new InternalServerErrorException('Failed to update invoice status');
    }

    const payment = await this.paymentRepository.findByProperty(
      'invoice',
      invoice.id,
    );
    if (payment) {
      this.logger.warn(`Payment already exists for invoiceId: ${invoice.id}`);
      payment.status = PaymentStatus.Verified;
      payment.sender = varified.senderNumber;
      payment.trxId = varified.transaction_id;
      payment.method = varified.payment_method;

      const updatedPayment = await this.paymentRepository.update(
        payment.id,
        payment,
      );
      if (!updatedPayment) {
        throw new InternalServerErrorException(
          'Failed to update payment record',
        );
      }

      return updatedPayment;
    }

    const newPayment: Payment = {
      invoice: invoice.id,
      sender: varified.senderNumber,
      trxId: varified.transaction_id,
      method: varified.payment_method,
      status: PaymentStatus.Verified,
    };

    const created = await this.create(newPayment);

    if (!created) {
      throw new InternalServerErrorException('Failed to create payment record');
    }

    const user = invoice.user as UserDocument;
    if (!user.email) {
      this.logger.warn(
        `No email found for user associated with invoiceId: ${invoice.id}`,
      );
      return created;
    }

    // Send payment received email
    try {
      await this.mailService.send({
        to: [user.email],
        subject: 'Payment Received',
        template: Template.InvoicePaid,
        variables: {
          name: user.name,
          amount: invoice.amount.toString(),
          invoice_id: invoice.id,
          payment_method: varified.payment_method,
          transaction_id: varified.transaction_id,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to send payment received email: ${error.message}`,
      );
    }

    return created;
  }
}
