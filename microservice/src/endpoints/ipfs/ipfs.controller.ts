import { HttpService } from "@nestjs/axios";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";

import { ApiConfigService } from "src/services/api.config.service";
import { CachingService } from "src/services/caching.service";
import { Constants } from "src/common/utils/constants";

@Controller('ipfs')
@ApiTags('ipfs')
export class IPFSController {
	constructor(
        private readonly caching: CachingService,
        private readonly http: HttpService,
        private readonly config: ApiConfigService,
    ) { }

	@Get("/:cid")
	@ApiResponse({
		status: 200,
		description: 'Get a cached version of an IPFS content',
	})
	async getIPFSContent(
        @Param('cid') cid: string,
    ): Promise<any> {
		return await this.caching.getOrSetCache(
            `ipfs:${cid}`,
            async () => await this.fetchContent(cid),
            Constants.oneMinute() * 10,
        );
	}

    private async fetchContent(cid: string) {
        const res = await firstValueFrom(this.http.get(`${this.config.getIPFSUrl()}/${cid}`));
        return res.data;
    }
}
