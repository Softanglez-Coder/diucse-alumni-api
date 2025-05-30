import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { PaymentRemarks } from '../enums';

export class CreatePaymentCustomer {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class CreatePaymentProduct {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsEnum(PaymentRemarks)
  @IsNotEmpty()
  category: PaymentRemarks;
}

export class CreatePaymentDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  amount: number;

  @IsObject()
  @IsNotEmpty()
  product: CreatePaymentProduct;

  @IsObject()
  @IsNotEmpty()
  customer: CreatePaymentCustomer;
}
