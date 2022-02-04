export interface Trade {
    id: number;
    offer_address: string;
    offer_asset_token: string;
    offer_asset_quantity: string;
    trader_address?: string;
    trader_asset_token: string;
    trader_asset_quantity: string;
}
