import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { Account } from "src/types/Account";
import { AccountsService } from "./accounts.service";

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {
	constructor(private readonly _accounts: AccountsService) { }

    @Get("/herotag/:tag")
	@ApiResponse({
		status: 200,
		description: 'Return account data targeted by herotag ',
	})
	async getAccountFromHerotag(
		@Param('tag') herotag: string,
	): Promise<Account | null> {
		const account = await this._accounts.getFromHerotag(herotag);
        if (!account) throw new NotFoundException();
        return account;
	}

	@Get("/clear-cache")
	@ApiResponse({
		status: 200,
		description: 'Clear acccounts cache',
	})
	async clearCache(): Promise<void> {
		return await this._accounts.clearCache();
	}
}
