
import { TransactionProcessor } from "@elrondnetwork/transaction-processor";
import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { ApiConfigService } from "src/services/api.config.service";
import { CachingService } from "src/services/caching.service";
import { Constants } from "src/common/utils/constants";
import { Locker } from "src/common/utils/locker";

@Injectable()
export class TransactionProcessorCron {
  private transactionProcessor: TransactionProcessor = new TransactionProcessor();
  private readonly logger: Logger

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly cachingService: CachingService
  ) {
    this.logger = new Logger(TransactionProcessorCron.name);
  }

  @Cron('*/1 * * * * *')
  async handleNewTransactions() {
    Locker.lock('newTransactions', async () => {
      await this.transactionProcessor.start({
        gatewayUrl: this.apiConfigService.getApiUrl(),
        maxLookBehind: 10,
        onTransactionsReceived: async (shardId, nonce, transactions, statistics) => {
          this.logger.verbose(`Received ${transactions.length} transactions on shard ${shardId} and nonce ${nonce}. Time left: ${statistics.secondsLeft}`);
          for (let transaction of transactions) {
            if (transaction.receiver === this.apiConfigService.getTipsContract() && transaction.data) {
              await this.cachingService.deleteInCache(`tips:*`);
            }
          }
        },
        getLastProcessedNonce: async (shardId) => {
          return await this.cachingService.getCacheRemote(`lastProcessedNonce:${shardId}`);
        },
        setLastProcessedNonce: async (shardId, nonce) => {
          await this.cachingService.setCacheRemote(`lastProcessedNonce:${shardId}`, nonce, Constants.oneMonth());
        }
      });
    });
  }
}
