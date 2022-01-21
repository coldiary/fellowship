export interface Token {
    balance: string;
    burnt: string;
    canBurn: boolean;
    canChangeOwner: boolean;
    canFreeze: boolean;
    canMint: boolean;
    canPause: boolean;
    canUpgrade: boolean;
    canWipe: boolean;
    decimals: number
    identifier: string;
    isPaused: boolean;
    minted: string;
    name: string;
    owner: string;
    ticker: string;
}
