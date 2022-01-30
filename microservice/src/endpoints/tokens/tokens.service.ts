import { Injectable } from "@nestjs/common";

import { ApiConfigService } from "src/common/api.config.service";
import { CachingService } from "src/common/caching.service";
import { Constants } from "src/common/utils/constants";
import { Token } from "src/types/Token";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class TokensService {
    constructor(
        private readonly httpService: HttpService,
        private readonly cachingService: CachingService,
        private readonly apiConfigService: ApiConfigService,
    ) {
    }

    async getAllTokens(): Promise<Token[]> {
        return await this.cachingService.getOrSetCache(
            `tokens:all`,
            async () => await this.queryAllTokens(),
            Constants.oneMinute() * 10,
        );
    }

    async getToken(id: string): Promise<Token> {
        return await this.cachingService.getOrSetCache(
            `tokens:${id}`,
            async () => await this.queryToken(id),
            Constants.oneMinute() * 10,
        );
    }

    async clearCache() {
        await this.cachingService.deleteInCache(`tokens:all`);
    }

    private async queryAllTokens(): Promise<Token[]> {
        const res = await firstValueFrom(this.httpService.get(`${this.apiConfigService.getApiUrl()}/tokens?size=10000`));
        return res.data;
    }

    private async queryToken(id: string): Promise<Token> {
        const res = await firstValueFrom(this.httpService.get(`${this.apiConfigService.getApiUrl()}/tokens/${id}`));
        return res.data;
    }
}
