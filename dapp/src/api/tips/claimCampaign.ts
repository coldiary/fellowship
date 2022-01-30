import { refreshAccount, transactionServices } from '@elrondnetwork/dapp-core';
import { contractAdresses } from 'config';
import { encodeToHex } from 'utils/hex';

export const updateCampaign = async (id: number) => {
    const { sendTransactions } = transactionServices;

    await refreshAccount();

    const { sessionId, error } = await sendTransactions({ transactions: [{
        data: `claimCampaign@${encodeToHex(id)}`,
        receiver: contractAdresses.tips,
    }] });

    if (error) {
        console.error(error);
    }

    return sessionId;
};
