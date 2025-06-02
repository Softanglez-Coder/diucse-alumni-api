import { Module } from "@nestjs/common";
import { ZinipayService } from "./zinipay.service";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [
        HttpModule
    ],
    providers: [
        ZinipayService
    ],
    exports: [
        ZinipayService
    ]
})
export class PaymentGatewayModule {}