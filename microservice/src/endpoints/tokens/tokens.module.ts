import { Module } from '@nestjs/common';
import { SharedModule } from 'src/common/shared.module';

import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

@Module({
    imports: [SharedModule],
    controllers: [TokensController],
    providers: [TokensService],
})
export class TokensModule {}
