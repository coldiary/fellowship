import { Module } from '@nestjs/common';
import { SharedModule } from 'src/common/shared.module';

import { TipsController } from './tips.controller';
import { TipsService } from './tips.service';

@Module({
    imports: [SharedModule],
    controllers: [TipsController,],
    providers: [TipsService,],
})
export class TipsModule {}
