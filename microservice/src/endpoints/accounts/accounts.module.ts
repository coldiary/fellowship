import { Module } from '@nestjs/common';

import { SharedModule } from 'src/common/shared.module';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
    imports: [SharedModule],
    controllers: [AccountsController],
    providers: [AccountsService],
})
export class AccountsModule {}
