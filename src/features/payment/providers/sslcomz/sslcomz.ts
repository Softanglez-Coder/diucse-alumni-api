import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SSLComzInit } from './sslcomz-init';
import * as SSLCommerzPayment from 'sslcommerz-lts';

@Injectable()
export class SSLComz {
  constructor(private readonly logger: Logger) {}

  async init(payload: SSLComzInit) {
    const store_id = process.env.SSL_COMMERZ_STORE_ID;
    const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWORD;
    const is_live = process.env.SSL_COMMERZ_IS_LIVE === 'true';

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    try {
      const response = await sslcz.init(payload);
      const url = response.GatewayPageURL;
      return url;
    } catch (error) {
      this.logger.error('SSL Commerce payment initiation error:', error);

      throw new HttpException(
        'SSL Commerce payment initiation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateIPN(ipnData: any) {
    const store_id = process.env.SSL_COMMERZ_STORE_ID;
    const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWORD;
    const is_live = process.env.SSL_COMMERZ_IS_LIVE === 'true';

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    try {
      const response = await sslcz.validateIPN(ipnData);
      return response;
    } catch (error) {
      this.logger.error('SSL Commerce IPN validation error:', error);
      throw new HttpException(
        'SSL Commerce IPN validation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refund(trxId: string) {
    const store_id = process.env.SSL_COMMERZ_STORE_ID;
    const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWORD;
    const is_live = process.env.SSL_COMMERZ_IS_LIVE === 'true';

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    try {
      const response = await sslcz.initiateRefund(trxId);
      return response;
    } catch (error) {
      this.logger.error('SSL Commerce refund error:', error);
      throw new HttpException(
        'SSL Commerce refund failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
