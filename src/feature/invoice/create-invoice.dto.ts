import { IsEnum, IsMongoId, IsNumber, Min } from "class-validator";
import { InvoiceRemarks } from "./invoice-remarks";

export class CreateInvoiceDto {
    @IsNumber()
    @Min(1)
    amount: number;

    @IsMongoId()
    user: string;

    @IsEnum(InvoiceRemarks)
    remarks: InvoiceRemarks;
}