interface TransactionTransfer {
    decimals: number;
    name: string;
    ticker: string;
    token: string;
    type: string;
    value: string;
}

interface TransactionAction {
    arguments: {
        transfers: TransactionTransfer[];
        receiver: string;
    },
    category: string;
    description: string;
    name: string;
}

export interface Transaction {
    action: TransactionAction;
    data: string;
    fee: string;
    gasLimit: number;
    gasPrice: number;
    gasUsed: number;
    miniBlockHash: string;
    nonce: number;
    receiver: string;
    receiverShard: 2
    round: number;
    sender: string;
    senderShard: 2
    signature: string;
    status: string;
    timestamp: number;
    tokenIdentifier: string;
    tokenValue: string;
    txHash: string;
    value: string;
}
