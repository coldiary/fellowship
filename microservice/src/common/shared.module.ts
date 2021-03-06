import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';

import { MetricsService } from 'src/endpoints/metrics/metrics.service';
import { ApiConfigService } from 'src/services/api.config.service';
import { ApiService } from 'src/services/api.service';
import { CachingService } from 'src/services/caching.service';

@Module({
    imports: [
        CacheModule.register(),
        HttpModule,
    ],
    providers: [
        ApiService,
        ApiConfigService,
        CachingService,
        MetricsService,
    ],
    exports: [
        CacheModule.register(),
        HttpModule,
        ApiService,
        ApiConfigService,
        CachingService,
        MetricsService,
    ]
})
export class SharedModule {}
