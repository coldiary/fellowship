import { Controller, Get, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { TipsCampaignData } from "src/types/Tips";
import { TipsService } from "./tips.service";

@Controller('tips')
@ApiTags('tips')
export class TipsController {
	constructor(private readonly _tips: TipsService) { }

	@Get("/all")
	@ApiResponse({
		status: 200,
		description: 'Returns all campaigns',
	})
	async getAllCampaigns(): Promise<TipsCampaignData[]> {
		return await this._tips.getAllCampaigns();
	}

	@Get("/campaign/:id")
	@ApiResponse({
		status: 200,
		description: 'Return a campaign targeted by id ',
	})
	async getCampaign(
		@Param('id') id: string,
	): Promise<TipsCampaignData> {
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
