import { refreshAccount, transactionServices } from '@elrondnetwork/dapp-core';
import { contractAdresses } from 'config';

export const createCampaign = async (metadata_uri: string, token_identifier: string) => {
    const { sendTransactions } = transactionServices;

    const payload = 'createCampaign' +
    '@' + btoa(metadata_uri) +
    '@' + btoa(token_identifier);

    console.log(payload);

    const transaction = {
        value: 0,
        data: payload,
        receiver: contractAdresses.tips,
    };

    await refreshAccount();

    const { sessionId, error } = await sendTransactions({ transactions: transaction });

    if (error) {
        console.error(error);
    }

    return sessionId;
};
