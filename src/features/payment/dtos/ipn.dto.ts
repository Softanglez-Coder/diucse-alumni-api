import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IPNStatus } from '../enums';

export class IPNDto {
  @IsEnum(IPNStatus)
  @IsNotEmpty()
  status: IPNStatus;

  @IsNotEmpty()
  tran_id: string;

  @IsNotEmpty()
  store_amount: number;

  @IsString()
  val_id?: string;

  @IsString()
  card_type?: string;

  @IsString()
  card_no?: string;

  @IsString()
  bank_tran_id?: string;

  @IsString()
  card_issuer?: string;

  @IsString()
  card_brand?: string;
}
