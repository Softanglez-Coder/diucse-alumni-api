import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * DatabaseModule
 * 
 * This module is responsible for setting up the MongoDB connection using Mongoose.
 * It uses the ConfigService to retrieve the MongoDB URI from the environment variables.
 * It is imported in the AppModule to ensure that the database connection is established
 * before the application starts.
 * 
 * Do not import this module in any other module.
 * 
 * Use database configuration related operations in this module only.
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
