import { Module } from '@nestjs/common';
import { MetricsController } from './endpoints/metrics/metrics.controller';
import { MetricsService } from './endpoints/metrics/metrics.service';

@Module({
  imports: [],
  controllers: [
    MetricsController
  ],
  providers: [
    MetricsService
  ],
})
export class PrivateAppModule {}
