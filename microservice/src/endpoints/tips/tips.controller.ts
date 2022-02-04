import { Controller, Get, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { ContractInfo } from "src/types/Contract";
import { Campaign } from "src/types/Tips";
import { TipsService } from "./tips.service";

@Controller('tips')
@ApiTags('tips')
export class TipsController {
	constructor(private readonly _tips: TipsService) { }

	@Get("/contract")
	@ApiResponse({
		status: 200,
		description: 'Returns contract info',
	})
	async getContractInfo(): Promise<ContractInfo> {
		return await this._tips.getContractInfo();
	}

	@Get("/all")
	@ApiResponse({
		status: 200,
		description: 'Returns all campaigns',
	})
	async getAllCampaigns(): Promise<Campaign[]> {
		return await this._tips.getAllCampaigns();
	}

	@Get("/campaign/:id")
	@ApiResponse({
		status: 200,
		description: 'Return a campaign targeted by id ',
	})
	async getCampaign(
		@Param('id') id: string,
	): Promise<Campaign> {
		return await this._tips.getCampaign(+id);
	}

	@Get("/clear-cache")
	@ApiResponse({
		status: 200,
		description: 'Clear tips cache',
	})
	async clearCache(): Promise<void> {
		return await this._tips.clearCache();
	}
}
