import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dtos';
import { PaymentRepository } from './payment.repository';
import { Payment, PaymentDocument } from './payment.schema';
import { PaymentRemarks, PaymentStatus } from './enums';
import { MailerService } from '@core';
import { CreateZinipayPayment, ZinipayService } from './providers/zinipay';
import { MEMBERSHIP_FEE } from '../membership/const';

@Injectable()
export class PaymentService {
  constructor(
    private readonly provider: ZinipayService,
    private readonly repository: PaymentRepository,
    private readonly logger: Logger,

    private readonly mailerService: MailerService,
  ) {}

  async create(host: string, dto: CreatePaymentDto) {
    if (dto.product.category === PaymentRemarks.MEMBERSHIP_FEE) {
      dto.product.name = 'Membership Fee';
    }

    const payload: CreateZinipayPayment = {
      amount: MEMBERSHIP_FEE,
      host,
      customer: {
        email: dto.customer.email,
        name: dto.customer.name,
        phone: dto.customer.phone
      }
    };

    const { payment_url: url } = await this.provider.create(payload);
    if (!url) {
      throw new HttpException(
        'Failed to initialize payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Save the transaction to the database
    const payment: Payment = {
      invoiceId: url.split('/').pop(), // Assuming the URL ends with the transaction ID
      remarks: dto.product.category,
      amount: dto.amount,
      depositAmount: 0,
      email: dto.customer.email,
      referenceId: dto.product?.id,
      status: PaymentStatus.PENDING,
    };

    const created = await this.repository.create(payment);

    if (!created) {
      throw new HttpException(
        'Failed to create payment record',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      id: created.id,
      url,
    };
  }

  async getById(id: string) {
    if (!id) {
      throw new BadRequestException('Payment ID is required');
    }

    const payment: PaymentDocument = await this.repository.findById(id);
    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    return payment;
  }

  async findAll() {
    const payments: PaymentDocument[] = await this.repository.findAll();
    return payments;
  }

  async handleIPN(invoiceId: string, trxId: string) {
    const verified = await this.provider.verify(trxId, invoiceId);
    if (!verified) {
      throw new HttpException(
        'Payment verification failed',
        HttpStatus.BAD_REQUEST,
      );
    }

    const payment: PaymentDocument = await this.repository.findByInvoiceId(invoiceId);

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    if (verified.status === 'COMPLETED') {
      payment.status = PaymentStatus.COMPLETED;
      payment.trxId = verified.val_id;
      payment.bankTransactionId = verified.transaction_id;
      payment.depositAmount = verified.amount;
      payment.method = verified.payment_method;
      payment.sender = verified.senderNumber;
    }

    const updated = await this.repository.update(payment.id, payment);
    if (!updated) {
      throw new HttpException(
        'Failed to update payment record after verification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Send email notification
    try {
      await this.mailerService.sendMail(
        payment.email,
        'Payment Notification',
        `Your payment of ${payment.depositAmount} has been processed successfully. Transaction ID: ${payment.bankTransactionId || payment.trxId}. For: ${payment.remarks}.`,
      )
    } catch (error) {
      throw new HttpException(
        'Failed to send payment notification email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updated;
  }

  async refund(id: string) {
    if (!id) {
      throw new BadRequestException('Payment ID is required for refund');
    }

    const payment: PaymentDocument = await this.repository.findById(id);
    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new HttpException(
        'Only completed payments can be refunded',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Here you would call the provider's refund method
    // For example: await this.provider.refund(payment.trxId);

    // Simulating refund success
    payment.status = PaymentStatus.REFUNDED;
    const updated = await this.repository.update(payment.id, payment);

    if (!updated) {
      throw new HttpException(
        'Failed to update payment record after refund',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updated;
  }
}
