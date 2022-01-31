export interface ContractInfo {
    address: string;
    balance: string;
    code: string;
    codeHash: string;
    deployedAt: number;
    developerReward: string;
    isPayable: boolean;
    isPayableBySmartContract: boolean;
    isReadable: boolean;
    isUpgradeable: boolean;
    nonce: number;
    ownerAddress: string;
    rootHash: string;
    scrCount: number;
    shard: number;
    txCount: number;
}
