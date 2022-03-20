import { Injectable } from "@nestjs/common";
import { AbiRegistry, Address, AddressValue, ArgSerializer, ContractFunction, ProxyProvider, SmartContract, SmartContractAbi, U64Value } from '@elrondnetwork/erdjs';
import { HttpService } from "@nestjs/axios";
import BigNumber from "bignumber.js";

import { ApiConfigService } from "src/services/api.config.service";
import { CachingService } from "src/services/caching.service";
import { Constants } from "src/common/utils/constants";
import { ContractInfo } from "src/types/Contract";
import { firstValueFrom } from "rxjs";
import { Trade } from "src/types/Trades";

@Injectable()
export class TradeService {
    serializer: ArgSerializer;
    contractAddress: Address;
    proxyProvider: ProxyProvider
    registry?: AbiRegistry;
    abi?: SmartContractAbi;

    constructor(
        private readonly httpService: HttpService,
        private readonly cachingService: CachingService,
        private readonly apiConfigService: ApiConfigService,
    ) {
        this.serializer = new ArgSerializer();
        this.proxyProvider = new ProxyProvider(this.apiConfigService.getApiUrl());
        this.contractAddress = new Address(this.apiConfigService.getTradeContract());
        this.loadTipsAbi().catch(console.error);
    }

    private async loadTipsAbi() {
        this.registry = (await AbiRegistry.load({ files: ['src/abi/trade.abi.json'] }));
        this.abi = new SmartContractAbi(this.registry, ["Trade"]);
    }

    async getContractInfo(): Promise<ContractInfo> {
        return await this.cachingService.getOrSetCache(
            `trade:contract`,
            async () => await this.queryContractInfo(),
            Constants.oneMinute() * 10,
        );
    }

    async getTradesForAddress(address: string): Promise<Trade[]> {
        return await this.cachingService.getOrSetCache(
            `trade:${address}`,
            async () => await this.queryTradesFor(address),
            Constants.oneMinute() * 10,
        );
    }

    async getTrade(id: number): Promise<Trade | null> {
        return await this.cachingService.getOrSetCache(
            `trade:${id}`,
            async () => await this.queryTrade(id),
            Constants.oneMinute() * 10,
        );
    }

    async clearCache() {
        await this.cachingService.deleteInCache(`trade:*`);
    }

    private async queryTradesFor(address: string): Promise<Trade[]> {
        if (!this.abi || !this.registry) throw new Error('Trade ABI not loaded');

        const contract = new SmartContract({ address: this.contractAddress, abi: this.abi });

        const result = await contract.runQuery(this.proxyProvider, {
            func: new ContractFunction('getTradesFor'),
            args: [
                new AddressValue(new Address(address))
            ],
        });


        let returnData: string[] = result.returnData;

        const definitions = this.registry.getInterface('Trade').getEndpoint('getTradesFor').output;
        const values = this.serializer.buffersToValues(returnData.map(data => Buffer.from(data, 'base64')), definitions);
        const items: any[] = values[0].valueOf();

        const trades = items.reduce((acc, item) => [...acc, this.formatTrade(item.field1, item.field0)], []);

        return trades;
    }

    private async queryTrade(id: number): Promise<Trade | null> {
        if (!this.abi || !this.registry) throw new Error('Tips ABI not loaded');

        const contract = new SmartContract({ address: this.contractAddress, abi: this.abi });

        const result = await contract.runQuery(this.proxyProvider, {
            func: new ContractFunction('trades'),
            args: [
                new U64Value(new BigNumber(id))
            ],
        });

        let returnData: string[] = result.returnData;

        if (!returnData.length) return null;

        const definitions = this.registry.getInterface('Trade').getEndpoint('trades').output;
        const values = this.serializer.buffersToValues(returnData.map(d => Buffer.from(d, 'base64')), definitions);
        const data: any[] = values[0].valueOf();

        return this.formatTrade(data, new BigNumber(id));
    }

    private async queryContractInfo(): Promise<ContractInfo> {
        const url = `${this.apiConfigService.getApiUrl()}/accounts/${this.apiConfigService.getTipsContract()}`;
        const res = await firstValueFrom(this.httpService.get(url));
        return res.data;
    }

    private formatTrade(serialized: any, id: BigNumber): Trade {
        return {
            id: id.toNumber(),
            offer_address: (serialized.offer_address as Address).toString(),
            offer_asset_token: (serialized.offer_asset_token as Buffer).toString(),
            offer_asset_quantity: (serialized.offer_asset_quantity as BigNumber).toString(),
            trader_address: serialized.trader_address !== null ? (serialized.trader_address as Address).toString() : undefined,
            trader_asset_token: (serialized.trader_asset_token as Buffer).toString(),
            trader_asset_quantity: (serialized.trader_asset_quantity as BigNumber).toString(),
        }
    }
}
