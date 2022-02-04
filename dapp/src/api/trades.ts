import { ContractFunction, TransactionPayload, StringValue, BigUIntValue, TokenIdentifierValue, OptionalValue, Address, AddressValue, AddressType } from '@elrondnetwork/dapp-core/node_modules/@elrondnetwork/erdjs';
import { BigNumber } from '@elrondnetwork/dapp-core/node_modules/@elrondnetwork/erdjs/node_modules/bignumber.js';
import { contractAdresses, proxyAddress } from 'config';
import { Trade } from 'types/Trades';
import { formatPayload, sendTransaction } from 'utils/contract';

export const getTrade = async (id: number): Promise<Trade> => {
    const res = await fetch(`${proxyAddress}/trades/${id}`);
    const data = await res.json() as Trade;
    return data;
};

export const getTradesFor = async (address: string): Promise<Trade[]> => {
    const res = await fetch(`${proxyAddress}/trade/address/${address}`);
    const data = await res.json() as Trade[];
    return data;
};

export const createTrade = async (
    offer_amount: number,
    offer_token_identifier: string,
    requested_amount: number,
    requested_token_identifier: string,
    reserved_for?: string
) => {
    if (offer_token_identifier === 'EGLD') {
        const payload = TransactionPayload.contractCall()
            .setFunction(new ContractFunction('createTrade'))
            .addArg(new BigUIntValue(new BigNumber(requested_amount)))
            .addArg(new TokenIdentifierValue(Buffer.from(requested_token_identifier, 'utf-8')))
            .addArg(new OptionalValue(new AddressType(), reserved_for ? new AddressValue(new Address(reserved_for)) : null))
            .build()
            .valueOf()
            .toString();
        return await sendTransaction([{
            value: `${offer_amount}`,
            data: payload,
            receiver: contractAdresses.trade,
        }]);
    } else {
        const payload = TransactionPayload.contractCall()
            .setFunction(new ContractFunction('ESDTTransfer'))
            .addArg(new TokenIdentifierValue(Buffer.from(offer_token_identifier, 'utf-8')))
            .addArg(new BigUIntValue(new BigNumber(offer_amount)))
            .addArg(new StringValue('createTrade'))
            .addArg(new BigUIntValue(new BigNumber(requested_amount)))
            .addArg(new TokenIdentifierValue(Buffer.from(requested_token_identifier, 'utf-8')))
            .addArg(new OptionalValue(new AddressType(), reserved_for ? new AddressValue(new Address(reserved_for)) : null))
            .build()
            .valueOf()
            .toString();
        return await sendTransaction([{
            value: '0',
            data: payload,
            receiver: contractAdresses.trade,
        }]);
    }
};

// export const createTrade = async (
//     offer_amount: number,
//     offer_token_identifier: string,
//     requested_amount: number,
//     requested_token_identifier: string,
//     reserved_for?: string
// ) => {
//     if (offer_token_identifier === 'EGLD') {
//         return await sendTransaction([{
//             value: `${offer_amount}`,
//             data: formatPayload('createTrade', [
//                 { value: requested_amount, targetType: 'Number' },
//                 { value: requested_token_identifier, targetType: 'TokenIdentifier' },
//                 (reserved_for ? { value: reserved_for, targetType: 'ManagedBuffer' } : undefined),
//             ]),
//             receiver: contractAdresses.trade,
//         }]);
//     } else {
//         return await sendTransaction([{
//             value: '0',
//             data: formatPayload('ESDTTransfer', [
//                 { value: offer_token_identifier, targetType: 'TokenIdentifier' },
//                 { value: offer_amount, targetType: 'Number' },
//                 { value: 'createTrade', targetType: 'ManagedBuffer' },
//                 { value: requested_amount, targetType: 'Number' },
//                 { value: requested_token_identifier, targetType: 'TokenIdentifier' },
//                 (reserved_for ? { value: reserved_for, targetType: 'ManagedBuffer' } : undefined),
//             ]),
//             receiver: contractAdresses.trade,
//         }]);
//     }
// };

export const cancelTrade = async (id: number) => {
    return await sendTransaction([{
        value: '0',
        data: formatPayload('cancelTrade', [
            { value: id, targetType: 'Number' },
        ]),
        receiver: contractAdresses.trade,
    }]);
};

export const trade = async (id: number, amount: number, token_identifier: string) => {
    if (token_identifier === 'EGLD') {
        return await sendTransaction([{
            value: `${amount}`,
            data: formatPayload('trade', [
                { value: id, targetType: 'Number' },
            ]),
            receiver: contractAdresses.trade,
        }]);
    } else {
        return await sendTransaction([{
            value: '0',
            data: formatPayload('ESDTTransfer', [
                { value: token_identifier, targetType: 'TokenIdentifier' },
                { value: amount, targetType: 'Number' },
                { value: 'trade', targetType: 'ManagedBuffer' },
                { value: id, targetType: 'Number' },
            ]),
            receiver: contractAdresses.trade,
        }]);
    }
};
