import { CacheModule, Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import configuration from '../config/configuration';
import { ApiConfigService } from './services/api.config.service';
import { ApiService } from './services/api.service';
import { CachingService } from './services/caching.service';
import { VmQueryService } from './services/vm.query.service';
import { MetricsService } from './endpoints/metrics/metrics.service';
import { TipsController } from './endpoints/tips/tips.controller';
import { TipsService } from './endpoints/tips/tips.service';
import { IPFSController } from './endpoints/ipfs/ipfs.controller';
import { TokensController } from './endpoints/tokens/tokens.controller';
import { TokensService } from './endpoints/tokens/tokens.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    CacheModule.register(),
    HttpModule
  ],
  controllers: [
    TipsController,
    IPFSController,
    TokensController,
  ],
  providers: [
    TipsService,
    TokensService,
    ApiConfigService,
    MetricsService,
    CachingService,
    ApiService,
    VmQueryService,
  ],
})
export class PublicAppModule {}
