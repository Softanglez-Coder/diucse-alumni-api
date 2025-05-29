import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, Res } from '@nestjs/common';
import { CreatePaymentDto, IPNDto } from './dtos';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { Public, Role, Roles } from '@core';
import * as process from 'node:process';

@Controller('payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Public()
  @Post()
  async create(@Body() dto: CreatePaymentDto, @Req() req: Request) {
    const host = `${req.protocol}://${req.get('host')}`;

    if (req.get('port')) {
      host.concat(`:${req.get('port')}`);
    }

    return await this.service.create(host, dto);
  }

  @Roles(Role.ADMIN, Role.ACCOUNTANT)
  @Get('pending')
  async findPending() {
    return await this.service.findPending();
  }

  @Roles(Role.ADMIN, Role.ACCOUNTANT)
  @Get('completed')
  async findCompleted() {
    return await this.service.findCompleted();
  }

  @Roles(Role.ADMIN, Role.ACCOUNTANT)
  @Get('refunded')
  async findRefunded() {
    return await this.service.findRefunded();
  }

  @Public()
  @Get('success')
  async success(
    @Query('invoiceId') invoiceId: string,
    @Query('val_id') trxId: string,
    @Res() res: Response
  ) {
    const handled = await this.service.handleIPN(invoiceId, trxId);
    if (!handled) {
      return {
        status: 'error',
        message: 'Payment success notification could not be processed.',
      };
    }

    return {
      status: 'success',
      message: 'Payment success notification processed successfully.',
    };
  }

  @Public()
  @Post('cancel')
  async cancel(
    @Query('invoiceId') invoiceId: string,
    @Query('val_id') trxId: string,
    @Res() res: Response
  ) {
    const handled = await this.service.handleIPN(invoiceId, trxId);
    if (!handled) {
      return {
        status: 'error',
        message: 'Payment cancellation notification could not be processed.',
      };
    }

    return {
      status: 'success',
      message: 'Payment cancellation notification processed successfully.',
    };
  }

  @Public()
  @Get('webhook')
  async webhook(
    @Query('invoiceId') invoiceId: string,
    @Query('val_id') trxId: string,
    @Res() res: Response
  ) {
    const handled = await this.service.handleIPN(invoiceId, trxId);
    if (!handled) {
      return res.status(400).json({
        status: 'error',
        message: 'Payment webhook notification could not be processed.',
      });
    }

    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Payment webhook notification processed successfully.',
    });
  }

  @Public()
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.service.getById(id);
  }

  @Roles(Role.ADMIN, Role.ACCOUNTANT)
  @Post(':id/refund')
  async refund(@Param('id') id: string, @Body() body: { justification: string }) {
    return await this.service.refund(id, body.justification);
  }
}
