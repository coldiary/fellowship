use elrond_wasm::{
    api::ManagedTypeApi,
    types::{BigUint, ManagedAddress, ManagedVec, TokenIdentifier},
};

elrond_wasm::derive_imports!();

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi, PartialEq, Clone, Copy)]
pub enum Status {
    Open,
    Closed,
}

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct GiveawayData<M: ManagedTypeApi> {
    pub id: u64,
    pub creator_address: ManagedAddress<M>,
    pub token_identifier: TokenIdentifier<M>,
    pub delivery_plan: ManagedVec<M, u8>,
    pub amount: BigUint<M>,
    pub status: Status,
    pub registration_limit: Option<u64>,
    pub registration_deadline: Option<u64>,
    pub has_whitelist: bool,
}
