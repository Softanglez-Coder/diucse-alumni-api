import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto, IPNDto } from './dtos';
import { SSLComz } from './providers';
import { SSLComzInit } from './providers/sslcomz/sslcomz-init';
import { PaymentRepository } from './payment.repository';
import { Payment, PaymentDocument } from './payment.schema';
import { IPNStatus, PaymentRemarks, PaymentStatus } from './enums';
import { MailerService } from '@core';

@Injectable()
export class PaymentService {
  constructor(
    private readonly provider: SSLComz,
    private readonly repository: PaymentRepository,
    private readonly logger: Logger,

    private readonly mailerService: MailerService,
  ) {}

  async create(host: string, dto: CreatePaymentDto) {
    if (dto.product.category === PaymentRemarks.MEMBERSHIP_FEE) {
      dto.product.name = 'Membership Fee';
    }

    const payload = new SSLComzInit(
      host,
      dto.amount,
      dto.product.name,
      dto.product.category,
      dto.customer.name,
      dto.customer.email,
      dto.customer.phone,
    );

    this.logger.log('Creating payment with payload:', JSON.stringify(payload));

    const url = await this.provider.init(payload);
    if (!url) {
      throw new HttpException(
        'Failed to initialize payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const { tran_id: trxId } = payload;

    // Save the transaction to the database
    const payment: Payment = {
      trxId,
      remarks: dto.product.category,
      amount: dto.amount,
      depositAmount: 0,
      email: dto.customer.email,
      referenceId: dto.product?.id,
      status: PaymentStatus.PENDING,
      cardNo: null,
      cardType: null,
      bankTrxId: null,
      cardIssuer: null,
      cardBrand: null,
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

  async handleIPN(payload: IPNDto) {
    const {
      status,
      tran_id: trxId,
      store_amount,
      val_id,
      card_type,
      card_no,
      bank_tran_id,
      card_issuer,
      card_brand,
    } = payload;

    // Validate the transaction ID
    if (!trxId) {
      throw new HttpException(
        'Transaction ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Find the payment record
    const payment: PaymentDocument = await this.repository.findByTrxId(trxId);

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    // Update the payment status and amount
    const parseStatus = () => {
      switch (status) {
        case IPNStatus.VALID:
          return PaymentStatus.COMPLETED;

        case IPNStatus.FAILED:
        case IPNStatus.CANCELLED:
        case IPNStatus.EXPIRED:
          return PaymentStatus.FAILED;

        case IPNStatus.UNATTEMPTED:
          return PaymentStatus.PENDING;
      }
    };

    payment.status = parseStatus();
    payment.depositAmount = store_amount;
    payment.validationId = val_id;
    payment.cardNo = card_no;
    payment.cardType = card_type;
    payment.bankTrxId = bank_tran_id;
    payment.cardIssuer = card_issuer;
    payment.cardBrand = card_brand;

    const updated = await this.repository.update(payment.id, payment);

    if (!updated) {
      throw new HttpException(
        'Failed to update payment record',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      const body = `
      <p>Hello,</p>
      <p>Your payment of ${payment.amount} BDT via ${payment.cardBrand} for ${payment.remarks} has been successfully completed.</p>
      <p>Transaction ID: ${payment.trxId}</p>
      <p>Bank Transaction ID: ${payment.bankTrxId}</p>
      <p>Thank you for your payment!</p>
      `;

      try {
        await this.mailerService.sendMail(
          payment.email,
          'Payment Confirmation',
          body,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send payment confirmation email: ${error.message}`,
        );
      }
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
