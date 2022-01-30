import { ApiConfigService } from "./common/api.config.service";
import { ClientOptions, ClientProxyFactory, Transport } from '@nestjs/microservices';

export const PubSubProvider = {
    provide: 'PUBSUB_SERVICE',
    useFactory: (apiConfigService: ApiConfigService) => {
      let clientOptions: ClientOptions = {
        transport: Transport.REDIS,
        options: {
          url: `redis://${apiConfigService.getRedisUrl()}:6379`,
          retryDelay: 1000,
          retryAttempts: 10,
          retry_strategy: function(_: any) {
            return 1000;
          },
        }
      };

      return ClientProxyFactory.create(clientOptions);
    },
    inject: [ ApiConfigService ]
  }
