
import { ShardTransaction, TransactionProcessor } from "@elrondnetwork/transaction-processor";
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
    private contractAddresses: Record<string, string> = {};

    constructor(
        private readonly apiConfigService: ApiConfigService,
        private readonly cachingService: CachingService
    ) {
        this.logger = new Logger(TransactionProcessorCron.name);
        this.contractAddresses = {
            tips: this.apiConfigService.getTipsContract(),
            trade: this.apiConfigService.getTradeContract()
        }
    }

    @Cron('*/1 * * * * *')
    async handleNewTransactions() {
        Locker.lock('newTransactions', async () => {
            try {
                await this.transactionProcessor.start({
                    gatewayUrl: this.apiConfigService.getApiUrl(),
                    maxLookBehind: 10,
                    onTransactionsReceived: async (shardId, nonce, transactions, statistics) => {
                        this.logger.verbose(`Received ${transactions.length} transactions on shard ${shardId} and nonce ${nonce}. Time left: ${statistics.secondsLeft}`);
                        for (let transaction of transactions) {
                            switch (transaction.receiver) {
                                case this.contractAddresses.tips: this.processTipsTransaction(transaction); break;
                                case this.contractAddresses.trade: await this.cachingService.deleteInCache(`trade:*`); break;
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
            } catch (err) {
                console.error(err);
            }
        });
    }

    processTipsTransaction = async (tx: ShardTransaction) => {
        const functionName = tx.getDataFunctionName();
        switch (functionName) {
            case 'createCampaign': {
                this.logger.log('[Tips] Campaign created. Clearing list cache');
                await this.cachingService.deleteInCache(`tips:all`);
                break;
            }
            case 'updateCampaign':
            case 'endCampaign':
            case 'claimCampaign': {
                const args = tx.getDataArgs() ?? [];
                const id = parseInt(args[0]);
                this.logger.log(`[Tips] Action on campaign ${id}. Clearing campaign cache`);
                await this.cachingService.deleteInCache(`tips:${id}`);
                break;
            }
        }
    }

    processTradeTransaction = async (tx: ShardTransaction) => {
        const functionName = tx.getDataFunctionName();
        switch (functionName) {
            case 'createTrade': {
                this.logger.log('[Tips] Trade created. Clearing trade cache for sender');
                await this.cachingService.deleteInCache(`tips:${tx.sender}`);
                break;
            }
            case 'cancelTrade':
            case 'trade': {
                const args = tx.getDataArgs() ?? [];
                const id = parseInt(args[0]);
                this.logger.log(`[Tips] Action on campaign ${id}. Clearing trade cache for sender`);
                await this.cachingService.deleteInCache(`tips:${tx.sender}`);
                break;
            }
        }
    }
}
