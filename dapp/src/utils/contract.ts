import { refreshAccount, transactionServices } from '@elrondnetwork/dapp-core';
import { SimpleTransactionType } from '@elrondnetwork/dapp-core';
import { ArgSerializer, TokenIdentifierValue } from '@elrondnetwork/erdjs';

import { encodeToHex } from './hex';

const { sendTransactions } = transactionServices;

export type ContractArgument = {
    value: any;
    targetType:
        | 'ManagedBuffer'
        | 'TokenIdentifier'
        | 'Number'
    ;
    isOptional?: boolean;
}

const formatArg = (arg: ContractArgument) => {
    switch (arg.targetType) {
        case 'ManagedBuffer':
        case 'Number':
            return encodeToHex(arg.value);
        case 'TokenIdentifier': return (new ArgSerializer()).valuesToString([new TokenIdentifierValue(Buffer.from(arg.value))]);
        default: throw new Error('Unmapped type');
    }
};

export const formatPayload = (functionName: string, args: (ContractArgument | undefined)[]) => {
    return [
        functionName,
        ...args.filter((_): _ is ContractArgument  => _ !== undefined).map(formatArg)
    ].join('@');
};

export const sendTransaction = async (txs: SimpleTransactionType[]): Promise<string | null> => {
    await refreshAccount();

    const { sessionId, error } = await sendTransactions({ transactions: txs });

    if (error) {
        console.error(error);
    }

    return sessionId;
};
