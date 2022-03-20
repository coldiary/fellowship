use elrond_wasm::{
    api::ManagedTypeApi,
    types::{BigUint, ManagedAddress, TokenIdentifier},
};

elrond_wasm::derive_imports!();

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, ManagedVecItem, TypeAbi)]
pub struct TradeData<M: ManagedTypeApi> {
    pub id: u64,
    pub offer_address: ManagedAddress<M>,
    pub offer_asset_token: TokenIdentifier<M>,
    pub offer_asset_quantity: BigUint<M>,
    pub trader_address: Option<ManagedAddress<M>>,
    pub trader_asset_token: TokenIdentifier<M>,
    pub trader_asset_quantity: BigUint<M>,
}
