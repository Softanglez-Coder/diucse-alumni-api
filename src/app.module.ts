import { Module } from '@nestjs/common';

import { CoreModule } from '@core';
import { FeatureModule } from '@feature';

@Module({
  imports: [CoreModule, FeatureModule],
  providers: [],
})
export class AppModule {}
