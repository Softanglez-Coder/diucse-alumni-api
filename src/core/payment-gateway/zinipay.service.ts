import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { map, firstValueFrom } from 'rxjs';
import {
  CreateZinipayPayment,
  ZinipayCreatePaymentResponse,
  ZinipayVerifyPaymentResponse,
} from './models';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ZinipayService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async create(
    payload: CreateZinipayPayment,
  ): Promise<ZinipayCreatePaymentResponse> {
    const frontend = this.config.get<string>('FRONTEND_URL');
    const server = this.config.get<string>('SERVER_URL');

    const success = this.config.get<string>('PAYMENT_SUCCESS_REDIRECT_URL');
    const failed = this.config.get<string>('PAYMENT_FAIL_REDIRECT_URL');
    const webhook = this.config.get<string>('PAYMENT_WEBHOOK_URL');

    const apiKey = this.config.get<string>('ZINIPAY_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException(
        'ZINIPAY_API_KEY is not set in the environment variables',
      );
    }

    const data = {
      cus_name: payload.customer.name,
      cus_email: payload.customer.email,
      amount: payload.amount,
      redirect_url: `${frontend}/${success}`,
      cancel_url: `${frontend}/${failed}`,
      webhook_url: `${server}/${webhook}`,
      metadata: payload.metadata,
    };

    const paymentUrl = 'https://api.zinipay.com/v1/payment/create';
    const request$ = this.httpService
      .post<ZinipayCreatePaymentResponse>(paymentUrl, data, {
        headers: {
          'zini-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      })
      .pipe(map((response) => response.data));

    return await firstValueFrom(request$);
  }

  async verify(
    validationId: string,
    invoiceId: string,
  ): Promise<ZinipayVerifyPaymentResponse> {
    const data = {
      invoiceId: invoiceId,
      val_id: validationId,
    };

    const apiKey = this.config.get<string>('ZINIPAY_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException(
        'ZINIPAY_API_KEY is not set in the environment variables',
      );
    }

    const verifyUrl = 'https://api.zinipay.com/v1/payment/verify';
    const request$ = this.httpService
      .post<ZinipayVerifyPaymentResponse>(verifyUrl, data, {
        headers: {
          'zini-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      })
      .pipe(map((response) => response.data));

    return await firstValueFrom(request$);
  }
}
