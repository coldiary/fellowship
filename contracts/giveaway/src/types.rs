use elrond_wasm::{
    api::ManagedTypeApi,
    types::{BigUint, ManagedAddress, Vec, TokenIdentifier},
};

elrond_wasm::derive_imports!();

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct GiveawayData<M: ManagedTypeApi> {
    pub creator_address: ManagedAddress<M>,
    pub token_identifier: TokenIdentifier<M>,
    pub delivery_plan: Vec<u8>,
    pub amount: BigUint<M>,
    pub registration_limit: Option<u64>,
    pub whitelist: Option<Vec<ManagedAddress<M>>>,
    pub claimed: Vec<ManagedAddress<M>>
}
