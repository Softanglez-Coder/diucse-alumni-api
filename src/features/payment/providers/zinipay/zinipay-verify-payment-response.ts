import { ZinipayPaymentStatus } from './zinipay-payment-status';

export class ZinipayVerifyPaymentResponse {
  val_id: string;
  transaction_id: string;
  invoice_id: string;
  amount: number;
  payment_method: string;
  status: ZinipayPaymentStatus;
  senderNumber: string;
  createdAt: string;
}