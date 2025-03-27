import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreModule } from './core';
import { MembershipModule } from './membership/membership.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y15rh.mongodb.net/diucseapi?retryWrites=true&w=majority`,
    ),//mongodb connect 
    CoreModule,
    MembershipModule,
    UploadModule, 
  ],
})
export class AppModule {}
