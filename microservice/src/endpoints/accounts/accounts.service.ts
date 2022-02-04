import { Injectable } from "@nestjs/common";

import { ApiConfigService } from "src/services/api.config.service";
import { CachingService } from "src/services/caching.service";
import { Constants } from "src/common/utils/constants";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Account } from "src/types/Account";

@Injectable()
export class AccountsService {
    constructor(
        private readonly httpService: HttpService,
        private readonly cachingService: CachingService,
        private readonly apiConfigService: ApiConfigService,
    ) {
    }

    async getFromHerotag(herotag: string): Promise<Account | null> {
        return await this.cachingService.getOrSetCache(
            `accounts:${herotag}`,
            async () => await this.queryHerotag(herotag),
            Constants.oneMinute() * 10,
        );
    }

    async clearCache() {
        await this.cachingService.deleteInCache(`accounts:*`);
    }

    private async queryHerotag(herotag: string): Promise<Account | null> {
        try {
            const res = await firstValueFrom(this.httpService.get(`${this.apiConfigService.getApiUrl()}/usernames/${herotag}`));
            return res.data;
        } catch (err) {
            return null;
        }
    }
}
