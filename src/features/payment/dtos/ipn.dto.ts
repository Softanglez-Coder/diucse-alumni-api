import { IsEnum, IsNotEmpty } from 'class-validator';
import { IPNStatus } from '../enums';

export class IPNDto {
  @IsEnum(IPNStatus)
  @IsNotEmpty()
  status: IPNStatus;

  @IsNotEmpty()
  tran_id: string;

  @IsNotEmpty()
  store_amount: number;

  val_id?: string;
  card_type?: string;
  card_no?: string;
  bank_tran_id?: string;
  card_issuer?: string;
  card_brand?: string;
}
