import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import configuration from '../config/configuration';
import { TipsModule } from './endpoints/tips/tips.module';
import { TokensModule } from './endpoints/tokens/tokens.module';
import { TradeModule } from './endpoints/trade/trade.module';
import { AccountsModule } from './endpoints/accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TipsModule,
    TokensModule,
    TradeModule,
    AccountsModule,
  ],
})
export class PublicAppModule {}
