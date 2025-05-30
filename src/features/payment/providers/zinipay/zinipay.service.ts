import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateZinipayPayment } from './create-zinipay-payment';
import { firstValueFrom } from 'rxjs';
import { ZinipayCreatePaymentResponse } from './zinipay-create-payment-response';
import * as process from 'node:process';
import { map } from 'rxjs/operators';
import { ZinipayVerifyPaymentResponse } from './zinipay-verify-payment-response';

@Injectable()
export class ZinipayService {
  constructor(
    private readonly httpService: HttpService
  ) {}

  async create(payload: CreateZinipayPayment): Promise<ZinipayCreatePaymentResponse> {
    const data = {
      cus_name: payload.customer.name,
      cus_email: payload.customer.email,
      amount: payload.amount,
      redirect_url: `${payload.host}/${process.env.PAYMENT_SUCCESS_REDIRECT_URL}`,
      cancel_url: `${payload.host}/${process.env.PAYMENT_CANCEL_REDIRECT_URL}`,
      webhook_url: `${payload.host}/${process.env.PAYMENT_WEBHOOK_URL}`,
      metadata: {
        phone: payload.customer.phone
      }
    };

    const paymentUrl = 'https://api.zinipay.com/v1/payment/create';
    const request$ = this.httpService.post<ZinipayCreatePaymentResponse>(paymentUrl, data, {
      headers: {
        'zini-api-key': `${process.env.ZINIPAY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
      .pipe(
        map(response => response.data)
      );

    return await firstValueFrom(request$);
  }

  async verify(trxId: string, invoiceId: string): Promise<ZinipayVerifyPaymentResponse> {
    const data = {
      invoiceId: invoiceId,
      val_id: trxId
    }
    const verifyUrl = 'https://api.zinipay.com/v1/payment/verify';
    const request$ = this.httpService.post<ZinipayVerifyPaymentResponse>(verifyUrl, data, {
      headers: {
        'zini-api-key': `${process.env.ZINIPAY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
      .pipe(
        map(response => response.data)
      );

    return await firstValueFrom(request$);
  }
}