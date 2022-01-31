import { refreshAccount, transactionServices } from '@elrondnetwork/dapp-core';
import { ArgSerializer, TokenIdentifierValue } from '@elrondnetwork/dapp-core/node_modules/@elrondnetwork/erdjs';
import { contractAdresses } from 'config';
import { encodeToHex } from 'utils/hex';

export const createCampaign = async (metadata_cid: string, token_identifier: string) => {
    const { sendTransactions } = transactionServices;

    const payload = 'createCampaign' +
        '@' + encodeToHex(metadata_cid) +
        '@' + (new ArgSerializer()).valuesToString([new TokenIdentifierValue(Buffer.from(token_identifier))]);

    console.log(payload);

    const transaction = {
        data: payload,
        receiver: contractAdresses.tips,
    };

    await refreshAccount();

    const { sessionId, error } = await sendTransactions({ transactions: [transaction] });

    if (error) {
        console.error(error);
    }

    return sessionId;
};
