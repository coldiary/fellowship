import { Injectable } from "@nestjs/common";
import { AbiRegistry, Address, ArgSerializer, ContractFunction, ProxyProvider, SmartContract, SmartContractAbi, U64Value } from '@elrondnetwork/erdjs';
import { HttpService } from "@nestjs/axios";
import BigNumber from "bignumber.js";

import { ApiConfigService } from "src/services/api.config.service";
import { CachingService } from "src/services/caching.service";
import { Constants } from "src/common/utils/constants";
import { Campaign } from "src/types/Tips";
import { ContractInfo } from "src/types/Contract";
import { firstValueFrom } from "rxjs";

@Injectable()
export class TipsService {
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
        this.contractAddress = new Address(this.apiConfigService.getTipsContract());
        this.loadTipsAbi().catch(console.error);
    }

    private async loadTipsAbi() {
        this.registry = (await AbiRegistry.load({ files: ['src/abi/tips.abi.json'] }));
        this.abi = new SmartContractAbi(this.registry, ["Tips"]);
    }

    async getContractInfo(): Promise<ContractInfo> {
        return await this.cachingService.getOrSetCache(
            `tips:contract`,
            async () => await this.queryContractInfo(),
            Constants.oneMinute() * 10,
        );
    }

    async getAllCampaigns(): Promise<Campaign[]> {
        return await this.cachingService.getOrSetCache(
            `tips:all`,
            async () => await this.queryAllCampaigns(),
            Constants.oneMinute() * 10,
        );
    }

    async getCampaign(id: number): Promise<Campaign> {
        return await this.cachingService.getOrSetCache(
            `tips:${id}`,
            async () => await this.queryCampaign(id),
            Constants.oneMinute() * 10,
        );
    }

    async clearCache() {
        await this.cachingService.deleteInCache(`tips:*`);
    }

    private async queryAllCampaigns(): Promise<Campaign[]> {
        if (!this.abi || !this.registry) throw new Error('Tips ABI not loaded');

        const contract = new SmartContract({ address: this.contractAddress, abi: this.abi });

        const result = await contract.runQuery(this.proxyProvider, {
            func: new ContractFunction('getAllCampaigns'),
            args: [],
        });


        let returnData: string[] = result.returnData;

        const definitions = this.registry.getInterface('Tips').getEndpoint('getAllCampaigns').output;
        const values = this.serializer.buffersToValues(returnData.map(data => Buffer.from(data, 'base64')), definitions);
        const items: any[] = values[0].valueOf();

        const campaigns = items.reduce((acc, item) => [...acc, this.formatCampaignData(item.field1, item.field0)], []);

        return campaigns;
    }

    private async queryCampaign(id: number): Promise<Campaign> {
        if (!this.abi || !this.registry) throw new Error('Tips ABI not loaded');

        const contract = new SmartContract({ address: this.contractAddress, abi: this.abi });

        const result = await contract.runQuery(this.proxyProvider, {
            func: new ContractFunction('campaigns'),
            args: [
                new U64Value(new BigNumber(id))
            ],
        });

        let returnData: string[] = result.returnData;

        const definitions = this.registry.getInterface('Tips').getEndpoint('campaigns').output;
        const values = this.serializer.buffersToValues(returnData.map(d => Buffer.from(d, 'base64')), definitions);
        const data: any[] = values[0].valueOf();

        return this.formatCampaignData(data, new BigNumber(id));
    }

    private async queryContractInfo(): Promise<ContractInfo> {
        const url = `${this.apiConfigService.getApiUrl()}/accounts/${this.apiConfigService.getTipsContract()}`;
        const res = await firstValueFrom(this.httpService.get(url));
        return res.data;
    }

    private formatCampaignData(serialized: any, id: BigNumber): Campaign {
        return {
            id: id.toNumber(),
            creator_address: (serialized.creator_address as Address).toString(),
            token_identifier: serialized.token_identifier.toString(),
            metadata_cid: (serialized.metadata_cid as Buffer).swap16().toString('ucs2'),
            amount: (serialized.amount as BigNumber).toString(),
            claimable: (serialized.claimable as BigNumber).toString(),
            status: serialized.status.name,
        }
    }
}
