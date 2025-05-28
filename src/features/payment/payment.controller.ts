import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { CreatePaymentDto, IPNDto } from './dtos';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { Public, Role, Roles } from '@core';

@Controller('payment')
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
  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Public()
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.service.getById(id);
  }

  @Public()
  @Post('success')
  async success(@Body() body: IPNDto, @Res() res: Response) {
    const handled = await this.service.handleIPN(body);
    if (!handled) {
      return {
        status: 'error',
        message: 'Payment success notification could not be processed.',
      };
    }

    const url: string = `${process.env.PAYMENT_SUCCESS_REDIRECT_URL}?paymentId=${handled.id}`;
    return res.redirect(url);
  }

  @Public()
  @Post('fail')
  async fail(@Body() body, @Res() res: Response) {
    const handled = await this.service.handleIPN(body);
    if (!handled) {
      return {
        status: 'error',
        message: 'Payment failure notification could not be processed.',
      };
    }

    const url: string = `${process.env.PAYMENT_FAIL_REDIRECT_URL}?paymentId=${handled.id}`;
    return res.redirect(url);
  }

  @Public()
  @Post('cancel')
  async cancel(@Body() body, @Res() res: Response) {
    const handled = await this.service.handleIPN(body);
    if (!handled) {
      return {
        status: 'error',
        message: 'Payment cancellation notification could not be processed.',
      };
    }

    const url: string = `${process.env.PAYMENT_CANCEL_REDIRECT_URL}?paymentId=${handled.id}`;
    return res.redirect(url);
  }

  @Roles(Role.ADMIN, Role.ACCOUNTANT)
  @Post(':id/refund')
  async refund(@Param('id') id: string) {
    return await this.service.refund(id);
  }
}
