import { v4 as uuid } from 'uuid';

export class SSLComzInit {
  total_amount: number;
  currency: string = 'BDT';
  tran_id: string = uuid();
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;
  shipping_method: string = 'NO';
  product_name: string;
  product_category: string;
  product_profile: string = 'non-physical-goods';
  cus_name: string;
  cus_email: string;
  cus_add1: string = 'Dhaka';
  cus_add2: string = 'Dhaka';
  cus_city: string = 'Dhaka';
  cus_state: string = 'Dhaka';
  cus_postcode: string = '1000';
  cus_country: string = 'Bangladesh';
  cus_phone: string;
  cus_fax: string;
  ship_name: string;
  ship_add1: string = 'Dhaka';
  ship_add2: string = 'Dhaka';
  ship_city: string = 'Dhaka';
  ship_state: string = 'Dhaka';
  ship_postcode: number = 1000;
  ship_country: string = 'Bangladesh';

  constructor(
    host: string,
    amount: number,
    product: string,
    category: string,
    customer: string,
    email: string,
    phone: string,
  ) {
    this.total_amount = amount;

    this.success_url = `${host}/payment/success`;
    this.fail_url = `${host}/payment/fail`;
    this.cancel_url = `${host}/payment/cancel`;
    this.ipn_url = `${host}/payment/ipn`;

    this.product_name = product;
    this.product_category = category;

    this.cus_name = customer;
    this.ship_name = customer;
    this.cus_email = email;
    this.cus_phone = phone;
    this.cus_fax = phone;
  }
}
