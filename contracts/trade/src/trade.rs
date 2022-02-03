#![no_std]

elrond_wasm::imports!();

mod types;

use types::TradeData;

#[elrond_wasm::contract]
pub trait Trade {
    #[storage_mapper("nextId")]
    fn next_id(&self) -> SingleValueMapper<u64>;

    #[view]
    #[storage_mapper("trades")]
    fn trades(&self, id: &u64) -> SingleValueMapper<TradeData<Self::Api>>;

    #[init]
    fn init(&self) -> SCResult<()> {
        self.next_id().set_if_empty(&1);
        Ok(())
    }

    #[view(getTradesFor)]
    fn get_trades_for(
        &self,
        address: ManagedAddress,
    ) -> Vec<(u64, TradeData<Self::Api>)> {
        let mut all = Vec::new();
        let count = self.next_id().get();

        for n in 1..count {
            if !self.trades(&n).is_empty() {
                let trade = self.trades(&n).get();
                if (trade.offer_address == address) {
                    all.push((n, trade));
                } else if (!trade.trader_address.is_none()) {
                    let trader_address = trade.trader_address.as_ref().unwrap();
                    if (*trader_address == address) {
                        all.push((n, trade));
                    }
                }
            }
        }

        all
    }

    #[payable("*")]
    #[endpoint(createTrade)]
    fn create_trade(
        &self,
        #[payment] offer_quantity: BigUint,
        #[payment_token] offer_token: TokenIdentifier,
        requested_quantity: BigUint,
        requested_token: TokenIdentifier,
        reserved_for: Option<ManagedAddress>,
    ) -> SCResult<u64> {
        require!(offer_quantity > 0, "Offer asset quantity must be more than 0");
        require!(offer_token.is_egld() || offer_token.is_valid_esdt_identifier(), "Invalid token provided as offer");
        require!(requested_quantity > 0, "Requested asset quantity must be more than 0");
        require!(requested_token.is_egld() || requested_token.is_valid_esdt_identifier(), "Invalid token provided for requested asset");

        let trade = TradeData {
            offer_address: self.blockchain().get_caller(),
            offer_asset_token: offer_token,
            offer_asset_quantity: offer_quantity,
            trader_address: reserved_for,
            trader_asset_token: requested_token,
            trader_asset_quantity: requested_quantity,
        };

        let trade_id = self.next_id().get();
        self.next_id().set(&(trade_id + 1));
        self.trades(&trade_id).set(&trade);

        Ok(trade_id)
    }

    #[endpoint(cancelTrade)]
    fn cancel_trade(
        &self,
        trade_id: u64,
    ) -> SCResult<()> {
        let caller = self.blockchain().get_caller();

        require!(!self.trades(&trade_id).is_empty(), "This trade does not exist");

        let trade = self.trades(&trade_id).get();
        require!(caller == trade.offer_address, "Only the creator of the trade can cancel it");

        let token_identifier = trade.offer_asset_token;
        let token_amount = trade.offer_asset_quantity;
        self.send().direct(&caller, &token_identifier, 0, &token_amount, &[]);

        self.trades(&trade_id).clear();

        Ok(())
    }

    #[payable("*")]
    #[endpoint(trade)]
    fn trade(
        &self,
        trade_id: u64,
        #[payment] paid_quantity: BigUint,
        #[payment_token] paid_token: TokenIdentifier,
    ) -> SCResult<()> {
        let caller = self.blockchain().get_caller();

        require!(!self.trades(&trade_id).is_empty(), "This trade does not exist");

        let trade = self.trades(&trade_id).get();

        if trade.trader_address.is_some() {
            let trader_address = trade.trader_address.unwrap();
            require!(trader_address == caller, "This trade has been reserved");
        }

        require!(trade.trader_asset_token == paid_token, "Invalid token provided as payment");
        require!(trade.trader_asset_quantity == paid_quantity, "Invalid amount provided as payment");

        let offer_address = trade.offer_address;
        let offer_token = trade.trader_asset_token;
        let offer_amount = trade.trader_asset_quantity;

        self.send().direct(&offer_address, &offer_token, 0, &offer_amount, &[]);

        let trader_token = trade.offer_asset_token;
        let trader_amount = trade.offer_asset_quantity;

        self.send().direct(&caller, &trader_token, 0, &trader_amount, &[]);

        self.trades(&trade_id).clear();

        Ok(())
    }
}
