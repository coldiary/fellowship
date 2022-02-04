export interface Account {
    address: string;
    balance: string;
    nonce: string;
    shard: number;
    scamInfo: any;
    code: string;
    codeHash: string;
    rootHash: string;
    txCount: number;
    scrCount: number;
    username: string;
    developerReward: string;
    ownerAddress: string;
    deployedAt: number;
    isUpgradeable: boolean;
    isReadable: boolean;
    isPayable: boolean;
    isPayableBySmartContract: boolean;
}
