import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InvoiceRepository } from './invoice.repository';
import { BaseService, ZinipayService } from '@core';
import { Invoice, InvoiceDocument } from './invoice.schema';
import { UserService } from '../user';
import { MailService, Template } from '../mail';

@Injectable()
export class InvoiceService extends BaseService<InvoiceDocument> {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly paymentGatewayService: ZinipayService,
    private readonly userService: UserService,
    private readonly logger: Logger,
    private readonly mailService: MailService,
  ) {
    super(invoiceRepository);
  }

  override async create(payload: Partial<InvoiceDocument>) {
    const invoice: Invoice = {
      amount: payload.amount,
      remarks: payload.remarks,
      user: payload.user as any,
    };

    const user = await this.userService.findById(invoice.user as any);
    if (!user) {
      this.logger.error(
        `The user with ID: ${invoice.user} not found to create new invoice`,
      );
      throw new NotFoundException(
        `The user with ID: ${invoice.user} not found to create new invoice`,
      );
    }

    const payment = await this.paymentGatewayService.create({
      amount: invoice.amount,
      customer: {
        email: user.email,
        name: user.name,
      },
      metadata: {
        remarks: payload.remarks,
      },
    });

    if (!payment) {
      this.logger.error('Failed to create payment URL');
      throw new InternalServerErrorException('Failed to create payment URL');
    }

    invoice.paymentUrl = payment.payment_url;
    invoice.validationId = payment.val_id;

    const created = await this.repository.create(invoice);
    if (!created) {
      this.logger.error('Failed to create invoice');
      throw new InternalServerErrorException('Failed to create invoice');
    }

    // Send invoice created email
    try {
      await this.mailService.send({
        to: [user.email],
        subject: 'Invoice Created',
        template: Template.InvoiceCreated,
        variables: {
          invoice_id: created.id,
          name: user.name,
          amount: invoice.amount.toString(),
          remarks: invoice.remarks,
          payment_url: invoice.paymentUrl,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to send invoice created email: ${error.message}`,
      );
    }

    return created;
  }
}
