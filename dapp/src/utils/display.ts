export const getShortHash = (hash: string) => `${hash.slice(0, 5)}...${hash.slice(-5)}`;
export const getTokenShortName = (ticker: string) => ticker.slice(0, ticker.indexOf('-'));
