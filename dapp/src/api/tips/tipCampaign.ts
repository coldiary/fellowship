import { refreshAccount, transactionServices } from '@elrondnetwork/dapp-core';
import { contractAdresses } from 'config';
import { encodeToHex } from 'utils/hex';

export const tipCampaign = async (id: number, amount: number) => {
    const { sendTransactions } = transactionServices;

    await refreshAccount();

    const { sessionId, error } = await sendTransactions({ transactions: [{
        value: amount,
        data: `tip@${encodeToHex(id)}`,
        receiver: contractAdresses.tips,
    }] });

    if (error) {
        console.error(error);
    }

    return sessionId;
};
