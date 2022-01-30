export interface Token {
    identifier: string;
    name: string;
    ticker: string;
    owner: string;
    minted: string;
    burnt: string;
    decimals: number;
    isPaused: false;
    assets: {
      website: string;
      description: string;
      social: {
        email: string;
        blog: string;
        twitter: string;
        whitepaper: string;
        coinmarketcap: string;
        coingecko: string;
      }
      status: string;
      pngUrl: string;
      svgUrl: string;
    };
    transactions: number;
    accounts: number;
    canUpgrade: boolean;
    canMint: boolean;
    canBurn: boolean;
    canChangeOwner: boolean;
    canPause: boolean;
    canFreeze: boolean;
    canWipe: boolean;
}
