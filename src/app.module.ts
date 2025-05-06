import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreModule } from './core';
import { MembershipModule } from './membership/membership.module';
import { ConfigModule } from '@nestjs/config';
import { CountryModule } from './admin/country/country.module';
import { ProfessionModule } from './admin/profession/profession.module';
import { InstituteModule } from './admin/institute/institute.module';
import { DesignationsModule } from './admin/designations/designations.module';
import { PassingYearModule } from './admin/passing-year/passing-year.module';
import { AcademicLevelModule } from './admin/academic-level/academic-level.module';
import { BatchModule } from './admin/batch/batch.module';
import { CommitteeModule } from './admin/committee/committee.module';
import { NoticeModule } from './admin/notice/notice.module';
import { EventsModule } from './admin/events/events.module';
import { NewsModule } from './admin/news/news.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y15rh.mongodb.net/diucseapi?retryWrites=true&w=majority`,
    ),

    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore as any,
        host: 'localhost',
        port: 6379,
        ttl: parseInt(process.env.CACHE_TTL || '60'),
      }),
      isGlobal: true,
    }),

    CoreModule,
    MembershipModule,
    CountryModule,
    ProfessionModule,
    InstituteModule,
    DesignationsModule,
    PassingYearModule,
    AcademicLevelModule,
    BatchModule,
    CommitteeModule,
    NoticeModule,
    NewsModule,
    EventsModule,
  ],
})
export class AppModule { }
