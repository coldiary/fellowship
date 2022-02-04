import { Controller, Get, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { TokenDefinition } from "src/types/Token";
import { TokensService } from "./tokens.service";

@Controller('tokens')
@ApiTags('tokens')
export class TokensController {
	constructor(private readonly _tokens: TokensService) { }

	@Get("/")
	@ApiResponse({
		status: 200,
		description: 'Returns all tokens',
	})
	async getAllTokens(): Promise<TokenDefinition[]> {
		return await this._tokens.getAllTokens();
	}

	@Get("/clear-cache")
	@ApiResponse({
		status: 200,
		description: 'Clear tips cache',
	})
	async clearCache(): Promise<void> {
		return await this._tokens.clearCache();
	}

	@Get("/:id")
	@ApiResponse({
		status: 200,
		description: 'Return a token targeted by identifier ',
	})
	async getCampaign(
		@Param('id') id: string,
	): Promise<TokenDefinition> {
		return await this._tokens.getToken(id);
	}
}
