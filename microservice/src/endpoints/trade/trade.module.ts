import { Module } from '@nestjs/common';

import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { SharedModule } from 'src/common/shared.module';

@Module({
    imports: [SharedModule],
    controllers: [TradeController],
    providers: [TradeService],
})
export class TradeModule {}
