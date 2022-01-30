import { refreshAccount, transactionServices } from '@elrondnetwork/dapp-core';
import { contractAdresses } from 'config';
import { encodeToHex } from 'utils/hex';

export const updateCampaign = async (id: number, metadata_uri: string) => {
    const { sendTransactions } = transactionServices;

    // const payload = TransactionPayload.contractCall()
    //     .setFunction(new ContractFunction('updateCampaign'))
    //     .addArg(new U64Value(new BigNumber(id)))
    //     .addArg(StringValue.fromUTF8(metadata_uri))
    //     .build();

    const payload = 'updateCampaign' +
        '@' + encodeToHex(id) +
        '@' + encodeToHex(metadata_uri)
    ;

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
