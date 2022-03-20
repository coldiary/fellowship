use elrond_wasm::{
    api::ManagedTypeApi,
    types::{BigUint, ManagedAddress, ManagedVec, TokenIdentifier},
};

elrond_wasm::derive_imports!();

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct GiveawayData<M: ManagedTypeApi> {
    pub creator_address: ManagedAddress<M>,
    pub token_identifier: TokenIdentifier<M>,
    pub delivery_plan: ManagedVec<M, u8>,
    pub amount: BigUint<M>,
    pub registration_limit: Option<u64>,
    pub whitelist: Option<ManagedVec<M, ManagedAddress<M>>>,
    pub claimed: ManagedVec<M, ManagedAddress<M>>
}
