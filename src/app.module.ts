import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreModule } from './core';
<<<<<<< HEAD
import { MembershipModule } from './membership/membership.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y15rh.mongodb.net/diucseapi?retryWrites=true&w=majority`,
    ),
    CoreModule,
    MembershipModule,
=======
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
      CoreModule,
      UploadModule
>>>>>>> origin/dev
  ],
})
export class AppModule {}