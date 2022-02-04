import { Controller, Get, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { ContractInfo } from "src/types/Contract";
import { Trade } from "src/types/Trades";
import { TradeService } from "./trade.service";

@Controller('trade')
@ApiTags('trade')
export class TradeController {
	constructor(private readonly _trade: TradeService) { }

	@Get("/contract")
	@ApiResponse({
		status: 200,
		description: 'Returns contract info',
	})
	async getContractInfo(): Promise<ContractInfo> {
		return await this._trade.getContractInfo();
	}

	@Get("/address/:address")
	@ApiResponse({
		status: 200,
		description: 'Returns trades for specified address',
	})
	async getTradesForAdress(
		@Param('address') address: string,
	): Promise<Trade[]> {
		return await this._trade.getTradesForAddress(address);
	}

	@Get("/:id")
	@ApiResponse({
		status: 200,
		description: 'Return a campaign targeted by id ',
	})
	async getTrade(
		@Param('id') id: string,
	): Promise<Trade> {
		return await this._trade.getTrade(+id);
	}

	@Get("/clear-cache")
	@ApiResponse({
		status: 200,
		description: 'Clear trade cache',
	})
	async clearCache(): Promise<void> {
		return await this._trade.clearCache();
	}
}
