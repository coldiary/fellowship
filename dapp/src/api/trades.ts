import { AddressType } from '@elrondnetwork/erdjs';

import { apiAddress, contracts } from 'config';
import { Trade } from 'types/Trades';
import { Contract } from 'utils/contract';

export class Trades extends Contract {
    static instance = new Trades(apiAddress, contracts.trade.address, contracts.trade.name, contracts.trade.abiPath);

    async getTrade(id: number): Promise<Trade | undefined> {
        return await this.query('trades', [Trades.encodeU64Value(id)], async (data) => {
            return Trades.decodeTrade(data[0].valueOf());
        }).catch(() => undefined);
    }

    async getTradesFor(address: string): Promise<Trade[]> {
        return await this.query('getTrades', [Trades.encodeAddress(address)], async (data) => {
            const list = data[0].valueOf();
            return list.map(Trades.decodeTrade);
        }).catch(() => []);
    }

    async createTrade(
        offer_amount: number,
        offer_token_identifier: string,
        requested_amount: number,
        requested_token_identifier: string,
        reserved_for?: string
    ) {
        if (offer_token_identifier === 'EGLD') {
            return await this.call('createTrade', `${offer_amount}`, [
                Trades.encodeBigUInt(requested_amount),
                Trades.encodeTokenIdentifier(requested_token_identifier),
                Trades.wrapOptional(new AddressType(), reserved_for ? Trades.encodeAddress(reserved_for) : null),
            ], 'Create trade');
        } else {
            return await this.call('ESDTTransfer', '0', [
                Trades.encodeTokenIdentifier(offer_token_identifier),
                Trades.encodeBigUInt(offer_amount),
                Trades.encodeString('createTrade'),
                Trades.encodeBigUInt(requested_amount),
                Trades.encodeTokenIdentifier(requested_token_identifier),
                Trades.wrapOptional(new AddressType(), reserved_for ? Trades.encodeAddress(reserved_for) : null),
            ], 'Create trade');
        }
    };

    async cancelTrade(id: number) {
        return await this.call('cancelTrade', '0', [Trades.encodeU64Value(id)], 'Cancel trade');
    };

    async trade(id: number, amount: number, token_identifier: string) {
        if (token_identifier === 'EGLD') {
            return await this.call('trade', `${amount}`, [Trades.encodeU64Value(id)], 'Trade');
        } else {
            return await this.call('ESDTTransfer', '0', [
                Trades.encodeTokenIdentifier(token_identifier),
                Trades.encodeBigUInt(amount),
                Trades.encodeString('trade'),
                Trades.encodeU64Value(id),
            ], 'Trade');
        }
    };

    static decodeTrade = (t: any): Trade => ({
        id: t.id.toNumber(),
        offer_address: Trades.decodeAddress(t.offer_address),
        offer_asset_token: Trades.decodeString(t.offer_asset_token),
        offer_asset_quantity: Trades.decodeBigNumber(t.offer_asset_quantity),
        trader_address: t.trader_address !== null ? Trades.decodeAddress(t.trader_address) : undefined,
        trader_asset_token: Trades.decodeString(t.trader_asset_token),
        trader_asset_quantity: Trades.decodeBigNumber(t.trader_asset_quantity),
    });
}
