import { Logger, Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { StorageModule } from '@core';
import { CommitteeDesignationModule } from '../committee-designation';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    StorageModule,
    forwardRef(() => CommitteeDesignationModule),
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserRepository, UserService, Logger],
})
export class UserModule {}
